import express, { NextFunction, Request, Response } from 'express';
import enforce from 'express-sslify';
import { createServer } from 'http';
import { Server } from "socket.io";
import StaticController from './controllers/StaticController.js';
import { handleError } from './helpers.js';
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

app.use((_: Request, response: Response, next: NextFunction) => {
  response.locals.sockets = socketIoServer.sockets;

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