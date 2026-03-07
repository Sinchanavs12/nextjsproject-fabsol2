import mongoose from "mongoose";
import { connectDB } from "../config/db";

import SsdataMerged from "../models/SsdataMerged";
import SanghdataMerged from "../models/SanghdataMerged";
import LocationsMerged from "../models/LocationsMerged";

async function mergeCollections() {

  await connectDB();

  const db = mongoose.connection.db!;
  
  console.log("🚀 Starting merge");

  const participants = await db.collection("participants").find().toArray();
  const ssdatas = await db.collection("ssdatas").find().toArray();
  const sanghdatas = await db.collection("sanghdatas").find().toArray();
  const locations = await db.collection("locations").find().toArray();

  /* =====================================================
      CREATE ssdata_merged
  ===================================================== */

  console.log("Creating ssdata_merged...");

  const ssMergedDocs:any[] = [];

  // copy ssdatas
  for (const ss of ssdatas) {

    ssMergedDocs.push({
      name: ss.name,
      phone: ss.phone,
      email: ss.email,
      bloodGroup: ss.bloodGroup,
      currentAddress: ss.currentAddress,
      education: ss.education,
      profession: ss.profession,
      otherProfession: ss.otherProfession,
      dob: ss.dob
    });

  }

  const ssNames = new Set(ssdatas.map((s:any) => s.name));

  for (const p of participants) {

    if (!ssNames.has(p.name)) {

      ssMergedDocs.push({
        name: p.name,
        phone: p.phone,
        email: p.email,
        profession: p.profession,
        otherProfession: p.otherProfession,
        dob: p.dob
      });

    }

  }

  await SsdataMerged.insertMany(ssMergedDocs);

  console.log("✅ ssdata_merged completed");


  /* =====================================================
      CREATE sanghdata_merged
  ===================================================== */

  console.log("Creating sanghdata_merged...");

  const sanghMergedDocs:any[] = [];

  // copy sanghdatas
  for (const s of sanghdatas) {

    sanghMergedDocs.push({
      shakhe: s.shakhe,
      upavasati: s.upavasati,
      vasati: s.vasati,
      nagar: s.nagar,
      bhag: s.bhag,
      vibhag: s.vibhag,
      prant: s.prant,
      sanghaResponsibility: s.sanghaResponsibility,
      sanghShikshan: s.sanghShikshan,
      ssdata: s.ssdata
    });

  }

  const sanghUsers = new Set(sanghdatas.map((s:any) => s.ssdata?.toString()));

  for (const p of participants) {

  if (!p._id) continue;

  const participantId = p._id.toString();

  if (!sanghUsers.has(participantId) && p.sanghaResponsibility) {

    sanghMergedDocs.push({
      _id: new mongoose.Types.ObjectId(),
      sanghaResponsibility: p.sanghaResponsibility
    });

  }

}

  await SanghdataMerged.insertMany(sanghMergedDocs);

  console.log("✅ sanghdata_merged completed");

  /* =====================================================
   CREATE locations_merged
===================================================== */

console.log("Creating locations_merged...");

const locationMergedDocs:any[] = [];

/* 1️⃣ Copy all locations */

for (const loc of locations) {

  locationMergedDocs.push({
    address: loc.address,
    pincode: loc.pincode,
    upavasati: loc.upavasati
  });

}

/* 2️⃣ Add participants without location */

const locationIds = new Set(
  locations.map((l:any) => l._id.toString())
);

for (const p of participants) {

  if (!p.address || !locationIds.has(p.address.toString())) {

    locationMergedDocs.push({
      name: p.name,
      phone: p.phone
    });

  }

}

await LocationsMerged.insertMany(locationMergedDocs, { ordered:false });

console.log("✅ locations_merged completed");

  process.exit();
}

mergeCollections();