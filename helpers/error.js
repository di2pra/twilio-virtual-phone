class ErrorHandler extends Error {
  constructor(statusCode, message) {
    super();
    this.statusCode = statusCode;
    this.message = message;
  }
}

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


module.exports = {
  ErrorHandler,
  handleError
}