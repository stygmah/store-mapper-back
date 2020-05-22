
import { Request, Response, response } from "express";
import EstablishmentsMap from "../../db/models/EstablishmentsMap";
import { Types } from "mongoose";
import { getUserFromAuth } from "../../middleware/auth";
import MapConfig from "../../db/models/MapConfig";

const path = "/maps";

export default [
    //Get Map
    {
        path: path+'/:id',//TODO add full option
        method: 'get',
        auth:false,
        handler: async (req: Request, res: Response) => 
        {
            let map = null;
            if(Types.ObjectId.isValid(req.params.id))  map= await EstablishmentsMap.findById(Types.ObjectId(req.params.id));
            if(map == null) {res.status(404).send();} else { res.send(map);}
        }
    },
    //Get Map
    {
        path: path+'/by_user/:full',
        method: 'get',
        auth:true,
        handler: async (req: Request, res: Response) => 
        {
            const full = JSON.parse(req.params.full);
            const user: Types.ObjectId = Types.ObjectId(req.body.user.user._id);
            let map = null;
            if(Types.ObjectId.isValid(user))  {
                if(!full){
                    map = await EstablishmentsMap.findOne({owner: user});
                    if(map == null) {res.status(404).send();} else { res.send(map);}
                }else{
                    let map = await EstablishmentsMap.findOne({owner: user});
                    if(map != null) {
                        const config = await MapConfig.findOne({parentMapId: map._id}).populate('theme');
                        map.config = config;
                        if(map == null) {res.status(404).send();} else { res.send(map);}
                    }
                }
            }else{
                res.status(400).send();
            }

        }
    },
    //Register new map
    {
        path:path,
        method: 'post',
        auth:true,
        handler: async (req: Request, res: Response) =>
        {
        const userId = req.body.user.user._id; //TODO fix
        if (userId !== null) {
            const establishmentsMap = new EstablishmentsMap
            ({
                owner: userId
            });
            const doc = await establishmentsMap.save();
            const config = new MapConfig
            ({
                parentMapId: doc._id
            });
            const docConfig = await config.save();

            res.send(doc);
        }
        else {res.status(401).send();}
        }
    },
    //Save config
    {
        path:path+'/save-config',
        method: 'post',
        auth:true,//make it secure
        handler: async (req: Request, res: Response) =>
        {
            const config = req.body.config;
            const id = Types.ObjectId(req.body.id);
            if(Types.ObjectId.isValid(id) && config)
            {
                const doc = MapConfig.findByIdAndUpdate({id},config);
                res.send(doc);
            }
            else
            {
                res.status(400).send();
            }
        }
    },
];

