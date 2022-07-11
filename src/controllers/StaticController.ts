import express, { Express } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

export default class StaticController {

  static route = (app: Express) => {

    const __dirname = process.env.NODE_ENV != 'development' ? './' : path.dirname(fileURLToPath(import.meta.url));

    app.get('/index.html', (_, res) => {
      res.redirect('/');
    });

    app.use(express.static(path.join(__dirname, 'public')));

    app.get('/*', (_, res) => {
      res.sendFile(path.join(__dirname, 'public', 'index.html'));
    });
  }
}