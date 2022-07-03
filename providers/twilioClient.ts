import OktaJwtVerifier from "@okta/jwt-verifier";
import twilio from "twilio";
import Account from "../models/Account";

const twilioClient = async (jwt: OktaJwtVerifier.Jwt) => {
  if (jwt.claims.sub) {
    const accountInfo = await Account.getByUsername(jwt.claims.sub);

    return twilio(accountInfo.api_key, accountInfo.api_secret, { accountSid: accountInfo.account_sid });

  } else {
    return null;
  }
}

export default twilioClient;