
import { Request, Response, response } from "express";
import { Types } from "mongoose";
import MapConfig from "../../db/models/MapConfig";
import MapTheme from "../../db/models/MapTheme";


const path = "/map";

export default [
    ///Get Establishment
    {
        path: path,
        method: 'get',
        auth:true,
        handler: async (req: Request, res: Response) => 
        {   
            const id = req.body.user.user._id;
            
            try{
                const mapConfig = await MapConfig.findOne({userId: id}).populate('theme');
                res.send(mapConfig);

            }catch (err){
                res.send(err);
            }
        }
    },
    ///Generate initial map
    {
        path: `${path}/init`,
        method: 'post',
        auth:true,
        handler: async (req: Request, res: Response) => 
        {   
            const id = req.body.user.user._id;
            try{
                const mapConfig = new MapConfig({
                    userId: id,
                    ...basicMap
                });
                const config = await mapConfig.save();
                res.send(config);

            }catch (err){
                res.status(500).send(err);
            }
        }
    },
    ///Generate initial map
    {
        path: `${path}`,
        method: 'post',
        auth:true,
        handler: async (req: Request, res: Response) => 
        {   
            const id = req.body.user.user._id;
            const config = req.body.config;
            try{
                const mapConfig = await MapConfig.findOneAndUpdate({userId: id}, config);
                console.log(mapConfig)
                res.send();

            }catch (err){
                res.status(500).send(err);
            }
        }
    }
];

const basicMap = {
    selectedSlidersValues: {
        label: 100,
        landmark: 100,
        road: 100
    },
    zoom: 15,
    location: 'LOCATION',
    coord: {lat: 37.803180, lon: -122.408321},
    propertiesArray: [],
    theme: Types.ObjectId("5ec79d609963602a2ffd1ecc")
}    