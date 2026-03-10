import mongoose, { Schema, Document } from "mongoose";

export interface ISanghdataMerged extends Document {
  shakhe?: string;
  upavasati?: mongoose.Types.ObjectId;
  vasati?: mongoose.Types.ObjectId;
  nagar?: mongoose.Types.ObjectId;
  bhag?: mongoose.Types.ObjectId;
  vibhag?: mongoose.Types.ObjectId;
  prant?: mongoose.Types.ObjectId;
  sanghaResponsibility?: string;
  sanghShikshan?: string;
  ssdata?: mongoose.Types.ObjectId;
}

const SanghdataMergedSchema: Schema = new Schema({

  shakhe: {
    type: String
  },

  upavasati: {
    type: Schema.Types.ObjectId
  },

  vasati: {
    type: Schema.Types.ObjectId
  },

  nagar: {
    type: Schema.Types.ObjectId
  },

  bhag: {
    type: Schema.Types.ObjectId
  },

  vibhag: {
    type: Schema.Types.ObjectId
  },

  prant: {
    type: Schema.Types.ObjectId
  },

  sanghaResponsibility: {
    type: String
  },

  sanghShikshan: {
    type: String
  },

  ssdata: {
    type: Schema.Types.ObjectId,
    ref: "ssdata_merged"
  }

});

export default mongoose.model<ISanghdataMerged>(
  "sanghdata_merged",
  SanghdataMergedSchema
);