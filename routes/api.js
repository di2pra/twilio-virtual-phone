const { ErrorHandler, isAValidPhoneNumber } = require('../helpers');
const messsage = require('./../models/Message');
const phone = require('./../models/Phone');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const apiKey = process.env.TWILIO_API_KEY;
const apiSecret = process.env.TWILIO_API_SECRET;
const twimlAppSid = process.env.TWILIO_TWIML_APP_SID;
const client = require('twilio')(accountSid, authToken);

const VoiceResponse = require("twilio").twiml.VoiceResponse;
const AccessToken = require("twilio").jwt.AccessToken;
const VoiceGrant = AccessToken.VoiceGrant;
const phoneIdentity = "TwilioVirtualPhone";

const getConversationListByPhone = async (request, response, next) => {

  try {

    let data;

    if (request.params.id) {
      data = await messsage.getConversationListByPhoneId(request.params.id);
    }

    response.status(200).json(data);

  } catch (error) {
    next(error)
  }

}

const getConversationMessageList = async (request, response, next) => {

  try {

    let data;

    if (request.params.id && request.params.number) {
      data = await messsage.getMessageByConversation(request.params.id, request.params.number);
      response.status(200).json(data);
    } else {
      throw new ErrorHandler(400, 'Bad Request')
    }

  } catch (error) {
    next(error)
  }

}

const getPhone = async (request, response, next) => {

  try {

    let data;

    if (request.params.id) {
      data = await phone.getById(request.params.id);
    } else {
      data = await phone.getAll();
    }

    response.status(200).json(data);

  } catch (error) {
    next(error)
  }

}

const sendMessage = async (request, response, next) => {

  try {
    
    const data = request.body;

    if (!data.from || !data.to || !data.body) {
      throw new ErrorHandler(400, 'Bad Request')
    }

    await client.messages.create(data);
    const id = await messsage.create({ from_number: data.from, to_number: data.to, body: data.body });
    const message = await messsage.getById(id);
    response.status(201).json(message);

  } catch (error) {
    next(error);
  }

}

const tokenGenerator = (request, response) => {

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

const voiceResponse = (request, response) => {
  const toNumberOrClientName = request.body.To;
  const callerId = '+33644648641';
  let twiml = new VoiceResponse();

  // If the request to the /voice endpoint is TO your Twilio Number, 
  // then it is an incoming call towards your Twilio.Device.
  if (toNumberOrClientName == callerId) {
    let dial = twiml.dial();

    // This will connect the caller with your Twilio.Device/client 
    dial.client(phoneIdentity);

  } else if (request.body.To) {
    // This is an outgoing call

    // set the callerId
    let dial = twiml.dial({ callerId });

    // Check if the 'To' parameter is a Phone Number or Client Name
    // in order to use the appropriate TwiML noun 
    const attr = isAValidPhoneNumber(toNumberOrClientName)
      ? "number"
      : "client";
    dial[attr]({}, toNumberOrClientName);
  } else {
    twiml.say("Thanks for calling!");
  }

  response.set("Content-Type", "text/xml").send(twiml.toString());

};

const createPhone = async (request, response, next) => {

  try {
    
    const data = request.body;

    if (!data.alias || !data.number) {
      throw new ErrorHandler(400, 'Bad Request')
    }

    const id = await phone.create({ alias: data.alias, number: data.number });
    const result = await phone.getAll();

    response.status(201).json(result);

  } catch (error) {
    next(error)
  }

}

const updatePhone = async (request, response, next) => {

  try {
    
    const data = request.body;

    if (!data.alias || !request.params.id) {
      throw new ErrorHandler(400, 'Bad Request')
    }

    const id = await phone.updateById({ alias: data.alias, id: request.params.id });
    const result = await phone.getAll();

    response.status(201).json(result);

  } catch (error) {
    next(error)
  }

}


module.exports = {
  getPhone,
  sendMessage,
  createPhone,
  getConversationListByPhone,
  getConversationMessageList,
  updatePhone,
  voiceResponse,
  tokenGenerator
}