import express, { NextFunction, Request, Response } from 'express';
import enforce from 'express-sslify';
import { createServer } from 'http';
import { Server } from "socket.io";
import StaticController from './controllers/StaticController.js';
import { handleError } from './helpers.js';
import oktaConfig from './oktaConfig.js';
import { oktaJwtVerifier } from './providers/oktaClient.js';
import Redis from './providers/redisClient.js';
import routes from './routes.js';

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

socketIoServer.on('connection', async (client) => {



  console.log('a user connected');

  client.on('userToken', async function (data) {
    const audience = oktaConfig.resourceServer.assertClaims.aud;
    const result = await oktaJwtVerifier.verifyAccessToken(data.accessToken, audience);

    const redisClient = await Redis.getClient();
    await redisClient.set(result.claims.sub, client.id);
    await redisClient.set(client.id, result.claims.sub);

    const res = await redisClient.get("prajendirane@twilio.com");

  });

  client.on('disconnect', async () => {
    const redisClient = await Redis.getClient();
    const username = await redisClient.get(client.id);

    if (username) {
      await redisClient.del(username);
    }

    await redisClient.del(client.id);
    console.log('user disconnected');
  });
});

app.use((_: Request, response: Response, next: NextFunction) => {
  response.locals.socketIoServer = socketIoServer;

  next();

});

routes(app);

app.use((err: Error, _: Request, res: Response, __: NextFunction) => {
  handleError(err, res);
});

StaticController.route(app);

httpServer.listen(PORT, () => {
  console.log(`Server running on ${PORT}`);
});