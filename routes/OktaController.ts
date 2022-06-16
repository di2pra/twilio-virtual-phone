import OktaJwtVerifier from "@okta/jwt-verifier";
import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import { ErrorHandler } from "../helpers.js";
import Account from "../models/Account.js";
import oktaConfig from './../oktaConfig.js';

export default class OktaController {

  private oktaJwtVerifier: OktaJwtVerifier

  constructor(pgClient: Pool) {
    this.oktaJwtVerifier = new OktaJwtVerifier({
      clientId: oktaConfig.resourceServer.oidc.clientId,
      issuer: oktaConfig.resourceServer.oidc.issuer,
      assertClaims: oktaConfig.resourceServer.assertClaims
    });
  }

  authenticationRequired = async (request : Request, response : Response, next : NextFunction) => {
    const authHeader = request.headers.authorization || '';
    const match = authHeader.match(/Bearer (.+)/);
  
    if (!match) {
      throw new ErrorHandler(401, 'Unauthorized');
    }
  
    const accessToken = match[1];
    const audience = oktaConfig.resourceServer.assertClaims.aud;
  
    try {
      const jwt = await this.oktaJwtVerifier.verifyAccessToken(accessToken, audience);
  
      response.locals.jwt = jwt;
  
      let accountData = await Account.getRedactedByUsername(jwt.claims.sub);

      response.locals.accountData = accountData;
  
      next();
  
    } catch (error) {
      next(error)
    }
  }

}