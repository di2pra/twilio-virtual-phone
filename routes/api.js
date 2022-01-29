const { ErrorHandler } = require('../helpers/error');
const messsage = require('./../models/Message');
const phone = require('./../models/Phone');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


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


module.exports = {
  getPhone,
  sendMessage,
  createPhone,
  getConversationListByPhone,
  getConversationMessageList
}