const { ErrorHandler } = require('../helpers');

class TwilioMiddleware {

  constructor(twilioClient) {
    this.twilioClient = twilioClient;
  }

  getAllNumber = async (request, response, next) => {

    try {

      const data = await this.twilioClient.incomingPhoneNumbers.list();
      response.status(200).json(data);

    } catch (error) {
      next(error);
    }

  }

  getNumberByFilter = async (request, response, next) => {

    try {

      console.log(request.body.phoneNumbers);

      const data = await this.twilioClient.incomingPhoneNumbers.list({phoneNumber: request.body.phoneNumbers});
      response.status(200).json(data);

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