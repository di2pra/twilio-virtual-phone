import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import Configuration from "../models/Configuration.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class ConfigurationController {

  static get = async (_: Request, response: Response, next: NextFunction) => {

    try {

      const config = await Configuration.getLast();

      if (config) {

        const configData = JSON.parse(config.data);

        response.status(200).json(configData);

      } else {
        response.status(200).json(null);
      }

    } catch (error) {

      next(error);

    }

  }

  static set = async (request: Request, response: Response, next: NextFunction) => {

    try {

      if (!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      let hostname = request.headers.host;

      if (process.env.NODE_ENV === 'development') {
        hostname = process.env.NGROK_HOSTNAME
      }

      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);

      const data = await twilioRessource.applications.update({
        sid: String(request.body.sid),
        smsUrl: `https://${hostname}/webhook/message`,
        voiceUrl: `https://${hostname}/webhook/voice`
      });

      const value = await Configuration.create({
        version: 1,
        data: JSON.stringify({
          twimlApp: data
        })
      });

      response.status(200).json(value);

    } catch (error) {

      next(error);

    }

  }


}