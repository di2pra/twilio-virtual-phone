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

  create = async ({ friendlyName, smsUrl, voiceUrl }: { friendlyName: string, smsUrl: string; voiceUrl: string }) => {

    try {

      if (!friendlyName && !smsUrl && !voiceUrl) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      return await this.twilioClient.applications.create({
        friendlyName: friendlyName,
        smsUrl: smsUrl,
        voiceUrl: voiceUrl
      });

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error');
    }

  }

  update = async ({ sid, friendlyName, smsUrl, voiceUrl }: { sid: string; friendlyName?: string; smsUrl: string; voiceUrl: string }) => {

    try {

      if (!sid && !friendlyName && !smsUrl && !voiceUrl) {
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

}