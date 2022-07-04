import { Request, Response } from "express";
import twilio from 'twilio';
import { ErrorHandler, isAValidPhoneNumber } from "../helpers.js";
import Account from "../models/Account.js";
import Call from "../models/Call.js";
import Message from "../models/Message.js";
import Phone from "../models/Phone.js";

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


  static voiceResponse = async (request: Request, response: Response) => {

    try {

      const toNumberOrClientName = request.body.To;
      const fromNumberOrClientName = request.body.From;
      const fromSid = request.body.from_sid;

      let twiml = new VoiceResponse();

      if (request.body.Caller.includes('client:')) {

        // outgoing call

        let dial = twiml.dial({ callerId: fromNumberOrClientName });

        // Check if the 'To' parameter is a Phone Number or Client Name
        // in order to use the appropriate TwiML noun 
        const attr = isAValidPhoneNumber(toNumberOrClientName) ? "number" : "client";
        dial[attr]({}, toNumberOrClientName);

        await Call.create({ from_sid: fromSid, from_number: request.body.From, to_number: request.body.To });


      } else {

        // incoming call

        const phoneInfo = await Phone.getByNumber(toNumberOrClientName);
        const accountInfo = await Account.getById(phoneInfo.fk_account_id);

        let dial = twiml.dial();
        dial.client(accountInfo.username);

        await Call.create({ from_number: request.body.From, to_number: request.body.To, to_sid: phoneInfo.sid });

      }

      response.set("Content-Type", "text/xml").send(twiml.toString());

    } catch (error) {

      let twiml = new VoiceResponse();

      twiml.say('An application error has occured!');

      response.set("Content-Type", "text/xml").send(twiml.toString());
    }

  };

  static messageResponse = async (request: Request, response: Response) => {

    const toNumber = request.body.To;
    const fromNumber = request.body.From;
    const body = request.body.Body;

    const phoneInfo = await Phone.getByNumber(toNumber);

    const sockets = response.locals.sockets;

    const id = await Message.create({ from_number: fromNumber, to_number: toNumber, to_sid: phoneInfo.sid, body: body });

    sockets.emit('refreshMessage');

    response.set("Content-Type", "text/xml").send();

  };

}