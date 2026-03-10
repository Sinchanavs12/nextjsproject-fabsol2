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
  job?: string;
  dob?: string;
}

const SsdataMergedSchema: Schema = new Schema({

  name: {
    type: String
  },

  phone: {
    type: String
  },

  email: {
    type: String
  },

  bloodGroup: {
    type: String
  },

  currentAddress: {
    type: Schema.Types.ObjectId,
    ref: "locations_merged"
  },

  education: {
    type: String
  },

  profession: {
    type: String
  },

  otherProfession: {
    type: String
  },

  job: {
    type: String
  },

  dob: {
    type: String
  }

});

export default mongoose.model<ISsdataMerged>(
  "ssdata_merged",
  SsdataMergedSchema
);