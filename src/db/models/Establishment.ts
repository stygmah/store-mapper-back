import mongoose, { Schema, Document } from "mongoose";

export interface Establishment extends Document {
  name: string;
  address: string;
  phone: string;
  email: string;
  url: string;
  description: string;
  productLines: string;
  imageUrl: string;
  customFields: string[];
  establishmentsMap: Schema.Types.ObjectId;
  owner: Schema.Types.ObjectId;
}

const EstablishmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  adress: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String},
  url: {type: String},
  description: {type: String},
  productLines: {type: String},
  imageUrl: {type: String},
  customFields:{type: [String]},
  establishmentsMap:{type: Schema.Types.ObjectId,  required: true, ref: 'EstablishmentsMap'}, 
  owner:{type: Schema.Types.ObjectId,  required: true, ref: 'User'}, 
});

const Establishment = mongoose.model<Establishment>("Establishment", EstablishmentSchema);
export default Establishment;