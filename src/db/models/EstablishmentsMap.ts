import mongoose, { Schema, Document } from "mongoose";

export interface EstablishmentsMap extends Document {
  name: string;
  establishments: Schema.Types.ObjectId[];
  owner: Schema.Types.ObjectId;
}

const EstablishmentsMapSchema: Schema = new Schema({
  name: { type: String, required: true },
  establishments: { type: [Schema.Types.ObjectId] ,ref: 'Establishment'},
  owner: { type: Schema.Types.ObjectId, required: true , ref: 'User'},
});

const EstablishmentsMap = mongoose.model<EstablishmentsMap>("EstablishmentsMap", EstablishmentsMapSchema);
export default EstablishmentsMap;