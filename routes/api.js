const { ErrorHandler, isAValidPhoneNumber } = require('../helpers');
const Message = require('../models/Message');
const Phone = require('../models/Phone');
const Call = require('../models/Call');
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;

const VoiceResponse = require("twilio").twiml.VoiceResponse;
const AccessToken = require("twilio").jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const phoneIdentity = "TwilioVirtualPhone";

class Api {

  constructor(pgClient, twilioClient) {
    this.twilioClient = twilioClient;
    this.call = new Call(pgClient);
    this.phone = new Phone(pgClient);
    this.message = new Message(pgClient);
  }

  getConversationListByPhone = async (request, response, next) => {

    try {

      let data;

      if (request.params.id) {
        data = await this.message.getConversationListByPhoneId(request.params.id);
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }


  getCallListByPhone = async (request, response, next) => {

    try {

      let data;

      if (request.params.id) {
        data = await this.call.getByPhoneId(request.params.id);
      }

      

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

  getConversationMessageList = async (request, response, next) => {

    try {

      let data;

      if (request.params.id && request.params.number) {
        data = await this.message.getMessageByConversation(request.params.id, request.params.number);
        response.status(200).json(data);
      } else {
        throw new ErrorHandler(400, 'Bad Request')
      }

    } catch (error) {
      next(error)
    }

  }

  getPhone = async (request, response, next) => {

    try {

      let data;

      if (request.params.id) {
        data = await this.phone.getById(request.params.id);
      } else {
        data = await this.phone.getAll();
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

  sendMessage = async (request, response, next) => {

    try {

      const data = request.body;

      if (!data.from || !data.to || !data.body) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      await this.twilioClient.messages.create(data);
      const id = await this.message.create({ from_number: data.from, to_number: data.to, body: data.body });
      const message = await this.message.getById(id);
      response.status(201).json(message);

    } catch (error) {
      next(error);
    }

  }

  createCall = async (request, response, next) => {

    try {

      const data = request.body;

      if (!data.from || !data.to) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const id = await this.call.create({ from_number: data.from, to_number: data.to });
      const callData = await this.call.getById(id);
      response.status(201).json(callData);

    } catch (error) {
      next(error);
    }

  }

  tokenGenerator = (request, response) => {

    const accessToken = new AccessToken(
      accountSid,
      apiKey,
      apiSecret
    );

    accessToken.identity = phoneIdentity;

    const grant = new VoiceGrant({
      outgoingApplicationSid: twimlAppSid,
      incomingAllow: true,
    });

    accessToken.addGrant(grant);

    // Include identity and token in a JSON response
    response.status(201).json({
      identity: phoneIdentity,
      token: accessToken.toJwt(),
    });

  };

  voiceResponse = (request, response) => {
    const toNumberOrClientName = request.body.To;
    const callerId = '+33644648641';
    let twiml = new VoiceResponse();

    // If the request to the /voice endpoint is TO your Twilio Number, 
    // then it is an incoming call towards your Twilio.Device.
    if (toNumberOrClientName == callerId) {
      let dial = twiml.dial();

      call.create({ from_number: request.body.From, to_number: request.body.To });

      // This will connect the caller with your Twilio.Device/client 
      dial.client(phoneIdentity);

    } else if (request.body.To) {
      // This is an outgoing call

      // set the callerId
      let dial = twiml.dial({ callerId });

      // Check if the 'To' parameter is a Phone Number or Client Name
      // in order to use the appropriate TwiML noun 
      const attr = isAValidPhoneNumber(toNumberOrClientName) ? "number" : "client";
      dial[attr]({}, toNumberOrClientName);
    } else {
      twiml.say("Thanks for calling!");
    }

    response.set("Content-Type", "text/xml").send(twiml.toString());

  };

  createPhone = async (request, response, next) => {

    try {

      const data = request.body;

      if (!data.alias || !data.number) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const id = await this.phone.create({ alias: data.alias, number: data.number });
      const result = await this.phone.getAll();

      response.status(201).json(result);

    } catch (error) {
      next(error)
    }

  }

  updatePhone = async (request, response, next) => {

    try {

      const data = request.body;

      if (!data.alias || !request.params.id) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const id = await this.phone.updateById({ alias: data.alias, id: request.params.id });
      const result = await this.phone.getAll();

      response.status(201).json(result);

    } catch (error) {
      next(error)
    }

  }

  createMessage = async (request, response, next) => {
  
    const data = request.body;
  
    const id = await this.message.create({from_number: data.From, to_number: data.To, body: data.Body});

    next();
  
  }

}

module.exports = Api