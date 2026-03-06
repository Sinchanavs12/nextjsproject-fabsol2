import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: ".env" });

console.log("🚀 Starting FAST sanghdata merge...");

await mongoose.connect(process.env.MONGODB_URI);

const db = mongoose.connection.db;

await db.collection("participants").aggregate([

  {
    $lookup: {
      from: "sanghdatas",
      localField: "sanghaResponsibility",
      foreignField: "sanghaResponsibility",
      as: "sangh"
    }
  },

  {
    $unwind: "$sangh"
  },

  {
    $project: {

      _id: "$_id",   // keep participant id

      name: 1,
      phone: 1,
      email: 1,

      responsibility: "$sanghaResponsibility",

      sanghLevel: "$sangh.level",
      sanghDepartment: "$sangh.department",

      participantData: "$$ROOT"
    }
  },

  {
    $merge: {
      into: "sanghdata_merged",
      whenMatched: "replace",
      whenNotMatched: "insert"
    }
  }

]).toArray();

console.log("✅ sanghdata_merged created successfully");

process.exit();