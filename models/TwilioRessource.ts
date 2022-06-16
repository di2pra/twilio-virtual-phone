import twilio, { Twilio } from 'twilio';
import Account from './Account.js';
import Applications from './Twilio/Applications.js';
import IncomingPhoneNumbers from './Twilio/IncomingPhoneNumbers.js';
import Messages from './Twilio/Messages.js';

export default class TwilioRessource {

  twilioClient: Twilio;
  applications : Applications;
  incomingPhoneNumbers : IncomingPhoneNumbers;
  messages : Messages;

  constructor(username : string) {

    const accountInfo = await Account.getByUsername(username);

    this.twilioClient = twilio(accountInfo.api_key, accountInfo.api_secret, { accountSid: accountInfo.account_sid });
    this.applications = new Applications(twilioClient);
    this.incomingPhoneNumbers = new IncomingPhoneNumbers(twilioClient);
    this.messages = new Messages(twilioClient);
  }
}