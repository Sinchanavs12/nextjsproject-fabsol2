import mongoose from "mongoose";
import { connectDB } from "../config/db";

import SsdataMerged from "../models/SsdataMerged";
import SanghdataMerged from "../models/SanghdataMerged";
import LocationsMerged from "../models/LocationsMerged";

async function mergeCollections() {

  await connectDB();

  const db = mongoose.connection.db!;

  console.log("🚀 Starting merge");

  console.log("Loading participants...");
  const participants = await db.collection("participants").find().toArray();
  console.log("Participants loaded:", participants.length);

  console.log("Loading ssdatas...");
  const ssdatas = await db.collection("ssdatas").find().toArray();
  console.log("SSDatas loaded:", ssdatas.length);

  console.log("Loading sanghdatas...");
  const sanghdatas = await db.collection("sanghdatas").find().toArray();
  console.log("Sanghdatas loaded:", sanghdatas.length);

  console.log("Loading locations...");
  const locations = await db.collection("locations").find().toArray();
  console.log("Locations loaded:", locations.length);

  /* =====================================================
      CREATE locations_merged
  ===================================================== */

  console.log("Creating locations_merged...");

  const locationMergedDocs:any[] = [];
  const locationIdMap = new Map();

  for (const loc of locations) {

    const newId = new mongoose.Types.ObjectId();

    locationIdMap.set(loc._id.toString(), newId);

    locationMergedDocs.push({
      _id: newId,
      address: loc.address,
      pincode: loc.pincode,
      upavasati: loc.upavasati
    });

  }

  const locationIds = new Set(locations.map((l:any) => l._id.toString()));

  for (const p of participants) {

    if (!p.address || !locationIds.has(p.address.toString())) {

      locationMergedDocs.push({
        _id: new mongoose.Types.ObjectId(),
        name: p.name,
        phone: p.phone
      });

    }

  }

  await LocationsMerged.insertMany(locationMergedDocs,{ordered:false});

  console.log("✅ locations_merged completed");


  /* =====================================================
      CREATE ssdata_merged
  ===================================================== */

  console.log("Creating ssdata_merged...");

  const ssMergedDocs:any[] = [];
  const ssdataIdMap = new Map();

  for (const ss of ssdatas) {

    const newId = new mongoose.Types.ObjectId();

    ssdataIdMap.set(ss._id.toString(), newId);

    ssMergedDocs.push({
      _id: newId,
      name: ss.name,
      phone: ss.phone,
      email: ss.email,
      bloodGroup: ss.bloodGroup,
      currentAddress: locationIdMap.get(ss.currentAddress?.toString()),
      education: ss.education,
      profession: ss.profession,
      otherProfession: ss.otherProfession,
      job: ss.job,
      dob: ss.dob
    });

  }

  const ssUsers = new Set(ssdatas.map((s:any)=>`${s.name}-${s.phone}`));

  for(const p of participants){

    const key = `${p.name}-${p.phone}`;

    if(!ssUsers.has(key)){

      ssMergedDocs.push({
        _id: new mongoose.Types.ObjectId(),
        name:p.name,
        phone:p.phone,
        email:p.email,
        profession:p.profession,
        otherProfession:p.otherProfession,
        job:p.job,
        dob:p.dob
      });

    }

  }

  await SsdataMerged.insertMany(ssMergedDocs, { ordered: false });

  console.log("✅ ssdata_merged completed");


/* =====================================================
    CREATE sanghdata_merged (FAST VERSION)
===================================================== */

console.log("Creating sanghdata_merged...");

const sanghMergedDocs: any[] = [];

/* 1️⃣ Create fast lookup maps */

// participantId → participant
const participantMap = new Map(
  participants.map((p: any) => [p._id?.toString(), p])
);

// name+phone → ssdata_merged document
const ssMergedLookup = new Map(
  ssMergedDocs.map((ss: any) => [`${ss.name}-${ss.phone}`, ss])
);

/* 2️⃣ Process sanghdatas */

for (const s of sanghdatas) {

  const participant = participantMap.get(s.ssdata?.toString());

  let newSsId = null;

  if (participant) {
    const key = `${participant.name}-${participant.phone}`;
    const ssMerged = ssMergedLookup.get(key);

    if (ssMerged) {
      newSsId = ssMerged._id;
    }
  }

  sanghMergedDocs.push({

    _id: new mongoose.Types.ObjectId(),

    shakhe: s.shakhe,
    upavasati: s.upavasati,
    vasati: s.vasati,
    nagar: s.nagar,
    bhag: s.bhag,
    vibhag: s.vibhag,
    prant: s.prant,

    sanghaResponsibility: s.sanghaResponsibility,
    sanghShikshan: s.sanghShikshan,

    // reference new ssdata_merged
    ssdata: newSsId

  });

}


/* 3️⃣ Add participants with responsibility but no sanghdata */

const sanghUsers = new Set(
  sanghdatas.map((s: any) => s.ssdata?.toString())
);

for (const p of participants) {

  if (!p._id) continue;

  const id = p._id.toString();

  if (!sanghUsers.has(id) && p.sanghaResponsibility) {

    sanghMergedDocs.push({

      _id: new mongoose.Types.ObjectId(),
      sanghaResponsibility: p.sanghaResponsibility

    });

  }

}


/* 4️⃣ Insert into database */

await SanghdataMerged.insertMany(sanghMergedDocs, { ordered: false });

console.log("✅ sanghdata_merged completed");

process.exit();
}

mergeCollections();