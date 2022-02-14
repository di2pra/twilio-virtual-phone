const { ErrorHandler } = require('./helpers');

const getConfiguration = (redisClient) => {
  return async (request, response, next) => {

    try {

      const value = await redisClient.get('configuration');

      if (value) {
        response.status(200).json(JSON.parse(value));
      } else {
        response.status(200).json(null);
      }

    } catch (error) {

      next(error);

    }

  }
}

const setConfiguration = (redisClient, twilioClient) => {

  return async (request, response, next) => {

    try {

      if(!request.body.sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      let hostname = request.headers.host;

      if (process.env.NODE_ENV === 'dev') {
        hostname = process.env.NGROK_HOSTNAME
      }

      const data = await twilioClient.applications(request.body.sid)
      .update({
         smsUrl: `https://${hostname}/sms`,
         voiceUrl: `https://${hostname}/voice`
       });

      await redisClient.set('configuration', JSON.stringify({ twimlAppSid: data.sid }));

      const value = await redisClient.get('configuration');

      response.status(200).json(value);

    } catch (error) {

      next(error);

    }

  }
}

const deleteConfiguration = (redisClient) => {

  return async (request, response, next) => {

    try {

      await redisClient.set('configuration', null);

      response.status(200).json({});

    } catch (error) {

      next(error);

    }

  }
}

module.exports = {
  getConfiguration,
  setConfiguration,
  deleteConfiguration
}
