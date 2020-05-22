
import { Request, Response } from "express";
import * as aws from 'aws-sdk';
import { GetObjectRequest } from "aws-sdk/clients/s3";


const path = "/upload";

aws.config.update({
    accessKeyId: process.env.S3_ACCESS_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY,
    region: process.env.S3_REGION
});
const s3 = new aws.S3();

export default [
    //Get Map
    {
        path: path,
        method: 'post',
        auth:true,
        handler: async (req: Request, res: Response) => 
        {
            const filename = `${req.body.user.user._id }_${new Date().getTime()}`
            try {
                if(!req.files) {
                    res.send({
                        status: false,
                        message: 'No file uploaded'
                    });
                } else {
                    //Use the name of the input field (i.e. "avatar") to retrieve the uploaded file
                    let avatar: any = req.files.file;

                    //Use the mv() method to place the file in upload directory (i.e. "uploads")
                    //avatar.mv('./uploads/' + filename);
                    
                    const params = createS3Params(avatar,filename);

                    s3.upload(params, (err: any,data: any)=>{
                        if(err) console.log(err);
                        console.log(data.headers)
                        res.send({url: data})
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