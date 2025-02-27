import { app, port } from './app';
import mongoose from 'mongoose';

const startServer = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');

  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');

  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => console.log(`Running on http://localhost:${port}`));
}

startServer();