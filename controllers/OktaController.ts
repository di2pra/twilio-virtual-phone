import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import Account from "../models/Account.js";
import { oktaJwtVerifier } from "../providers/oktaClient.js";
import oktaConfig from './../oktaConfig.js';

export default class OktaController {

  static authenticationRequired = async (request: Request, response: Response, next: NextFunction) => {
    const authHeader = request.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);

    try {

      if (!match) {
        throw new ErrorHandler(401, 'Token not found');
      }

      const accessToken = match[1];
      const audience = oktaConfig.resourceServer.assertClaims.aud;

      const jwt = await oktaJwtVerifier.verifyAccessToken(accessToken, audience);

      response.locals.jwt = jwt;

      let accountData = await Account.getRedactedByUsername(jwt.claims.sub);

      response.locals.accountData = accountData;

      next();

    } catch (error: any) {
      next(new ErrorHandler(401, `Unauthorized : ${error.message}`));
    }
  }

}