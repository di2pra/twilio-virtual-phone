import OktaJwtVerifier from "@okta/jwt-verifier";
import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import twilio from "twilio";
import { ErrorHandler } from "../helpers.js";
import Account from "../models/Account.js";

export default class AccountController {

  private account: Account

  constructor(pgClient: Pool) {
    this.account = new Account(pgClient);
  }

  get = async (_: Request, response: Response, next: NextFunction) => {

    try {

      let data;

      let jwt = response.locals.jwt as OktaJwtVerifier.Jwt;

      if (jwt.claims.sub) {
        data = await this.account.getRedactedByUsername(jwt.claims.sub);
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

  add = async (request: Request, response: Response, next: NextFunction) => {

    try {

      let jwt = response.locals.jwt as OktaJwtVerifier.Jwt;

      if (!request.body.account_sid || !request.body.api_key || !request.body.api_secret || !jwt.claims.sub) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      twilio(request.body.api_key, request.body.api_secret, { accountSid: request.body.account_sid });

      const createdAccountId = await this.account.create({ ...request.body, ...{ username: jwt.claims.sub } });
      const accountData = await this.account.getRedactedById(createdAccountId);
      response.status(201).json(accountData);

    } catch (error) {
      next(error)
    }

  }

  update = async (request: Request, response: Response, next: NextFunction) => {

    try {

      let jwt = response.locals.jwt as OktaJwtVerifier.Jwt;

      if (!request.body.twiml_app_sid || !jwt.claims.sub) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const updatedAccountId = await this.account.updateTwimlAppByUsername({
        twiml_app_sid: request.body.twiml_app_sid,
        username: jwt.claims.sub
      });

      const accountData = await this.account.getRedactedById(updatedAccountId);
      response.status(201).json(accountData);

    } catch (error) {
      next(error)
    }

  }

  /*add = async (request: Request, response: Response, next: NextFunction) => {

    try {

      if (!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const config = await this.configuration.getLast();
      const configData = JSON.parse(config.data);

      const phoneNumber = await this.twilioRessource.incomingPhoneNumbers.update({
        sid: request.body.sid,
        voiceApplicationSid: configData.twimlApp.sid,
        smsApplicationSid: configData.twimlApp.sid
      })

      const id = await this.phone.create({ alias: phoneNumber.friendlyName, number: phoneNumber.phoneNumber });
      const phoneList = await this.phone.getAll();
      response.status(201).json(phoneList);

    } catch (error) {
      next(error)
    }

  }*/

  /*update = async (request: Request, response: Response, next: NextFunction) => {

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

  }*/


}