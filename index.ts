import express, { NextFunction, Request, Response } from 'express';
import twilio from 'twilio';
import pg from 'pg';
import { createServer } from 'http';
import { Server } from "socket.io";
import enforce from 'express-sslify';


/*const accountSid = process.env.TWILIO_ACCOUNT_SID || '';
const twilioApiKey: string = process.env.TWILIO_API_KEY || '';
const twilioApiSecret: string = process.env.TWILIO_API_SECRET || '';*/

import { handleError } from './helpers.js';
import TwilioRessource from './models/TwilioRessource.js';
import Routes from './Routes.js';
import AccountController from './routes/AccountController.js';
import StaticController from './routes/StaticController.js';


const pgClient = new pg.Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

//const twilioClient = twilio(twilioApiKey, twilioApiSecret, { accountSid: accountSid });

const app = express();
const httpServer = createServer(app);
const socketIoServer = new Server(httpServer, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 80;

if (process.env.NODE_ENV != 'development') {
  app.use(enforce.HTTPS({ trustProtoHeader: true }));
}

app.use(express.json());

app.use(express.urlencoded({
  extended: false
}));


//const twilioRessource = new TwilioRessource(twilioClient);
const routes = new Routes(pgClient, twilioRessource, socketIoServer);

app.use('/api', routes.oktaController.authenticationRequired);

app.get('/api/v1', (_ : Request, res : Response) => {
  res.status(200).json({ message: `Twilio Virtual Phone API` });
});


app.post('/api/v1/message', routes.messageController.sendMessage);
app.get('/api/v1/message/phone/:id/conversation', routes.messageController.getConversationListByPhone);
app.get('/api/v1/message/phone/:id/conversation/:number', routes.messageController.getConversationMessageList);

app.get('/api/v1/call/phone/:id', routes.callController.getByPhone);
app.delete('/api/v1/call/:id', routes.callController.delete);

app.get('/api/v1/phone/:id?', routes.phoneController.get);
app.post('/api/v1/phone', routes.phoneController.add);
app.put('/api/v1/phone/:id', routes.phoneController.update);
app.delete('/api/v1/phone/:id', routes.phoneController.delete);




app.get('/api/v1/configuration', routes.configurationController.get);
app.post('/api/v1/configuration', routes.configurationController.set);

app.get('/api/v1/twilio/number', routes.twilioController.getAllNumber);
app.post('/api/v1/twilio/number', routes.twilioController.getAllNumber);
app.get('/api/v1/twilio/application/:sid?', routes.twilioController.getApplication);
app.post('/api/v1/twilio/application', routes.twilioController.createApplication);

app.get('/api/v1/voice/generateToken', routes.webhookController.tokenGenerator);
app.use('/webhook/', twilio.webhook({ protocol: 'https' }));
app.post('/webhook/message', routes.webhookController.messageResponse);
app.post('/webhook/voice', routes.webhookController.voiceResponse);

AccountController.route(app);
StaticController.route(app);

app.use((err: Error, _: Request, res: Response, next: NextFunction) => {
  handleError(err, res);
});

httpServer.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});