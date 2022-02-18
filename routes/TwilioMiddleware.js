const { ErrorHandler } = require('../helpers');

class TwilioMiddleware {

  constructor(twilioClient) {
    this.twilioClient = twilioClient;
  }

  getAllNumber = async (request, response, next) => {

    try {

      let responseData = Array();

      if(request.body.phoneNumbers) {

        for(const number of request.body.phoneNumbers) {
          const data = await this.twilioClient.incomingPhoneNumbers.list({phoneNumber: number});

          if(data.length === 1) {
            responseData.push(data[0]);
          }
        }

      } else {

        responseData = await this.twilioClient.incomingPhoneNumbers.list();

      }
      
      response.status(200).json(responseData);

    } catch (error) {
      next(error);
    }

  }

  getAllApplicaion = async (request, response, next) => {

    try {

      const data = await this.twilioClient.applications.list();
      response.status(200).json(data);

    } catch (error) {
      next(error);
    }

  }

  createApplication = async (request, response, next) => {

    try {

      if (!request.body.friendlyName) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      const data = await this.twilioClient.applications.create({
        friendlyName: request.body.friendlyName
      });

      response.status(200).json(data);

    } catch (error) {
      next(error);
    }

  }

  deleteApplication = async (request, response, next) => {

    try {

      if (!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      await this.twilioClient.applications(request.body.sid).remove();

      response.status(200).json({});

    } catch (error) {
      next(error);
    }

  }

}

module.exports = TwilioMiddleware