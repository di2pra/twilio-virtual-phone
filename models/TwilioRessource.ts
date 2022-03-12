import { Twilio } from 'twilio';
import Applications from './Twilio/Applications.js';
import IncomingPhoneNumbers from './Twilio/IncomingPhoneNumbers.js';
import Messages from './Twilio/Messages.js';

export default class TwilioRessource {

  applications : Applications;
  incomingPhoneNumbers : IncomingPhoneNumbers;
  messages : Messages;

  constructor(twilioClient : Twilio) {
    this.applications = new Applications(twilioClient);
    this.incomingPhoneNumbers = new IncomingPhoneNumbers(twilioClient);
    this.messages = new Messages(twilioClient);
  }
}