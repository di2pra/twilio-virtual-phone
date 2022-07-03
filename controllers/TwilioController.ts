import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class TwilioController {

  static getAllNumber = async (request: Request, response: Response, next: NextFunction) => {

    try {

      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);

      const data = await twilioRessource.incomingPhoneNumbers.getAll(request.body.phoneNumbers);

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

      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);

      const data = await twilioRessource.applications.create({
        friendlyName: request.body.friendlyName
      });

      response.status(201).json(data);

    } catch (error) {
      next(error);
    }

  }

  static deleteApplication = async (request: Request, response: Response, next: NextFunction) => {

    try {

      if (!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);

      await twilioRessource.applications.delete(request.body.sid);

      response.status(200).json({});

    } catch (error) {
      next(error);
    }

  }

}