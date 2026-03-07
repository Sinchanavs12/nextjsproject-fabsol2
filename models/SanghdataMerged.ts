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
  shakhe: String,
  upavasati: Schema.Types.ObjectId,
  vasati: Schema.Types.ObjectId,
  nagar: Schema.Types.ObjectId,
  bhag: Schema.Types.ObjectId,
  vibhag: Schema.Types.ObjectId,
  prant: Schema.Types.ObjectId,
  sanghaResponsibility: String,
  sanghShikshan: String,
  ssdata: Schema.Types.ObjectId
});

export default mongoose.model<ISanghdataMerged>(
  "sanghdata_merged",
  SanghdataMergedSchema
);