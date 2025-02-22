import { app, port } from './app';
import mongoose from 'mongoose';

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