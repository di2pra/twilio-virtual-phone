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

      if (!request.body.account_sid || !request.body.auth_token || !request.body.key_sid || !request.body.key_secret || !jwt.claims.sub) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      twilio(request.body.account_sid, request.body.auth_token);
      twilio(request.body.key_sid, request.body.key_secret, {
        accountSid: request.body.account_sid
      });

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

      let hostname = (process.env.NODE_ENV === 'development') ? process.env.NGROK_HOSTNAME : request.headers.host;

      await twilioRessource.applications.update({
        sid: request.body.twiml_app_sid,
        smsUrl: `https://${hostname}/webhook/${encodeURIComponent(jwt.claims.sub)}/message`,
        voiceUrl: `https://${hostname}/webhook/${encodeURIComponent(jwt.claims.sub)}/voice`
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