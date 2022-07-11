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
    this.twilioClient = twilio(accountInfo.account_sid, accountInfo.auth_token);
    this.applications = new Applications(this.twilioClient);
    this.incomingPhoneNumbers = new IncomingPhoneNumbers(this.twilioClient);
    this.messages = new Messages(this.twilioClient);
  }

  static async initClient(jwt: OktaJwtVerifier.Jwt) {

    if (jwt.claims.sub) {
      const accountInfo = await Account.getByUsername(jwt.claims.sub);

      if (!accountInfo) {
        throw new ErrorHandler(400, 'Accout Not Found!');
      }

      return new TwilioRessource(accountInfo);
    }

    throw new ErrorHandler(400, 'Twilio Ressource unavailable!');

  }

  static async initClientWithAccountId(account_id: number) {

    const accountInfo = await Account.getById(account_id);

    if (!accountInfo) {
      throw new ErrorHandler(400, 'Accout Not Found!');
    }

    return new TwilioRessource(accountInfo);

  }

  static async initClientWithUsername(username: string) {

    const accountInfo = await Account.getByUsername(username);

    if (!accountInfo) {
      throw new ErrorHandler(400, 'Accout Not Found!');
    }

    return new TwilioRessource(accountInfo);

  }

}