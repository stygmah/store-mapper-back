import { Types } from "mongoose";

export const mapConfigDefault = {
    mainOptions: {
        lat: 37.803180,
        lng: -122.408321,
        zoom: 15,
    },
    selectedSlidersValues: {
        label: 100,
        landmark: 100,
        road: 100
    },
    theme: Types.ObjectId(),
    marker: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
}