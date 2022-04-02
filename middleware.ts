import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "./helpers.js";

import OktaJwtVerifier from '@okta/jwt-verifier';
import oktaConfig from './oktaConfig.js';

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: oktaConfig.resourceServer.oidc.clientId,
  issuer: oktaConfig.resourceServer.oidc.issuer,
  assertClaims: oktaConfig.resourceServer.assertClaims
});

export const authenticationRequired = async (request : Request, response : Response, next : NextFunction) => {
  /*const authHeader = request.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    throw new ErrorHandler(401, 'Unauthorized');
  }

  const accessToken = match[1];
  const audience = oktaConfig.resourceServer.assertClaims.aud;

  try {
    const jwt = oktaJwtVerifier.verifyAccessToken(accessToken, audience);

    response.locals.jwt = jwt;

    let userData = await user.getByUsername(jwt.claims.sub);

    next();

  } catch (error) {
    throw new ErrorHandler(401, error.message);
  }*/
}
