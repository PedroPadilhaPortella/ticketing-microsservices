import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';

declare global {
  var signIn: (userId?: string) => string[];
}

jest.mock('../nats.wrapper');

let mongo: any;

beforeAll(async () => {
  process.env.JWT_KEY = 'jwt-test-key';

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri, {});
});

beforeEach(async () => {
  jest.clearAllMocks();

  if (mongoose.connection.db) {
    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      await collection.deleteMany({});
    }
  }
});

afterAll(async () => {
  await mongo.stop();
  await mongoose.connection.close();
});

global.signIn = (userId?: string) => {
  const payload = { id: userId || new mongoose.Types.ObjectId().toHexString(), email: 'test@test.com' };

  const session = { jwt: jwt.sign(payload, process.env.JWT_KEY!) }

  const sessionJSON = JSON.stringify(session);

  const base64 = Buffer.from(sessionJSON).toString('base64');

  return [`session=${base64}`];
}