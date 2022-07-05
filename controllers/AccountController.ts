import OktaJwtVerifier from "@okta/jwt-verifier";
import { NextFunction, Request, Response } from "express";
import twilio from "twilio";
import { ErrorHandler } from "../helpers.js";
import Account from "../models/Account.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class AccountController {

  static get = async (_: Request, response: Response, next: NextFunction) => {

    try {

      let data;

      let jwt = response.locals.jwt as OktaJwtVerifier.Jwt;

      if (jwt.claims.sub) {
        data = await Account.getRedactedByUsername(jwt.claims.sub);
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

  static add = async (request: Request, response: Response, next: NextFunction) => {

    try {

      let jwt = response.locals.jwt as OktaJwtVerifier.Jwt;

      if (!request.body.account_sid || !request.body.api_key || !request.body.api_secret || !jwt.claims.sub) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      twilio(request.body.api_key, request.body.api_secret, { accountSid: request.body.account_sid });

      const createdAccountId = await Account.create({ ...request.body, ...{ username: jwt.claims.sub } });
      const accountData = await Account.getRedactedById(createdAccountId);
      response.status(201).json(accountData);

    } catch (error) {
      next(error)
    }

  }

  static updateTwimlApp = async (request: Request, response: Response, next: NextFunction) => {

    try {

      let jwt = response.locals.jwt as OktaJwtVerifier.Jwt;

      if (!request.body.twiml_app_sid || !jwt.claims.sub) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const twilioRessource = await TwilioRessource.initClient(jwt);

      let hostname = request.headers.host;

      if (process.env.NODE_ENV === 'development') {
        hostname = process.env.NGROK_HOSTNAME
      }

      await twilioRessource.applications.update({
        sid: request.body.twiml_app_sid,
        smsUrl: `https://${hostname}/webhook/message`,
        voiceUrl: `https://${hostname}/webhook/voice`
      })

      const updatedAccountId = await Account.updateTwimlAppByUsername({
        twiml_app_sid: request.body.twiml_app_sid,
        username: jwt.claims.sub
      });

      const accountData = await Account.getRedactedById(updatedAccountId);
      response.status(201).json(accountData);

    } catch (error) {
      next(error)
    }

  }

}