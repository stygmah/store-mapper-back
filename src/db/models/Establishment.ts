import mongoose, { Schema, Document } from "mongoose";

export interface Establishment extends Document {
  name: string;
  address: string;
  country: any;
  city: string;
  phone: string;
  email: string;
  website: string;
  description: string;
  imageUrl: string;
  categories: string[];
  owner: Schema.Types.ObjectId;
  geolocationActive: boolean;
  lat: string;
  lon: string;
}

const EstablishmentSchema: Schema = new Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  country: { type: Schema.Types.Mixed, required: true },
  city: { type: String, required: true },
  phone: { type: String},
  email: { type: String},
  website: {type: String},
  description: {type: String},
  imageUrl: {type: String},
  categories:{type: [String]},
  owner:{type: Schema.Types.ObjectId,  required: true, ref: 'User'}, 
  geolocationActive:{type: Boolean},
  lat: { type: String},
  lon: { type: String},
},{timestamps: true});

const Establishment = mongoose.model<Establishment>("Establishment", EstablishmentSchema);
export default Establishment;