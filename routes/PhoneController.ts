import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import { ErrorHandler } from "../helpers.js";
import Phone from "../models/Phone.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class PhoneController {

  private phone: Phone
  private twilioRessource : TwilioRessource

  constructor(pgClient : Pool, twilioRessource : TwilioRessource) {
    this.phone = new Phone(pgClient);
    this.twilioRessource = twilioRessource;
  }

  get = async (request : Request, response : Response, next : NextFunction) => {

    try {

      let data;

      if (request.params.id) {
        data = await this.phone.getById(Number(request.params.id));
      } else {
        data = await this.phone.getAll();
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

    add = async (request : Request, response : Response, next : NextFunction) => {

    try {

      if (!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      //const redisData = await this.redisClient.get('configuration');
      //const appConfig = JSON.parse(redisData);

      /*const appConfig = {}

      const phoneNumber = await this.twilioRessource.incomingPhoneNumbers.update({
        sid: request.body.sid,
        voiceApplicationSid: appConfig.twimlAppSid,
        smsApplicationSid: appConfig.twimlAppSid
      })

      const id = await this.phone.create({ alias: phoneNumber.friendlyName, number: phoneNumber.phoneNumber });
      const phoneList = await this.phone.getAll();
      response.status(201).json(phoneList);*/

    } catch (error) {
      next(error)
    }

  }

  update = async (request : Request, response : Response, next : NextFunction) => {

    try {

      const data = request.body;

      if (!data.alias || !request.params.id) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const id = await this.phone.updateById({ alias: data.alias, id: Number(request.params.id) });
      const result = await this.phone.getAll();

      response.status(200).json(result);

    } catch (error) {
      next(error)
    }

  }

  delete = async (request : Request, response : Response, next : NextFunction) => {

    try {

      if (!request.params.id) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const id = await this.phone.deleteById(Number(request.params.id));
      const result = await this.phone.getAll();

      response.status(200).json(result);

    } catch (error) {
      next(error)
    }

  }

}