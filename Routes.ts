import { Pool } from "pg";
import { Server } from "socket.io";
import { threadId } from "worker_threads";
import TwilioRessource from "./models/TwilioRessource.js";
import CallController from "./routes/CallController.js"
import ConfigurationController from "./routes/ConfigurationController.js";
import MessageController from "./routes/MessageController.js";
import PhoneController from "./routes/PhoneController.js";
import TwilioController from "./routes/TwilioController.js";
import WebhookController from "./routes/WebhookController.js";

export default class Routes {

  phoneController: PhoneController;
  callController: CallController;
  messageController: MessageController;
  configurationController: ConfigurationController;
  twilioController: TwilioController;
  webhookController: WebhookController;

  constructor(pgClient: Pool, twilioRessource: TwilioRessource, socketIoServer: Server) {
    this.callController = new CallController(pgClient);
    this.phoneController = new PhoneController(pgClient, twilioRessource);
    this.messageController = new MessageController(pgClient, twilioRessource);
    this.configurationController = new ConfigurationController(pgClient, twilioRessource);
    this.twilioController = new TwilioController(twilioRessource);
    this.webhookController = new WebhookController(pgClient, socketIoServer);
  }

}