import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import Call from "../models/Call.js";

export default class CallController {

  private call : Call

  constructor(pgClient : Pool) {
    this.call = new Call(pgClient);
  }

  getByPhone = async (request : Request, response : Response, next : NextFunction) => {

    try {

      let data;

      if (request.params.id) {

        data = await this.call.getByPhoneId(Number(request.params.id));
        
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

  delete = async (request : Request, response : Response, next : NextFunction) => {

    try {

      let data;

      if (request.params.id) {
        data = await this.call.delete(Number(request.params.id));
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

}