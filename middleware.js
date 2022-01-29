const { ErrorHandler } = require("./helpers/error");

const validateApiKey = (request, response, next) => {

  const requestApiKey = request.get('X-API-KEY');

  if(requestApiKey === process.env.API_KEY) {
    next();
  } else {
    throw new ErrorHandler(401, 'Unauthorized !!')
  }

}

module.exports = {
  validateApiKey
}