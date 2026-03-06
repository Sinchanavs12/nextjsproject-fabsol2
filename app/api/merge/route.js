import { connectDB } from "@/lib/mongodb";
import mongoose from "mongoose";

export async function GET() {
  try {
    await connectDB();
    const db = mongoose.connection.db;

    // Merge participants
    await db.collection("participants").aggregate([
      { $out: "sanghdatas_merged" }
    ]).toArray();

    // Append sanghdatas
    await db.collection("sanghdatas").aggregate([
      { $merge: { into: "sanghdatas_merged", whenMatched: "keepExisting", whenNotMatched: "insert" } }
    ]).toArray();

    return Response.json({ message: "Fast merge completed" });

  } catch (error) {
    return Response.json({ error: error.message });
  }
}