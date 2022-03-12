import { Twilio } from 'twilio';
import { ErrorHandler } from '../../helpers.js';

export default class IncomingPhoneNumbers {

  twilioClient: Twilio

  constructor(twilioClient: Twilio) {
    this.twilioClient = twilioClient;
  }

  getAll = async (phoneNumbers?: string[]) => {

    try {

      let responseData = Array();

      if (phoneNumbers) {

        for (const number of phoneNumbers) {
          const data = await this.twilioClient.incomingPhoneNumbers.list({ phoneNumber: number });

          if (data.length === 1) {
            responseData.push(data[0]);
          }
        }

      } else {

        responseData = await this.twilioClient.incomingPhoneNumbers.list();

      }

      return responseData;

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error')
    }

  }

  update = async ({ sid, friendlyName, voiceApplicationSid, smsApplicationSid }: { sid: string; friendlyName?: string; voiceApplicationSid: string; smsApplicationSid: string }) => {

    try {

      if (!sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      return await this.twilioClient.incomingPhoneNumbers(sid)
        .update({
          friendlyName: friendlyName,
          voiceApplicationSid: voiceApplicationSid,
          smsApplicationSid: smsApplicationSid
        });

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error');
    }

  }


}