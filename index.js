const express = require('express')
const app = express();
const cors = require('cors');
const path = require("path")

const api = require('./routes/api');
const webhooks = require('./routes/webhook');
const middleware = require('./middleware');
const twilio = require('twilio');
const { handleError } = require('./helpers/error');

const server = require('http').Server(app)
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  }
});

const PORT = process.env.PORT

var corsOptions = {
  origin: 'http://localhost:3000',
  optionsSuccessStatus: 200
}

app.use(cors(corsOptions));

app.use(express.json());

app.use(express.urlencoded({
  extended: false
}));

io.on('connection', (socket) => {
});

app.use('/api/', middleware.validateApiKey);
app.get('/api/v1', (req, res) => {
  res.status(200).json({message: `Twilio Virtual Phonoe API`});
});
app.post('/api/v1/message', api.sendMessage);
app.get('/api/v1/message/phone/:id/conversation', api.getConversationListByPhone);
app.get('/api/v1/message/phone/:id/conversation/:number', api.getConversationMessageList);
app.get('/api/v1/phone/:id?', api.getPhone);
app.post('/api/v1/phone', api.createPhone);
app.put('/api/v1/phone/:id', api.updatePhone);

app.use('/webhook/', twilio.webhook({ protocol: 'https' }));
app.post('/webhook/v1/message', webhooks.createMessage, (req, res) => {
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