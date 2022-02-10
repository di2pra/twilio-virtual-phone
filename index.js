const express = require('express');
const app = express();
const path = require("path");
const redis = require('redis');
const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const Pool = require('pg').Pool;
const middleware = require('./middleware');
const { handleError } = require('./helpers');
const TwilioMiddleware = require('./routes/TwilioMiddleware');
const configuration = require('./Configuration');
const Api = require('./routes/Api');

const pgClient = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const redisClient = redis.createClient({
  url: process.env.REDIS_URL
});

const twilioClient = twilio(accountSid, authToken);

redisClient.connect();

redisClient.once('ready', function () {

  console.log('Redis Client ready');

});

redisClient.on('error', function () {

  console.log('Redis Client Error');

});

redisClient.on('connect', function () {

  console.log('Redis Client Connected');

});

const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT || 80;

if (process.env.NODE_ENV === 'dev') {
  const cors = require('cors');
  var corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200
  }

  app.use(cors(corsOptions));
}

app.use(express.json());

app.use(express.urlencoded({
  extended: false
}));



const api = new Api(pgClient, twilioClient);
const twilioMiddleware = new TwilioMiddleware(twilioClient);

app.use('/api/', middleware.validateApiKey);
app.get('/api/v1', (req, res) => {
  res.status(200).json({ message: `Twilio Virtual Phone API` });
});
app.post('/api/v1/message', api.sendMessage);
app.get('/api/v1/message/phone/:id/conversation', api.getConversationListByPhone);
app.get('/api/v1/message/phone/:id/conversation/:number', api.getConversationMessageList);
app.post('/api/v1/call', api.createCall);
app.get('/api/v1/call/phone/:id', api.getCallListByPhone);
app.get('/api/v1/phone/:id?', api.getPhone);
app.post('/api/v1/phone', api.createPhone);
app.put('/api/v1/phone/:id', api.updatePhone);
app.get('/api/v1/voice/generateToken', api.tokenGenerator);
app.post('/voice', api.voiceResponse);
app.get('/api/v1/twilio/number', twilioMiddleware.getAllNumbers);
app.get('/api/v1/twilio/application', twilioMiddleware.getAllApplicaions);
app.get('/api/v1/configuration', configuration.getConfiguration(redisClient));
app.post('/api/v1/configuration', configuration.getConfiguration(redisClient));

app.use('/webhook/', twilio.webhook({ protocol: 'https' }));
app.post('/webhook/v1/message', api.createMessage, (req, res) => {
  io.sockets.emit('refreshMessage');
  res.status(201).send(`Message added !`);
});

app.get('/index.html', (req, res) => {
  res.redirect('/');
});

app.use(express.static(path.join(__dirname, 'public')));

app.get('/*', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use((err, req, res, next) => {
  handleError(err, res);
});

server.listen(PORT);