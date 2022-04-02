import OktaJwtVerifier from "@okta/jwt-verifier";
import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import Account from "../models/Account.js";

export default class AccountController {

  private account: Account

  constructor(pgClient: Pool) {
    this.account = new Account(pgClient);
  }

  get = async (_ : Request, response: Response, next: NextFunction) => {

    try {

      let data;

      let jwt = response.locals.jwt as OktaJwtVerifier.Jwt;

      if (jwt.claims.sub) {
        data = await this.account.getByUsername(jwt.claims.sub);
      }

      response.status(200).json(data);

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