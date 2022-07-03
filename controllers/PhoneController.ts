import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import Account from "../models/Account.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class PhoneController {

  static get = async (_: Request, response: Response, next: NextFunction) => {

    try {

      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);
      const accountInfo = await Account.getByUsername(response.locals.jwt.claims.sub);
      const data = await twilioRessource.incomingPhoneNumbers.getByApplicationId(accountInfo.twiml_app_sid);

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

      const data = await twilioRessource.incomingPhoneNumbers.getByApplicationId(accountInfo.twiml_app_sid);

      response.status(201).json(data);


    } catch (error) {
      next(error)
    }

  }

}