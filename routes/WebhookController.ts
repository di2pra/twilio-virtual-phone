import { Request, Response } from "express";
import { Pool } from "pg";
import { Server } from "socket.io";
import { isAValidPhoneNumber } from "../helpers.js";
import Call from "../models/Call.js";
import Message from "../models/Message.js";
import twilio from 'twilio';
import Configuration from "../models/Configuration.js";

const apiKey : string = process.env.TWILIO_API_KEY || '';
const apiSecret : string = process.env.TWILIO_API_SECRET || '';
const accountSid : string = process.env.TWILIO_ACCOUNT_SID || '';


const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;


export default class WebhookController {

  private socketIoServer: Server
  private call: Call
  private message: Message
  private configuration : Configuration
  private phoneIdentity = "TwilioVirtualPhone";

  constructor(pgClient: Pool, socketIoServer: Server) {
    this.socketIoServer = socketIoServer;
    this.call = new Call(pgClient);
    this.message = new Message(pgClient);
    this.configuration = new Configuration(pgClient);
  }

  tokenGenerator = async (_: Request, response: Response) => {

    const accessToken = new AccessToken(
      accountSid,
      apiKey,
      apiSecret
    );

    accessToken.identity = this.phoneIdentity;

    const appConfigRaw = await this.configuration.getLast();

    const configData = JSON.parse(appConfigRaw.data);

    const grant = new VoiceGrant({
      outgoingApplicationSid: configData.twimlApp.sid,
      incomingAllow: true
    });

    accessToken.addGrant(grant);

    // Include identity and token in a JSON response
    response.status(201).json({
      identity: this.phoneIdentity,
      token: accessToken.toJwt(),
    });

  };


  voiceResponse = async (request: Request, response: Response) => {
    const toNumberOrClientName = request.body.To;
    const fromNumberOrClientName = request.body.From;
    let twiml = new VoiceResponse();

    await this.call.create({ from_number: request.body.From, to_number: request.body.To });

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

  };

  messageResponse = async (request: Request, response: Response) => {
    const toNumber = request.body.To;
    const fromNumber = request.body.From;
    const body = request.body.Body;

    const id = await this.message.create({ from_number: fromNumber, to_number: toNumber, body: body });

    this.socketIoServer.sockets.emit('refreshMessage');

    response.set("Content-Type", "text/xml").send();

  };

}