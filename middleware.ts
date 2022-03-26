import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "./helpers.js";

import OktaJwtVerifier from '@okta/jwt-verifier';
import oktaConfig from './oktaConfig.js';

const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: oktaConfig.resourceServer.oidc.clientId,
  issuer: oktaConfig.resourceServer.oidc.issuer,
  assertClaims: oktaConfig.resourceServer.assertClaims
});

const authenticationRequired = (request : Request, _ : Response, next : NextFunction) => {
  const authHeader = request.headers.authorization || '';
  const match = authHeader.match(/Bearer (.+)/);

  if (!match) {
    throw new ErrorHandler(401, 'Unauthorized');
  }

  const accessToken = match[1];
  const audience = oktaConfig.resourceServer.assertClaims.aud;
  return oktaJwtVerifier.verifyAccessToken(accessToken, audience)
    .then((jwt) => {
      //request.jwt = jwt;
      next();
    })
    .catch((err) => {
      throw new ErrorHandler(401, err.message);
    });
}

export default authenticationRequired