import { Twilio } from 'twilio';
import { ErrorHandler } from '../../helpers.js';

export default class Applications {

  twilioClient: Twilio;

  constructor(twilioClient: Twilio) {
    this.twilioClient = twilioClient;
  }

  get = async (sid: string) => {

    try {

      let responseData = null;

      if (sid) {
        responseData = await this.twilioClient.applications(sid).fetch();
      } else {
        responseData = await this.twilioClient.applications.list();
      }

      return responseData;

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error')
    }

  }

  create = async ({ friendlyName }: { friendlyName: string }) => {

    try {

      if (!friendlyName) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      return await this.twilioClient.applications.create({
        friendlyName: friendlyName
      });

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error');
    }

  }

  update = async ({ sid, friendlyName, smsUrl, voiceUrl }: { sid: string; friendlyName?: string; smsUrl: string; voiceUrl: string }) => {

    try {

      if (!sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      return await this.twilioClient.applications(sid)
        .update({
          friendlyName: friendlyName,
          smsUrl: smsUrl,
          voiceUrl: voiceUrl
        });

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error');
    }

  }

  delete = async (sid: string) => {

    try {

      if (!sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      await this.twilioClient.applications(sid).remove();

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error');
    }

  }

}