
import {handleCors, handleBodyRequestParsing, handleCompression} from "./common";

import { handleAuthRoutes } from "./auth";
  
export default [handleCors, handleBodyRequestParsing, handleCompression, handleAuthRoutes];