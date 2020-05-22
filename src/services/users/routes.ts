
import { Request, Response, response } from "express";
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import User from "../../db/models/User";

const path = "/users";
const saltRounds = 5;

export default [
  //Get User
  {
    path: path,
    method: 'get',
    auth:true,
    handler: async (req: Request, res: Response) => 
    {
      res.send(req.body.user);
    }
  },
  //Register new user
  {
        path:path+'/register',
        method: 'post',
        auth:false,
        handler: async (req: Request, res: Response) =>
        {
            const userData = req.body;
            const existingUser = await User.findOne({email:userData.email});
            if(existingUser == null){
                const salt = await bcrypt.genSalt(saltRounds);
                const hash = await bcrypt.hash(userData.password, salt);
                const user = new User({
                  ...userData,
                  password: hash,
                  salt: salt
                });
                const respsonse = await user.save();
                res.status(201).send();
            } else {
                res.status(409).send();
            }
        }
  },
  //Login
  {
    path:path+'/login',
    method:'post',
    auth:false,
    handler: async (req: Request, res: Response) =>
    {
      const loginData = req.body;
      const user:any = await User.findOne({email: loginData.email});
      if(user != null)
        {
			const match = await bcrypt.compare(loginData.password, user.password);
			if(match)
			{
				user.password = undefined;
				user.salt = undefined;
				sendToken(res, user);
			} else {res.status(401).send();}
        } 
        else {res.status(401).send();}
    }
  },
  ///Reset Password
  {
    path:path+'/reset-password',
    method:'post',
    auth:false,
    handler: async (req: Request, res: Response) =>
    {
		const email = req.body.email;
		const user:any = await User.findOne({email: email});
		if(!user){
			res.status(404).send();
		}else{
			res.send();//TODO: Add email password recovery functionality
		}
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