import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import Call from "../models/Call.js";

export default class CallController {

  static getByPhone = async (request: Request, response: Response, next: NextFunction) => {

    try {

      if (!request.params.sid) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const data = await Call.getByPhoneSid(request.params.sid);

      response.status(200).json(data);

    } catch (error: any) {
      next(error)
    }

  }

  static delete = async (request: Request, response: Response, next: NextFunction) => {

    try {

      let data;

      if (request.params.id) {
        data = await Call.delete(Number(request.params.id));
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

}