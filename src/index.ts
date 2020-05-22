
import 'dotenv/config';
import http from "http";
import express from "express";
import { applyMiddleware, applyRoutes } from "./utils";
import routes from "./services";
import middleware from "./middleware";
import errorHandlers from "./middleware/errorHandlers";
import connect from './db/index';
const fileUpload = require('express-fileupload');


process.on("uncaughtException", e => {
    console.log(e);
    process.exit(1);
});
process.on("unhandledRejection", e => {
    console.log(e);
    process.exit(1);
});

const router = express();

///manual routes
router.use(fileUpload({
    createParentPath: true
}));


///

applyMiddleware(middleware, router);
applyRoutes(routes, router);
applyMiddleware(errorHandlers, router);



///manual routes
router.use(fileUpload({
    createParentPath: true
}));


///

const { PORT = 3000 } = process.env;
const server = http.createServer(router);
const db: string = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASSWORD}@ds363058.mlab.com:63058/cartografy_stage`;

connect(db);

server.listen(PORT, () =>
    console.log(`Server is running http://localhost:${PORT}...`)
);