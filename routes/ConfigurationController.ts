import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import { ErrorHandler } from "../helpers.js";
import Configuration from "../models/Configuration.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class ConfigurationController {

  private twilioRessource: TwilioRessource
  private configuration: Configuration;

  constructor(pgClient: Pool, twilioRessource : TwilioRessource) {
    this.twilioRessource = twilioRessource;
    this.configuration = new Configuration(pgClient)
  }

  get = async (_ : Request, response : Response, next : NextFunction) => {

    try {

      const config = await this.configuration.getLast();

      if (config) {

        const configData = JSON.parse(config.data);

        const data = await this.twilioRessource.applications.get(configData.twimlApp.sid);

        response.status(200).json(configData);

      } else {
        response.status(200).json(null);
      }

    } catch (error) {

      next(error);

    }

  }

  set = async (request : Request, response : Response, next : NextFunction) => {

    try {

      if (!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      let hostname = request.headers.host;

      if (process.env.NODE_ENV === 'development') {
        hostname = process.env.NGROK_HOSTNAME
      }

      const data = await this.twilioRessource.applications.update({
        sid: String(request.body.sid),
        smsUrl: `https://${hostname}/webhook/message`,
        voiceUrl: `https://${hostname}/webhook/voice`
      });

      const value = await this.configuration.create({
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

  /*deleteConfiguration = async (_ : Request, response : Response, next : NextFunction) => {

    try {

      response.status(200).json({});

    } catch (error) {

      next(error);

    }

  }*/

  

}