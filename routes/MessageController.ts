import { NextFunction, Request, Response } from "express";
import { Pool } from "pg";
import { ErrorHandler } from "../helpers.js";
import Message from "../models/Message.js";
import TwilioRessource from "../models/TwilioRessource.js";

export default class MessageController {

  private message : Message
  private twilioRessource : TwilioRessource

  constructor(pgClient : Pool, twilioRessource : TwilioRessource) {
    this.message = new Message(pgClient);
    this.twilioRessource = twilioRessource;
  }

  getConversationListByPhone = async (request : Request, response : Response, next : NextFunction) => {


    try {

      let data;

      if (request.params.id) {
        data = await this.message.getConversationListByPhoneId(Number(request.params.id));
      }

      response.status(200).json(data);

    } catch (error) {
      next(error)
    }

  }

  getConversationMessageList = async (request : Request, response : Response, next : NextFunction) => {

    try {

      let data;

      if (request.params.id && request.params.number) {
        data = await this.message.getMessageByConversation(Number(request.params.id), request.params.number);
        response.status(200).json(data);
      } else {
        throw new ErrorHandler(400, 'Bad Request');
      }

    } catch (error) {
      next(error)
    }

  }


  sendMessage = async (request : Request, response : Response, next : NextFunction) => {

    try {

      const data = request.body;

      if (!data.from || !data.to || !data.body) {
        throw new ErrorHandler(400, 'Bad Request')
      }

      await this.twilioRessource.messages.create(data);
      const id = await this.message.create({ from_number: data.from, to_number: data.to, body: data.body });
      const message = await this.message.getById(id);
      response.status(201).json(message);

    } catch (error) {
      next(error);
    }

  }

}