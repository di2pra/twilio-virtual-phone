import { NextFunction, Request, Response } from "express";
import { ErrorHandler } from "../helpers.js";
import Message from "../models/Message.js";

export default class MessageController {

  static getConversationListByPhone = async (request: Request, response: Response, next: NextFunction) => {


    try {

      let data;

      if (request.params.id) {
        data = await Message.getConversationListByPhoneId(Number(request.params.id));
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

  static getConversationMessageList = async (request: Request, response: Response, next: NextFunction) => {

    try {

      let data;

      if (request.params.id && request.params.number) {
        data = await Message.getMessageByConversation(Number(request.params.id), request.params.number);
        response.status(200).json(data);
      } else {
        throw new ErrorHandler(400, 'Bad Request');
      }

    } catch (error) {
      next(error)
    }

  }


  static sendMessage = async (request: Request, response: Response, next: NextFunction) => {

    try {

      const data = request.body;

      if (!data.from || !data.to || !data.body) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      //await this.twilioRessource.messages.create(data);
      const id = await Message.create({ from_number: data.from, to_number: data.to, body: data.body });
      const message = await Message.getById(id);
      response.status(201).json(message);

    } catch (error) {
      next(error);
    }

  }

}