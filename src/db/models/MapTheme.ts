import mongoose, { Schema, Document, Types } from "mongoose";

export interface MapTheme extends Document {
    name: string;
    imgURL: string;
    description: string;
    properties: any[];
    order: number;
}

const MapThemeSchema: Schema = new Schema({
    name: { type: String, required: true, unique : true },//TODO: Change to multilang
    imgURL: { type: String, required: true },
    order: {type: Number, required: true},
    description: { type: String},
    properties: { type: [Schema.Types.Mixed], required: true , default: []},
});

const MapTheme = mongoose.model<MapTheme>("MapTheme", MapThemeSchema);
export default MapTheme;