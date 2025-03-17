import { currentUser, errorHandler, NotFoundError } from '@ticketing-microsservices/common';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';

import { createPaymentRouter } from './routes';

const port = 3000;
const app = express();

app.set('trust proxy', true)

app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUser);

app.use(createPaymentRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app, port };