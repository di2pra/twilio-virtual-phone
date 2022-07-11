import { NextFunction, Request, Response } from "express";
import { Server } from "socket.io";
import twilio from 'twilio';
import { ErrorHandler, isAValidPhoneNumber } from "../helpers.js";
import Account from "../models/Account.js";
import Call from "../models/Call.js";
import Message from "../models/Message.js";
import Phone from "../models/Phone.js";
import Redis from "../providers/redisClient.js";

const apiKey: string = process.env.TWILIO_API_KEY || '';
const apiSecret: string = process.env.TWILIO_API_SECRET || '';
const accountSid: string = process.env.TWILIO_ACCOUNT_SID || '';


const VoiceResponse = twilio.twiml.VoiceResponse;
const AccessToken = twilio.jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;


export default class WebhookController {

  static validateSignature = async (request: Request, response: Response, next: NextFunction) => {

    try {

      const username = request.params.username;

      if (username) {

        const accountInfo = await Account.getByUsername(username);

        if (!accountInfo) {
          throw new ErrorHandler(403, 'Forbidden');
        }

        const result = twilio.validateExpressRequest(request, accountInfo.auth_token, { protocol: 'https' });

        if (result) {
          next();
        } else {
          throw new ErrorHandler(403, 'Forbidden');
        }

      } else {
        throw new ErrorHandler(403, 'Forbidden');
      }

    } catch (error) {
      next(error)
    }

  };

  static tokenGenerator = async (_: Request, response: Response) => {

    if (!response.locals.jwt) {
      throw new ErrorHandler(400, 'Bad Request');
    }

    const accountInfo = await Account.getByUsername(response.locals.jwt.claims.sub);

    if (!accountInfo) {
      throw new ErrorHandler(400, 'Account not found');
    }

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

        if (!accountInfo) {
          response.set("Content-Type", "text/xml").send();
          return
        }

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
    const accountInfo = await Account.getById(phoneInfo.fk_account_id);

    if (!accountInfo) {
      response.set("Content-Type", "text/xml").send();
      return
    }

    const socketServer: Server = response.locals.socketIoServer as Server;

    const newMessage = await Message.create({ from_number: fromNumber, to_number: toNumber, to_sid: phoneInfo.sid, body: body });

    const redisClient = await Redis.getClient();

    const socketId = await redisClient.get(accountInfo.username);

    if (socketId) {
      const sockets = await socketServer.in(socketId).fetchSockets();
      sockets[0].emit('refreshMessage', newMessage);
    }


    response.set("Content-Type", "text/xml").send();

  };

}