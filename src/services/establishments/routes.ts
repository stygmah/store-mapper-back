
import { Request, Response, response } from "express";

const path = "/establishments";

export default [
  {
    path: path,
    method: 'get',
    auth:true,
    handler: async (req: Request, res: Response) => 
    {

    }
  },
  {
    path:path,
    method: 'post',
    auth:false,
    handler: async (req: Request, res: Response) =>
    {

    }
  },
];


