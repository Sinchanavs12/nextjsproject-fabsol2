import mongoose, { Schema, Document } from "mongoose";

export interface ILocationsMerged extends Document {
  address?: string
  pincode?: string
  upavasati?: string
  name?: string
  phone?: string
}

const LocationsMergedSchema: Schema = new Schema({

  address: String,
  pincode: String,
  upavasati: String,

  // only for participants without location
  name: String,
  phone: String

});

export default mongoose.model<ILocationsMerged>(
  "locations_merged",
  LocationsMergedSchema
);