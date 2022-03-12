import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class TwilioController {

  private twilioRessource : TwilioRessource

  constructor(twilioRessource : TwilioRessource) {
    this.twilioRessource = twilioRessource;
  }

  getAllNumber = async (request : Request, response : Response, next : NextFunction) => {

    try {

      let responseData = Array();

      const data = await this.twilioRessource.incomingPhoneNumbers.getAll(request.body.phoneNumbers);
      
      response.status(200).json(data);

    } catch (error) {
      next(error);
    }

  }

  getApplication = async (request : Request, response : Response, next : NextFunction) => {

    try {

      const data = await this.twilioRessource.applications.get(request.params.sid);

      response.status(200).json(data);

    } catch (error) {
      next(error);
    }

  }

  createApplication = async (request : Request, response : Response, next : NextFunction) => {

    try {

      if (!request.body.friendlyName) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      const data = await this.twilioRessource.applications.create({
        friendlyName: request.body.friendlyName
      });

      response.status(201).json(data);

    } catch (error) {
      next(error);
    }

  }

  deleteApplication = async (request : Request, response : Response, next : NextFunction) => {

    try {

      if (!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      await this.twilioRessource.applications.delete(request.body.sid);

      response.status(200).json({});

    } catch (error) {
      next(error);
    }

  }

}