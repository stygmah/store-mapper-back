
import { Request, Response, response } from "express";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User from "../../db/models/User";

const path = "/users";
const saltRounds = 5;

export default [
  {
    path: path,
    method: "get",
    auth:true,
    handler: async (req: Request, res: Response) => 
    {
      res.send("Hello world!");
    }
  },
  {
    path:path,
    method: "post",
    auth:false,
    handler: async (req: Request, res: Response) =>
    {
      const userData = req.body;
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(userData.password, salt);
      const user = new User({
        ...userData,
        password: hash,
        salt: salt
      });
      //TODO: Remove password from response and define types for user
      const respsonse = await user.save();
      res.send(respsonse);
    }
  },
  {
    path:path+'/login',
    method:'post',
    auth:false,
    handler: async (req: Request, res: Response) =>
    {
      const loginData = req.body;
      const user = await User.findOne({email: loginData.email});
      if(user != null)
        {
          const match = await bcrypt.compare(loginData.password, user.password);
          if(match)
          {
            sendToken(res, user);
          } else {res.status(401).send();}
        } 
        else {res.status(401).send();}
    }
  }
];


const sendToken = (res: Response, user: any)=>{
  const secret: string = process.env.TOKEN_KEY ? process.env.TOKEN_KEY : 'ERROR';
  if(secret == 'ERROR') res.status(500).send('no secret');
  const token = jwt.sign({ user }, secret , {expiresIn: "24h"});
  res.json({
    user,
    token
  });
}