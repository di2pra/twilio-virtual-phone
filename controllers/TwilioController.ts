import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class TwilioController {

  static getAllNumber = async (_: Request, response: Response, next: NextFunction) => {

    try {

      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);

      const data = await twilioRessource.incomingPhoneNumbers.getAll();

      response.status(200).json(data);

    } catch (error) {
      next(error);
    }

  }

  static getApplication = async (request: Request, response: Response, next: NextFunction) => {

    try {

      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);

      const data = await twilioRessource.applications.get(request.params.sid);

      response.status(200).json(data);

    } catch (error) {
      next(error);
    }

  }

  static createApplication = async (request: Request, response: Response, next: NextFunction) => {

    try {

      if (!request.body.friendlyName) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      let hostname = request.headers.host;

      if (process.env.NODE_ENV === 'development') {
        hostname = process.env.NGROK_HOSTNAME
      }

      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);

      const data = await twilioRessource.applications.create({
        friendlyName: request.body.friendlyName,
        smsUrl: `https://${hostname}/webhook/message`,
        voiceUrl: `https://${hostname}/webhook/voice`
      });

      response.status(201).json(data);

    } catch (error) {
      next(error);
    }

  }

}