import { Twilio } from 'twilio';
import { ErrorHandler } from '../../helpers.js';

export default class Messages {

  twilioClient: Twilio

  constructor(twilioClient: Twilio) {
    this.twilioClient = twilioClient;
  }

  create = async ({ from, to, body }: { from: string; to: string; body: string }) => {

    try {

      if (!from || !to || !body) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      await this.twilioClient.messages.create({ from, to, body });

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error')
    }

  }

}