import mongoose from "mongoose";
import xlsx from "xlsx";
import dotenv from "dotenv";
import models from "../models/Sangha.js";

dotenv.config({ path: ".env" });

const { Sthara, Entity, ParentEntity } = models;

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
  // 1️⃣ Load caches
  // -----------------------------
  const stharaNames = ["Pranth", "Vibhag", "Taluku", "Mandala", "Grama"];
  const stharaCache = {};
  const entityCache = {}; // key = `${name}_${stharaId}`

  // load existing sthara
  const existingSthara = await Sthara.find({ name: { $in: stharaNames } });
  existingSthara.forEach((s) => (stharaCache[s.name] = s));

  // create missing sthara
  const missingStharaNames = stharaNames.filter((name) => !stharaCache[name]);
  if (missingStharaNames.length > 0) {
    const newStharas = await Sthara.insertMany(
      missingStharaNames.map((name) => ({ name }))
    );
    newStharas.forEach((s) => (stharaCache[s.name] = s));
  }

  // preload existing entities
  const entities = await Entity.find({});
  entities.forEach((e) => {
    const key = `${e.name}_${e.sthara}`;
    entityCache[key] = e;
  });

  // -----------------------------
  // 2️⃣ Prepare bulk inserts
  // -----------------------------
  const newEntities = [];
  const parentLinksSet = new Set();

  rows.forEach((row, idx) => {
    const pranth = row["Jilla / Bhag"];
    const vibhag = row["Vibhaga"];
    const taluku = row["Taluku / Nagara"];
    const mandala = row["Mandala / Vasati"];
    const grama = row["Grama / Upavasathi"];

    const stharas = {
      Pranth: stharaCache["Pranth"],
      Vibhag: stharaCache["Vibhag"],
      Taluku: stharaCache["Taluku"],
      Mandala: stharaCache["Mandala"],
      Grama: stharaCache["Grama"],
    };

    // Helper to get or create entity
    function getOrAddEntity(name, sthara) {
      if (!name) return null;
      const key = `${name}_${sthara._id}`;
      if (entityCache[key]) return entityCache[key];

      // not found → create new entity object (bulk insert later)
      const newEntity = { name, sthara: sthara._id };
      newEntities.push(newEntity);
      entityCache[key] = newEntity; // temporarily store with _id undefined
      return newEntity;
    }

    const ePranth = getOrAddEntity(pranth, stharas.Pranth);
    const eVibhag = getOrAddEntity(vibhag, stharas.Vibhag);
    const eTaluku = getOrAddEntity(taluku, stharas.Taluku);
    const eMandala = getOrAddEntity(mandala, stharas.Mandala);
    const eGrama = getOrAddEntity(grama, stharas.Grama);

    // Prepare parent links
    function addParent(child, parent) {
      if (!child || !parent) return;
      const key = `${child.name}_${parent.name}_${child.sthara}_${parent.sthara}`;
      parentLinksSet.add(key);
    }

    addParent(eVibhag, ePranth);
    addParent(eTaluku, eVibhag);
    addParent(eMandala, eTaluku);
    addParent(eGrama, eMandala);

    if ((idx + 1) % 1000 === 0) console.log(`🚀 Processed ${idx + 1} rows`);
  });

  // -----------------------------
  // 3️⃣ Insert new entities
  // -----------------------------
  if (newEntities.length > 0) {
    const insertedEntities = await Entity.insertMany(newEntities, {
      ordered: false,
    });
    // update cache with real _id
    insertedEntities.forEach((e) => {
      const key = `${e.name}_${e.sthara}`;
      entityCache[key] = e;
    });
  }

  // -----------------------------
  // 4️⃣ Insert ParentEntity links
  // -----------------------------
  const parentLinks = Array.from(parentLinksSet).map((key) => {
    const [childName, parentName, childStharaId, parentStharaId] = key.split("_");
    const child = entityCache[`${childName}_${childStharaId}`];
    const parent = entityCache[`${parentName}_${parentStharaId}`];
    return { currentEntity: child._id, parentEntity: parent._id };
  });

  if (parentLinks.length > 0) {
    await ParentEntity.insertMany(parentLinks, { ordered: false });
  }

  console.log("🎉 Hierarchy uploaded successfully!");
  process.exit();
}

upload();