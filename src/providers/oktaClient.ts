import OktaJwtVerifier from "@okta/jwt-verifier";
import oktaConfig from "../oktaConfig.js";

export const oktaJwtVerifier = new OktaJwtVerifier({
  clientId: oktaConfig.resourceServer.oidc.clientId,
  issuer: oktaConfig.resourceServer.oidc.issuer,
  assertClaims: oktaConfig.resourceServer.assertClaims
});