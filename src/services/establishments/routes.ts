
import { Request, Response, response } from "express";
import { Types } from "mongoose";
import Establishment from "../../db/models/Establishment";
import { stringify } from "querystring";

const path = "/establishments";

export default [
    ///Get Establishment
    {
        path: path+'/:id',
        method: 'get',
        auth:true,
        handler: async (req: Request, res: Response) => 
        {
            let establishment = null;
            if(Types.ObjectId.isValid(req.params.id))  establishment= await Establishment.findById(Types.ObjectId(req.params.id)).select("-createdAt -updatedAt");
            if(establishment == null) {
                res.status(404).send();
            } else { 
                if(establishment.owner == req.body.user.user._id){
                    res.send(establishment);
                }else{
                    res.status(401).send();
                }
            }
        }
    },
    ///Get Establishment Page
    ///params=> id:ObjectID(id of user) order:string(field to rder by) direction:string(asc/desc) page:int(page #) size:int(page size)
    ///
    {
        path: path+'/list/:order&:direction&:page&:size',
        method: 'get',
        auth:true,
        handler: async (req: Request, res: Response) => 
        {
            const user = req.body.user.user._id;
            const order = req.params.order ? req.params.order : '_id';
            const direction = req.params.direction === 'desc' ? '-' : '';
            const page = req.params.page ? Number(req.params.page) -1 : 0;
            const size = Number(req.params.size);


            if(Types.ObjectId.isValid(user)){
                const doc = await Establishment.find({owner: user}).select("-createdAt -updatedAt").sort(direction+order).skip(page*size).limit(size);
                const count = await Establishment.count({owner: user});
                res.send({data:doc, count});
            }else{
                res.status(401).send();
            }

        }
    },
    //Create Establishment
    {
        path:path,
        method: 'post',
        auth:true,
        handler: async (req: Request, res: Response) =>
        {
            const user = req.body.user.user;
            if(user == null)
            { 
                res.status(401).send()
            }
            else
            {//Test if error 400
                const establishment = new Establishment
                ({
                    ...req.body.establishment,
                    owner: Types.ObjectId( user?._id),
                });
                const doc = await establishment.save();
                res.send(doc);
            }
        }
    },

    //Edit  establishment
    {
        path:path+'/get/:id',
        method: 'post',
        auth:true,
        handler: async (req: Request, res: Response) =>
        {
            const user = req.body.user.user;//TODO: Check if same user
            const id = Types.ObjectId(req.params.id);
            const establishment = cleanUndesiredFields(req.body.establishment);
            const doc = await Establishment.findOneAndUpdate({_id:id,owner:user._id},establishment);
            if(doc != null) {res.send(doc);} else {res.status(404).send()}
        }
    },

    //Delete establishment
    {
        path:path+'/delete',
        method: 'post',
        auth:true, 
        handler: async (req: Request, res: Response) =>
        {   
            const query = getObjectsToReference(req.body.ids, req.body.user.user._id);
            const doc = await Establishment.deleteMany(query);
            console.log(query)
            console.log(doc.deletedCount)
            if(doc != null) {res.send(doc);} else {res.status(404).send()}
        }
    },
    
];


const cleanUndesiredFields = (establishment: any)=>{
    if(establishment.owner) establishment.owner = undefined;
    if(establishment.establishmentsMap) establishment.establishmentsMap = undefined;
    return establishment;
}

const getObjectsToReference = (ids: string[], userId: string): any => {
    let queries: any[] = [];
    ids.forEach((element)=>{
        queries.push(Types.ObjectId(element));
    })
    return {_id: {$in:queries}, owner:Types.ObjectId(userId) };
}
