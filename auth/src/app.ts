import { errorHandler, NotFoundError } from '@ticketing-microsservices/common';
import cookieSession from 'cookie-session';
import { json } from 'body-parser';
import express from 'express';
import 'express-async-errors';

import { currentUserRouter } from './routes/current-user';
import { signOutRouter } from './routes/signout';
import { signInRouter } from './routes/signin';
import { signUpRouter } from './routes/signup';

const port = 3000;
const app = express();

app.set('trust proxy', true)

app.use(json());
app.use(cookieSession({
  signed: false,
  secure: process.env.NODE_ENV !== 'test'
}));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

export { app, port };