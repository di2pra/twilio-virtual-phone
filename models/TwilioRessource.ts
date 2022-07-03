import OktaJwtVerifier from '@okta/jwt-verifier';
import twilio, { Twilio } from 'twilio';
import { ErrorHandler } from '../helpers.js';
import Account, { IAccount } from './Account.js';
import Applications from './Twilio/Applications.js';
import IncomingPhoneNumbers from './Twilio/IncomingPhoneNumbers.js';
import Messages from './Twilio/Messages.js';

export default class TwilioRessource {

  twilioClient: Twilio;
  applications: Applications;
  incomingPhoneNumbers: IncomingPhoneNumbers;
  messages: Messages;

  private constructor(accountInfo: IAccount) {
    this.twilioClient = twilio(accountInfo.api_key, accountInfo.api_secret, { accountSid: accountInfo.account_sid });
    this.applications = new Applications(this.twilioClient);
    this.incomingPhoneNumbers = new IncomingPhoneNumbers(this.twilioClient);
    this.messages = new Messages(this.twilioClient);
  }

  static async initClient(jwt: OktaJwtVerifier.Jwt) {

    if (jwt.claims.sub) {
      const accountInfo = await Account.getByUsername(jwt.claims.sub);
      return new TwilioRessource(accountInfo);
    }

    throw new ErrorHandler(400, 'Twilio Ressource unavailable!');

  }

}