import { Router, Request, Response, NextFunction } from "express";
import { handleAuthRoutes } from "../middleware/auth";

//Type Declarations
type Wrapper = ((router: Router) => void);

type Handler = (
    req: Request,
    res: Response,
    next: NextFunction
) => Promise<void> | void;

type Route = {
    path: string;
    method: string;
    auth: boolean;
    handler: Handler | Handler[];
};

//Apply Middleware
export const applyMiddleware = (middlewareWrappers: Wrapper[],router: Router) => {
    for (const wrapper of middlewareWrappers) {
        wrapper(router);
    }
};
//Apply Routes
export const applyRoutes = (routes: Route[], router: Router) => {
    for (const route of routes) {
        //Can apply auth here
        const { method, path, handler, auth } = route;
        if(auth){
            (router as any)[method](path, handleAuthRoutes, handler);
        }else{
            (router as any)[method](path, handler);
        }

    }
};

