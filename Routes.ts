import { Express, Request, Response } from 'express';
import AccountController from './controllers/AccountController.js';
import CallController from './controllers/CallController.js';
import ConfigurationController from './controllers/ConfigurationController.js';
import MessageController from './controllers/MessageController.js';
import OktaController from './controllers/OktaController.js';
import PhoneController from './controllers/PhoneController.js';
import TwilioController from './controllers/TwilioController.js';
import WebhookController from './controllers/WebhookController.js';

const API_BASE_PATH = `/api/v1`;

const routes = (app: Express) => {

  app.use(`${API_BASE_PATH}`, OktaController.authenticationRequired);

  app.get(`${API_BASE_PATH}`, (_: Request, res: Response) => {
    res.status(200).json({ message: `Twilio Virtual Phone API` });
  });

  app.route(`${API_BASE_PATH}/account`)
    .get(AccountController.get)
    .post(AccountController.add)
    .put(AccountController.updateTwimlApp);

  app.post(`${API_BASE_PATH}/message`, MessageController.sendMessage);
  app.get(`${API_BASE_PATH}/message/phone/:id/conversation`, MessageController.getConversationListByPhone);
  app.get(`${API_BASE_PATH}/message/phone/:id/conversation/:number`, MessageController.getConversationMessageList);


  app.get(`${API_BASE_PATH}/call/phone/:id`, CallController.getByPhone);
  app.delete(`${API_BASE_PATH}/call/:id`, CallController.delete);


  app.get(`${API_BASE_PATH}/phone/:id?`, PhoneController.get);
  app.post(`${API_BASE_PATH}/phone`, PhoneController.add);
  app.put(`${API_BASE_PATH}/phone/:id`, PhoneController.update);
  app.delete(`${API_BASE_PATH}/phone/:id`, PhoneController.delete);

  app.get(`${API_BASE_PATH}/configuration`, ConfigurationController.get);
  app.post(`${API_BASE_PATH}/configuration`, ConfigurationController.set);

  //app.get(`${API_BASE_PATH}/twilio/number`, TwilioController.getAllNumber);
  app.post(`${API_BASE_PATH}/twilio/number`, TwilioController.getAllNumber);
  app.get(`${API_BASE_PATH}/twilio/application/:sid?`, TwilioController.getApplication);
  app.post(`${API_BASE_PATH}/twilio/application`, TwilioController.createApplication);

  app.get(`${API_BASE_PATH}/twilioClient/generateToken`, WebhookController.tokenGenerator);


  /*app.use('/webhook/', twilio.webhook({ protocol: 'https' }));
  app.post('/webhook/message', routes.webhookController.messageResponse);
  app.post('/webhook/voice', routes.webhookController.voiceResponse);*/

};

export default routes;