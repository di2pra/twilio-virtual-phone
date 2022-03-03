const { ErrorHandler, isAValidPhoneNumber } = require('../helpers');
const Message = require('../models/Message');
const Phone = require('../models/Phone');
const Call = require('../models/Call');
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const accountSid = process.env.TWILIO_ACCOUNT_SID;

const VoiceResponse = require("twilio").twiml.VoiceResponse;
const AccessToken = require("twilio").jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const phoneIdentity = "TwilioVirtualPhone";

class Api {

  constructor(pgClient, twilioClient, redisClient, socketIoClient) {
    this.twilioClient = twilioClient;
    this.redisClient = redisClient;
    this.socketIoClient = socketIoClient;
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

  getConfiguration = async (request, response, next) => {

    try {

      const configJson = await this.redisClient.get('configuration');

      if (configJson) {

        const config = JSON.parse(configJson);

        const data = await this.twilioClient.applications(config.twimlApp.sid).fetch();

        await this.redisClient.set('configuration', JSON.stringify({ twimlApp: data }));

        response.status(200).json({ twimlApp: data });

      } else {
        response.status(200).json(null);
      }

    } catch (error) {

      next(error);

    }

  }

  setConfiguration = async (request, response, next) => {

    try {

      if (!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      let hostname = request.headers.host;

      if (process.env.NODE_ENV === 'dev') {
        hostname = process.env.NGROK_HOSTNAME
      }

      const data = await this.twilioClient.applications(request.body.sid)
        .update({
          smsUrl: `https://${hostname}/webhook/message`,
          voiceUrl: `https://${hostname}/webhook/voice`
        });

      await this.redisClient.set('configuration', JSON.stringify({ twimlApp: data }));

      const value = await this.redisClient.get('configuration');

      response.status(200).json(value);

    } catch (error) {

      next(error);

    }

  }

  deleteConfiguration = async (request, response, next) => {
  
    try {

      await this.redisClient.set('configuration', null);

      response.status(200).json({});

    } catch (error) {

      next(error);

    }
  
  }

  tokenGenerator = async (request, response) => {

    const accessToken = new AccessToken(
      accountSid,
      apiKey,
      apiSecret
    );

    accessToken.identity = phoneIdentity;

    const appConfigJson = await this.redisClient.get('configuration');

    const appConfig = JSON.parse(appConfigJson);

    const grant = new VoiceGrant({
      outgoingApplicationSid: appConfig.twimlApp.sid,
      incomingAllow: true
    });

    accessToken.addGrant(grant);

    // Include identity and token in a JSON response
    response.status(201).json({
      identity: phoneIdentity,
      token: accessToken.toJwt(),
    });

  };

  voiceResponse = async (request, response) => {
    const toNumberOrClientName = request.body.To;
    const fromNumberOrClientName = request.body.From;
    let twiml = new VoiceResponse();

    await this.call.create({ from_number: request.body.From, to_number: request.body.To });

    if(request.body.Caller === `client:${phoneIdentity}`) {

      let dial = twiml.dial({ callerId: fromNumberOrClientName });

      // Check if the 'To' parameter is a Phone Number or Client Name
      // in order to use the appropriate TwiML noun 
      const attr = isAValidPhoneNumber(toNumberOrClientName) ? "number" : "client";
      dial[attr]({}, toNumberOrClientName);

      
    } else {

      let dial = twiml.dial();

      // This will connect the caller with your Twilio.Device/client 
      dial.client(phoneIdentity);
      
    }

    response.set("Content-Type", "text/xml").send(twiml.toString());

  };

  messageResponse = async (request, response) => {
    const toNumber = request.body.To;
    const fromNumber = request.body.From;
    const body = request.body.Body;

    const id = await this.message.create({ from_number: fromNumber, to_number: toNumber, body: body });

    this.socketIoClient.sockets.emit('refreshMessage');

    response.set("Content-Type", "text/xml").send();

  };

  createPhone = async (request, response, next) => {

    try {

      if (!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const redisData = await this.redisClient.get('configuration');
      const appConfig = JSON.parse(redisData);

      const phoneNumber = await this.twilioClient.incomingPhoneNumbers(request.body.sid).update({
        voiceApplicationSid: appConfig.twimlAppSid,
        smsApplicationSid: appConfig.twimlAppSid
      })

      const id = await this.phone.create({ alias: phoneNumber.friendlyName, number: phoneNumber.phoneNumber });
      const phoneList = await this.phone.getAll();
      response.status(201).json(phoneList);

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

  

}

module.exports = Api