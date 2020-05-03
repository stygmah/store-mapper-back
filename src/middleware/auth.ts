import { Router , NextFunction, Response, Request} from "express";
import * as jwt from 'jsonwebtoken';


export const handleAuthRoutes = (req: Request, res: Response, next: NextFunction) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader; //Check security of this
    if (token == null) return res.sendStatus(401) 
    jwt.verify(token, process.env.TOKEN_KEY as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.body.user = user;
        next() 
    })
}



