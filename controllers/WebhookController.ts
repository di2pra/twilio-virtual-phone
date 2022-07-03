import { Request, Response } from "express";
import twilio from 'twilio';
import { ErrorHandler } from "../helpers.js";
import Account from "../models/Account.js";
import Message from "../models/Message.js";

const apiKey: string = process.env.TWILIO_API_KEY || '';
const apiSecret: string = process.env.TWILIO_API_SECRET || '';
const accountSid: string = process.env.TWILIO_ACCOUNT_SID || '';


const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;


export default class WebhookController {

  static tokenGenerator = async (_: Request, response: Response) => {

    if (!response.locals.jwt) {
      throw new ErrorHandler(400, 'Bad Request');
    }

    const accountInfo = await Account.getByUsername(response.locals.jwt.claims.sub);

    const accessToken = new AccessToken(
      accountSid,
      apiKey,
      apiSecret,
      {
        identity: accountInfo.username,
        ttl: 86400
      }
    );

    const grant = new VoiceGrant({
      outgoingApplicationSid: accountInfo.twiml_app_sid,
      incomingAllow: true
    });

    accessToken.addGrant(grant);

    // Include identity and token in a JSON response
    response.status(201).json({
      identity: accountInfo.username,
      token: accessToken.toJwt(),
    });

  };


  /*voiceResponse = async (request: Request, response: Response) => {
    const toNumberOrClientName = request.body.To;
    const fromNumberOrClientName = request.body.From;
    let twiml = new VoiceResponse();

    await Call.create({ from_number: request.body.From, to_number: request.body.To });

    if (request.body.Caller === `client:${this.phoneIdentity}`) {

      let dial = twiml.dial({ callerId: fromNumberOrClientName });

      // Check if the 'To' parameter is a Phone Number or Client Name
      // in order to use the appropriate TwiML noun 
      const attr = isAValidPhoneNumber(toNumberOrClientName) ? "number" : "client";
      dial[attr]({}, toNumberOrClientName);


    } else {

      let dial = twiml.dial();

      // This will connect the caller with your Twilio.Device/client 
      dial.client(this.phoneIdentity);

    }

    response.set("Content-Type", "text/xml").send(twiml.toString());

  };*/

  messageResponse = async (request: Request, response: Response) => {
    const toNumber = request.body.To;
    const fromNumber = request.body.From;
    const body = request.body.Body;

    const sockets = response.locals.sockets;

    const id = await Message.create({ from_number: fromNumber, to_number: toNumber, body: body });

    sockets.emit('refreshMessage');

    response.set("Content-Type", "text/xml").send();

  };

}