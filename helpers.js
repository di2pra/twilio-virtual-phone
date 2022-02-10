class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}


/**
 * Express JS Error Handler Middleware
 * @param {Error} err
 * @return {Boolean}
 */
const handleError = (err, res) => {
  
  if(err instanceof ErrorHandler) {
    const { statusCode, message } = err;
    res.status(statusCode).json({
      status: "error",
      statusCode,
      message
    });
  } else {
    res.status(500).json({
      status: "error",
      statusCode: 500,
      message: err.message
    });
  }
  
};

/**
 * Checks if the given value is valid as phone number
 * @param {Number|String} number
 * @return {Boolean}
 */
function isAValidPhoneNumber(number) {
  return /^[\d\+\-\(\) ]+$/.test(number);
}


module.exports = {
  ErrorHandler,
  handleError,
  isAValidPhoneNumber
}