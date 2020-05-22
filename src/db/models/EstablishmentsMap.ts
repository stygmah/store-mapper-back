import mongoose, { Schema, Document, SchemaType } from "mongoose";

export interface EstablishmentsMap extends Document {
  name: string;
  owner: any;
  config?:any;
}

const EstablishmentsMapSchema: Schema = new Schema({
  name: { type: String, required: true },
  owner: { type: Schema.Types.ObjectId, required: true , ref: 'User'},
  config: { type: Schema.Types.ObjectId, ref: 'MapConfig'}, //TODO
});

const EstablishmentsMap = mongoose.model<EstablishmentsMap>("EstablishmentsMap", EstablishmentsMapSchema);
export default EstablishmentsMap;