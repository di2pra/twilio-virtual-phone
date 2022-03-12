import { NextFunction, Request, RequestHandler } from "express";
import { ErrorHandler } from "./helpers";

const validateApiKey = (request : Request, _ : RequestHandler, next : NextFunction) => {

  const requestApiKey = request.get('X-API-KEY');

  if(!process.env.API_KEY || process.env.API_KEY === '') {
    throw new ErrorHandler(401, 'API KEY not defined !')
  }

  if(requestApiKey === process.env.API_KEY) {
    next();
  } else {
    throw new ErrorHandler(401, 'Unauthorized !')
  }

}

module.exports = {
  validateApiKey
}