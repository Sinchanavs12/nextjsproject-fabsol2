import mongoose, { Schema, Document } from "mongoose";

export interface ISsdataMerged extends Document {
  name: string;
  phone: string;
  email?: string;
  bloodGroup?: string;
  currentAddress?: mongoose.Types.ObjectId;
  education?: string;
  profession?: string;
  otherProfession?: string;
  dob?: string;
}

const SsdataMergedSchema: Schema = new Schema({
  name: String,
  phone: String,
  email: String,
  bloodGroup: String,
  currentAddress: Schema.Types.ObjectId,
  education: String,
  profession: String,
  otherProfession: String,
  dob: String
});

export default mongoose.model<ISsdataMerged>(
  "ssdata_merged",
  SsdataMergedSchema
);