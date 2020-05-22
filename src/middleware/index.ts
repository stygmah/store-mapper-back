
import {handleCors, handleBodyRequestParsing, handleCompression, handleUrlEncoded} from "./common";
  
export default [handleCors, handleBodyRequestParsing, handleCompression, handleUrlEncoded];