import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import Account from "../models/Account.js";
import Phone from "../models/Phone.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class PhoneController {

  static getAll = async (_: Request, response: Response, next: NextFunction) => {

    try {

      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);
      const accountInfo = await Account.getByUsername(response.locals.jwt.claims.sub);

      if (!accountInfo) {
        throw new ErrorHandler(400, 'Account not found');
      }

      const phoneList = await Phone.getByAccount(accountInfo.account_id);
      const numberList = await twilioRessource.incomingPhoneNumbers.getByApplicationId(accountInfo.twiml_app_sid);

      const filteredPhoneList = phoneList.filter(item => {
        return numberList.map(item => item.sid).includes(item.sid);
      }).map(item => {
        const number = numberList.find(number => number.sid === item.sid)
        if (number) {
          return {
            ...item, ...{
              friendlyName: number.friendlyName,
              smsApplicationSid: number.smsApplicationSid,
              voiceApplicationSid: number.voiceApplicationSid,
              dateCreated: number.dateCreated,
              dateUpdated: number.dateUpdated
            }
          }
        } else {
          return item;
        }
      });

      response.status(200).json(filteredPhoneList);

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

      if (!accountInfo) {
        throw new ErrorHandler(400, 'Account not found');
      }

      const phoneNumber = await twilioRessource.incomingPhoneNumbers.update({
        friendlyName: `Twilio Virtual Phone`,
        sid: request.body.sid,
        voiceApplicationSid: accountInfo.twiml_app_sid,
        smsApplicationSid: accountInfo.twiml_app_sid
      });

      await Phone.add({
        fk_account_id: accountInfo.account_id,
        sid: phoneNumber.sid,
        phoneNumber: phoneNumber.phoneNumber
      });


      const phoneList = await Phone.getByAccount(accountInfo.account_id);
      const numberList = await twilioRessource.incomingPhoneNumbers.getByApplicationId(accountInfo.twiml_app_sid);

      const filteredPhoneList = phoneList.filter(item => {
        return numberList.map(item => item.sid).includes(item.sid);
      }).map(item => {
        const number = numberList.find(number => number.sid === item.sid)
        if (number) {
          return {
            ...item, ...{
              friendlyName: number.friendlyName,
              smsApplicationSid: number.smsApplicationSid,
              voiceApplicationSid: number.voiceApplicationSid,
              dateCreated: number.dateCreated,
              dateUpdated: number.dateUpdated
            }
          }
        } else {
          return item;
        }
      });

      response.status(201).json(filteredPhoneList);


    } catch (error) {
      next(error)
    }

  }

}