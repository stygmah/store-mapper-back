
import { Request, Response, response } from "express";

const path = "/map";

export default [
  //Get User
  {
    path: path,
    method: 'get',
    auth:true,
    handler: async (req: Request, res: Response) => 
    {
      res.send();
    }
  },
  //Register new user
  {
    path:path,
    method: 'post',
    auth:false,
    handler: async (req: Request, res: Response) =>
    {

    }
  },
];

