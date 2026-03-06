import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;

    await db.collection("participants").aggregate([
      {
        $lookup: {
          from: "locations",
          localField: "address",
          foreignField: "_id",
          as: "locationData"
        }
      },
      {
        $unwind: {
          path: "$locationData",
          preserveNullAndEmptyArrays: true
        }
      },
      {
        $project: {
          _id: 1,              // explicitly keep _id
          name: 1,
          phone: 1,
          email: 1,
          sanghaResponsibility: 1,
          address: 1,
          locationData: 1
        }
      },
      {
        $merge: {
          into: "locations_merged",
          on: "_id",
          whenMatched: "merge",
          whenNotMatched: "insert"
        }
      }
    ]).toArray();

    return Response.json({
      message: "locations_merged created successfully"
    });

  } catch (error) {
    return Response.json({ error: error.message });
  }
}