import mongoose, { Schema, Document } from "mongoose";

export interface ILocationsMerged extends Document {
  address?: string;
  pincode?: string;
  upavasati?: string;

  // for participants without location
  name?: string;
  phone?: string;
}

const LocationsMergedSchema: Schema = new Schema({

  address: {
    type: String
  },

  pincode: {
    type: String
  },

  upavasati: {
    type: String
  },

  // Only used when participant has no location reference
  name: {
    type: String
  },

  phone: {
    type: String
  }

});

export default mongoose.model<ILocationsMerged>(
  "locations_merged",
  LocationsMergedSchema
);