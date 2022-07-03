import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import Account from "../models/Account.js";
import Phone from "../models/Phone.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class PhoneController {

  static get = async (request: Request, response: Response, next: NextFunction) => {

    try {

      let data;

      if (request.params.id) {
        data = await Phone.getById(Number(request.params.id));
      } else {
        data = await Phone.getAll();
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

  static add = async (request: Request, response: Response, next: NextFunction) => {

    try {

      if (!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      const accountInfo = await Account.getByUsername(response.locals.jwt.claims.sub);
      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);

      const phoneNumber = await twilioRessource.incomingPhoneNumbers.update({
        sid: request.body.sid,
        voiceApplicationSid: accountInfo.twiml_app_sid,
        smsApplicationSid: accountInfo.twiml_app_sid
      });

      const id = await Phone.create({ alias: phoneNumber.friendlyName, number: phoneNumber.phoneNumber });
      const phoneList = await Phone.getAll();
      response.status(201).json(phoneList);


    } catch (error) {
      next(error)
    }

  }

  static update = async (request: Request, response: Response, next: NextFunction) => {

    try {

      const data = request.body;

      if (!data.alias || !request.params.id) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const id = await Phone.updateById({ alias: data.alias, id: Number(request.params.id) });
      const result = await Phone.getAll();

      response.status(200).json(result);

    } catch (error) {
      next(error)
    }

  }

  static delete = async (request: Request, response: Response, next: NextFunction) => {

    try {

      if (!request.params.id) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const id = await Phone.deleteById(Number(request.params.id));
      const result = await Phone.getAll();

      response.status(200).json(result);

    } catch (error) {
      next(error)
    }

  }

}