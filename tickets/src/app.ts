import { errorHandler, NotFoundError } from '@ticketing-microsservices/common';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';

const port = 3000;
const app = express();

app.set('trust proxy', true)

app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app, port };