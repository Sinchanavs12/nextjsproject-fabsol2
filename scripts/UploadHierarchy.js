import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";
import models from "../models/Sangha.js";

dotenv.config({ path: ".env" });

const { Sthara, Entity, ParentEntity } = models;

/* --------------------------------------------------
   🔹 Normalize Name Function
   Converts:
   "MANGALURU" → "Mangaluru"
   "  mangaluru  " → "Mangaluru"
-------------------------------------------------- */
function normalizeName(name) {
  if (!name) return null;

  return name
    .toString()
    .trim()
    .replace(/\s+/g, " ") // remove extra spaces
    .toLowerCase()
    .split(" ")
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.log("❌ DB Connection Error:", err);
    process.exit(1);
  }
}

async function upload() {
  await connectDB();

  console.log("📂 Reading Excel file...");
  const workbook = xlsx.readFile("./data/prantha-data.xlsx");
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet);
  console.log("📊 Total Rows Found:", rows.length);

  // -----------------------------
  // 1️⃣ Load Sthara Cache
  // -----------------------------
  const stharaNames = ["Pranth", "Vibhag", "Taluku", "Mandala", "Grama"];
  const stharaCache = {};
  const entityCache = {}; // key = `${normalizedName}_${stharaId}`

  const existingSthara = await Sthara.find({ name: { $in: stharaNames } });
  existingSthara.forEach((s) => (stharaCache[s.name] = s));

  const missingStharaNames = stharaNames.filter((name) => !stharaCache[name]);
  if (missingStharaNames.length > 0) {
    const newStharas = await Sthara.insertMany(
      missingStharaNames.map((name) => ({ name }))
    );
    newStharas.forEach((s) => (stharaCache[s.name] = s));
  }

  // -----------------------------
  // 2️⃣ Preload Existing Entities
  // -----------------------------
  const entities = await Entity.find({});
  entities.forEach((e) => {
    const normalized = normalizeName(e.name);
    const key = `${normalized}_${e.sthara.toString()}`;
    entityCache[key] = e;
  });

  const newEntities = [];
  const parentLinksSet = new Set();

  // -----------------------------
  // 3️⃣ Process Excel Rows
  // -----------------------------
  rows.forEach((row, idx) => {
    const pranth = normalizeName(row["Jilla / Bhag"]);
    const vibhag = normalizeName(row["Vibhaga"]);
    const taluku = normalizeName(row["Taluku / Nagara"]);
    const mandala = normalizeName(row["Mandala / Vasati"]);
    const grama = normalizeName(row["Grama / Upavasathi"]);

    const stharas = {
      Pranth: stharaCache["Pranth"],
      Vibhag: stharaCache["Vibhag"],
      Taluku: stharaCache["Taluku"],
      Mandala: stharaCache["Mandala"],
      Grama: stharaCache["Grama"],
    };

    function getOrAddEntity(name, sthara) {
      if (!name || !sthara) return null;

      const key = `${name}_${sthara._id.toString()}`;
      if (entityCache[key]) return entityCache[key];

      const newEntity = { name, sthara: sthara._id };
      newEntities.push(newEntity);
      entityCache[key] = newEntity;

      return newEntity;
    }

    const ePranth = getOrAddEntity(pranth, stharas.Pranth);
    const eVibhag = getOrAddEntity(vibhag, stharas.Vibhag);
    const eTaluku = getOrAddEntity(taluku, stharas.Taluku);
    const eMandala = getOrAddEntity(mandala, stharas.Mandala);
    const eGrama = getOrAddEntity(grama, stharas.Grama);

    function addParent(child, parent) {
      if (!child || !parent) return;

      const key = `${child.name}_${parent.name}_${child.sthara}_${parent.sthara}`;
      parentLinksSet.add(key);
    }

    addParent(eVibhag, ePranth);
    addParent(eTaluku, eVibhag);
    addParent(eMandala, eTaluku);
    addParent(eGrama, eMandala);

    if ((idx + 1) % 1000 === 0)
      console.log(`🚀 Processed ${idx + 1} rows`);
  });

  // -----------------------------
  // 4️⃣ Insert New Entities
  // -----------------------------
  if (newEntities.length > 0) {
    const insertedEntities = await Entity.insertMany(newEntities, {
      ordered: false,
    });

    insertedEntities.forEach((e) => {
      const normalized = normalizeName(e.name);
      const key = `${normalized}_${e.sthara.toString()}`;
      entityCache[key] = e;
    });

    console.log("✅ New Entities Inserted:", insertedEntities.length);
  }

  // -----------------------------
  // 5️⃣ Insert Parent Links
  // -----------------------------
  const parentLinks = Array.from(parentLinksSet).map((key) => {
    const [childName, parentName, childStharaId, parentStharaId] =
      key.split("_");

    const child = entityCache[`${childName}_${childStharaId}`];
    const parent = entityCache[`${parentName}_${parentStharaId}`];

    if (!child || !parent) return null;

    return {
      currentEntity: child._id,
      parentEntity: parent._id,
    };
  }).filter(Boolean);

  if (parentLinks.length > 0) {
    await ParentEntity.insertMany(parentLinks, { ordered: false });
    console.log("✅ Parent Links Inserted:", parentLinks.length);
  }

  console.log("🎉 Hierarchy uploaded successfully!");
  process.exit();
}

upload();