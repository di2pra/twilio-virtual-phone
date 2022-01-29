const messsage = require('./../models/Message');
const phone = require('./../models/Phone');
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);


const getConversationListByPhone = async (request, response) => {

  let data;

  if(request.params.id) {
    data = await messsage.getConversationListByPhoneId(request.params.id);
  }

  response.status(200).json(data);

}

const getConversationMessageList = async (request, response) => {

  let data;

  if(request.params.id && request.params.number) {
    data = await messsage.getMessageByConversation(request.params.id, request.params.number);
  }

  response.status(200).json(data);

}

const getPhone = async (request, response) => {

  let data;

  if(request.params.id) {
    data = await phone.getById(request.params.id);
  } else {
    data = await phone.getAll();
  }

  response.status(200).json(data);

}

const sendMessage = async (request, response) => {

  const data = request.body;

  const id = await messsage.create({from_number: data.from, to_number: data.to, body: data.body});
  const message = await messsage.getById(id);
  client.messages.create(data);

  response.status(201).json(message);

}


module.exports = {
  getPhone,
  sendMessage,
  getConversationListByPhone,
  getConversationMessageList
}