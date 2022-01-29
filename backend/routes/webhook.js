const messsage = require('./../models/Message');

const createMessage = async (request, response, next) => {
  
  const data = request.body;

  const id = await messsage.create({from_number: data.From, to_number: data.To, body: data.Body});
  next();

}

module.exports = {
  createMessage
}