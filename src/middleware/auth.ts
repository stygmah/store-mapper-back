import { Router , NextFunction, Response, Request} from "express";
import * as jwt from 'jsonwebtoken';

type ProtectedRoute = {
    path: string;
    method: string;
};

export const protectedRoutes: ProtectedRoute[] = [
    {
        method: 'get',
        path:'/users',
    }
];



const auth = (req: Request, res: Response, next: NextFunction) =>{
    const authHeader = req.headers['authorization']
    const token = authHeader; //Check security of this
    console.log(token)
    if (token == null) return res.sendStatus(401) 

    jwt.verify(token, process.env.TOKEN_KEY as string, (err: any, user: any) => {
        if (err) return res.sendStatus(403);
        req.body.user = user;
        console.log(user);
        next() 
    })
}


export const handleAuthRoutes = (router: Router) => {
    let method: string;

    for(let i = 0; i < protectedRoutes.length; i++)
    {
        if(protectedRoutes[i].method == 'get'){
            router.get(protectedRoutes[i].path,auth);
        }
        else if(protectedRoutes[i].method == 'post')
        {
            router.post(protectedRoutes[i].path,auth);
        }
        else if(protectedRoutes[i].method == 'put')
        {
            router.put(protectedRoutes[i].path,auth);
        }
        else if(protectedRoutes[i].method == 'delete')
        {
            router.delete(protectedRoutes[i].path,auth);
        }
        //TODO: Change
    }
};
