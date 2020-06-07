
import { Request, Response } from "express";
import * as aws from 'aws-sdk';
import { GetObjectRequest, DeleteObjectsRequest } from "aws-sdk/clients/s3";
import { DeleteObjectRequest } from "aws-sdk/clients/clouddirectory";


const path = "/upload";

aws.config.update({
    accessKeyId: process.env.S3_ACCESS_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
});
const s3 = new aws.S3();

export default [
    {
        path: path,
        method: 'post',
        auth:true,
        handler: async (req: Request, res: Response) => 
        {
            console.log(process.env.MAX_IMG_SIZE)
            const filename = `${req.body.user.user._id }_${new Date().getTime()}`
            try {
                if(!req.files) {
                    res.send({
                        status: false,
                        message: 'No file uploaded'
                    });
                } else {
                    //TODO: Check if image
                    let avatar: any = req.files.fileKey;
                    if(process.env.MAX_IMG_SIZE && avatar.size >  process.env.MAX_IMG_SIZE ){
                        res.status(400).send({
                            error: 'ERR_MAX_FILE_SIZE',
                            msg: 'Max file size exceeded'
                        })
                    }
                    //Use the mv() method to place the file in upload directory (i.e. "uploads")
                    //avatar.mv('./uploads/' + filename);
                    
                    const params = createS3Params(avatar,filename);

                    s3.upload(params, (err: any,data: any)=>{
                        if(err) console.log(err);

                        res.send({...data, name: data.key.substring(data.key.lastIndexOf('/')+1)})
                    });
                }
            } catch (err) {
                res.status(500).send(err);
            }
        }
    },
    {
        path: '/img/:key',
        method: 'get',
        auth:false,
        handler: async (req: Request, res: Response) => 
        {
            try {
                const img = await getElement('img/'+req.params.key)
                if(img.ContentType) res.setHeader('Content-Type',img.ContentType);
                if(img.ContentLength) res.setHeader('Content-Length',img.ContentLength);
                res.send(img.Body);
            } catch (err) {
                res.status(500).send(err);
            }
        }
    },
    {
        path: '/img/:key',
        method: 'delete',
        auth:true,
        handler: async (req: Request, res: Response) => 
        {

            const key = req.params.key;
            console.log('delete:'+key)
            const userId = req.body.user.user._id;

            if(validateOwnership(userId, key)){
                try {

                    const params = { 
                        Bucket: process.env.S3_BUCKET,
                        Key: 'img/'+key
                    } as GetObjectRequest;
                    s3.deleteObject(params, (err,data)=>{
                        if(err) res.status(500).send();
                        else res.send({status: 'DELETED'});
                    });

                } catch (err) {
                    console.log(err)
                    res.status(500).send(err);
                }
            }else{res.status(401).send()}


        }
    },
    //delete multiple imgs
    {
        path: '/img/delete-multiple',
        method: 'post',
        auth:true,
        handler: async (req: Request, res: Response) => 
        {
            const keys = keyToImgKeys(req.body.keys);
            const userId = req.body.user.user._id;
            if(validateMultipleOwnership(userId, req.body.keys)){
                try {
                    const params = { 
                        Bucket: process.env.S3_BUCKET,
                        Delete: {
                            Objects: keys
                        }
                    } as DeleteObjectsRequest;

                    s3.deleteObjects(params, (err,data)=>{
                        console.log('aqui stem')
                        if(err) res.status(500).send();
                        else res.send({status: 'DELETED'});
                    });

                } catch (err) {
                    console.log(err)
                    res.status(500).send(err);
                }
            }else{res.status(401).send()}
        }
    }
];

const createS3Params = (file:any, filename: string) => {
    const fileContent = Buffer.from(file.data, 'binary');
    return {
        Bucket: process.env.S3_BUCKET, 
        Key: `img/${filename}.${file.mimetype.substring(file.mimetype.lastIndexOf('/')+1)}`,
        Body: fileContent,
        ContentType: file.mimetype, //ACL: 'public-read'
    } as GetObjectRequest;
}

const getElement = async function getImage(key: string){
    const data =  s3.getObject(
        { 
            Bucket: process.env.S3_BUCKET,
            Key: key
        } as GetObjectRequest
    ).promise();
    return data;
}

const validateOwnership = (id: string, file: string): boolean => {
    return id === file.split("_")[0];
}

const validateMultipleOwnership = (id: string, files: string[]): boolean => {
    let match = true;
    files.forEach((file)=>{
        if (!validateOwnership(id, file)) { match = false}
    })
    return match;
}

const keyToImgKeys = (keyArray: string[]): any[] => {
    console.log(keyArray)
    let result:any[] = [];
    keyArray.forEach((key)=>{
        result.push({Key: 'img/'+key})
    });
    return result;
}