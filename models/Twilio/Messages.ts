import { Twilio } from 'twilio';
import { ErrorHandler } from '../../helpers.js';

export default class Messages {

  twilioClient: Twilio

  constructor(twilioClient: Twilio) {
    this.twilioClient = twilioClient;
  }

  create = async ({ from_number, to_number, body }: { from_number: string; to_number: string; body: string }) => {

    try {

      if (!from_number || !to_number || !body) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      await this.twilioClient.messages.create({ from: from_number, to: to_number, body });

    } catch (error) {
      throw new ErrorHandler(500, 'Internal Error')
    }

  }

}