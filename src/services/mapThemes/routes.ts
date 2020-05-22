
import { Request, Response, response } from "express";
import { Types } from "mongoose";
import MapTheme from "../../db/models/MapTheme";

const path = "/themes";

export default [
    //Get Map
    {
        path: path+'/:id',
        method: 'get',
        auth:false,
        handler: async (req: Request, res: Response) => 
        {
            let theme = null;
            if(Types.ObjectId.isValid(req.params.id))  theme = await MapTheme.findById(Types.ObjectId(req.params.id));
            if(theme == null) {res.status(404).send();} else { res.send(theme);}
        }
    },
    //Register new map
    {
        path:path,
        method: 'post',
        auth:false, //TODO: Allow only admin
        handler: async (req: Request, res: Response) =>
        {
            if (req.body.theme !== null) {
                const theme = new MapTheme(req.body.theme);
                const doc = await theme.save();
                res.send(doc);
            }
            else {res.status(400).send();}
        }
    },
    //Get Map Page
    {
        path: path+'/page/:page',
        method: 'get',
        auth:false,
        handler: async (req: Request, res: Response) => 
        {
            const page:number =  req.params.page ? parseInt(req.params.page) : 0;
            const doc = await MapTheme.find({}, null, { skip: page*10, limit: 10 }).sort('order').select('-properties');
            res.send(doc);
        }
    },
];