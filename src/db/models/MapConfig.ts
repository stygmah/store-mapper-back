import mongoose, { Schema, Document, Types } from "mongoose";


export interface MapConfig extends Document {
    userId: Schema.Types.ObjectId;
    coord: {
        lat: number,
        lng: number,
    }
    zoom: number,
    selectedSlidersValues: {
        label: number,
        landmark: number,
        road: number
    };
    theme: Schema.Types.ObjectId;
    marker: string;
}

const MapConfigSchema: Schema = new Schema({
    userId:{type: Schema.Types.ObjectId, unique : true, required: true}, 
    coord:
    {
        lat:{type: Number,  required: true, default: 37.803180}, 
        lng:{type: Number,  required: true, default: -122.408321}, 
    },
    zoom:{type: Number,  required: true, default: 15}, 
    location:{type: String,  required: true, default: ''}, 
    selectedSlidersValues:
    {
        label:{type: Number,  required: true, default: 100}, 
        landmark:{type: Number,  required: true, default: 100}, 
        road:{type: Number,  required: true, default: 100}, 
    },
    theme:{type: Schema.Types.ObjectId,  required: true, ref: 'MapTheme'},  
    marker:{type: String,  required: true, default: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'}, 

});

MapConfigSchema.pre('save', function(next) {
    //ADD DEFAULT MAP THEME IF EMPTY
    next()
})

const MapConfig = mongoose.model<MapConfig>("MapConfig", MapConfigSchema);
export default MapConfig;
