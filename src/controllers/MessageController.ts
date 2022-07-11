import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import Message from "../models/Message.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class MessageController {

  static getConversationListByPhone = async (request: Request, response: Response, next: NextFunction) => {


    try {

      if (!request.params.sid) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      const data = await Message.getConversationListByPhoneSid(request.params.sid);

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

  static getConversationMessageList = async (request: Request, response: Response, next: NextFunction) => {

    try {

      if (!request.params.sid && !request.params.number) {
        throw new ErrorHandler(400, 'Bad Request');
      }

      const data = await Message.getMessageByConversation(request.params.sid, request.params.number);

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }


  static sendMessage = async (request: Request, response: Response, next: NextFunction) => {

    try {

      const data = request.body;

      if (!data.from_sid || !data.to_number || !data.body) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      const twilioRessource = await TwilioRessource.initClient(response.locals.jwt);

      const phone = await twilioRessource.incomingPhoneNumbers.getBySid(data.from_sid);

      const newMessage = await Message.create({ from_sid: data.from_sid, from_number: phone.phoneNumber, to_number: data.to_number, body: data.body });

      await twilioRessource.messages.create({
        from_number: phone.phoneNumber,
        to_number: data.to_number,
        body: data.body
      });

      response.status(201).json(newMessage);

    } catch (error: any) {
      next(error);
    }

  }

}