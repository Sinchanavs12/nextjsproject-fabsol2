import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

console.log("🚀 Starting merge process...");

await mongoose.connect(process.env.MONGODB_URI);
const db = mongoose.connection.db;

/* ======================================================
   1️⃣ CREATE ssdata_merged
====================================================== */

console.log("📦 Creating ssdata_merged...");

await db.collection("participants").aggregate([

  {
    $lookup: {
      from: "ssdatas",
      localField: "phone",
      foreignField: "phone",
      as: "ssdata"
    }
  },

  {
    $unwind: {
      path: "$ssdata",
      preserveNullAndEmptyArrays: true
    }
  },

  {
    $lookup: {
      from: "locations",
      localField: "address",
      foreignField: "_id",
      as: "location"
    }
  },

  {
    $unwind: {
      path: "$location",
      preserveNullAndEmptyArrays: true
    }
  },

  {
    $project: {

      _id: "$phone",   // ⭐ important fix

      name: 1,
      phone: 1,
      email: 1,

      responsibility: "$sanghaResponsibility",

      education: "$ssdata.education",
      profession: "$ssdata.profession",
      bloodGroup: "$ssdata.bloodGroup",

      location: "$location"
    }
  },

  {
    $merge: {
      into: "ssdata_merged",
      whenMatched: "merge",
      whenNotMatched: "insert"
    }
  }

]).toArray();

console.log("✅ ssdata_merged created");

//process.exit();