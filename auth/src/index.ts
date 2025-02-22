import express from 'express';
import 'express-async-errors';
import mongoose from 'mongoose';
import { json } from 'body-parser';
import cookieSession from 'cookie-session';

import { errorHandler } from './middlewares/error-handler';
import { currentUserRouter } from './routes/current-user';
import { NotFoundError } from './errors/not-found-error';
import { signOutRouter } from './routes/signout';
import { signInRouter } from './routes/signin';
import { signUpRouter } from './routes/signup';

const port = 3000;
const app = express();

app.set('trust proxy', true)

app.use(json());
app.use(cookieSession({
  signed: false,
  secure: true
}));

app.use(currentUserRouter);
app.use(signInRouter);
app.use(signUpRouter);
app.use(signOutRouter);

app.all('*', async (req, res) => {
  throw new NotFoundError();
});

app.use(errorHandler);

const startServer = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

  try {
    await mongoose.connect('mongodb://auth-mongodb-service:27017/auth');
    console.log('Connected to MongoDb');
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => console.log(`Running on http://localhost:${port}`));
}

startServer();