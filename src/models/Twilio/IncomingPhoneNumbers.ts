import { Twilio } from 'twilio';
import { ErrorHandler } from '../../helpers.js';

export default class IncomingPhoneNumbers {

  twilioClient: Twilio

  constructor(twilioClient: Twilio) {
    this.twilioClient = twilioClient;
  }

  getAll = async () => {

    try {

      return await this.twilioClient.incomingPhoneNumbers.list({ limit: 50 });

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error')
    }

  }

  getBySid = async (phone_sid: string) => {

    try {

      return await this.twilioClient.incomingPhoneNumbers(phone_sid).fetch();

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error')
    }

  }

  getByApplicationId = async (twiml_app_sid: string) => {

    try {

      let responseData = Array();

      const fullList = await this.twilioClient.incomingPhoneNumbers.list({ limit: 50 });

      return fullList.filter((item) => { return item.smsApplicationSid === twiml_app_sid && item.voiceApplicationSid === twiml_app_sid });

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