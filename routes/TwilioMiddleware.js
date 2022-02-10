class TwilioMiddleware {

  constructor(twilioClient) {
    this.twilioClient = twilioClient;
  }

  getAllNumbers = async (request, response, next) => {

    try {
  
      const data = await this.twilioClient.incomingPhoneNumbers.list();
      response.status(200).json(data);
  
    } catch (error) {
      next(error);
    }
  
  }

  getAllApplicaions = async (request, response, next) => {

    try {
  
      const data = await this.twilioClient.applications.list();
      response.status(200).json(data);
  
    } catch (error) {
      next(error);
    }
  
  }
  
}

module.exports = TwilioMiddleware