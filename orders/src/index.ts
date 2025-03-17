import mongoose from 'mongoose';

import { TicketCreatedListener, TicketUpdatedListener, ExpirationCompletedListener, PaymentCreatedListener } from './events';
import { natsWrapper } from './nats.wrapper';
import { app, port } from './app';

const startServer = async () => {
  if (!process.env.JWT_KEY) throw new Error('JWT_KEY must be defined');
  if (!process.env.MONGO_URI) throw new Error('MONGO_URI must be defined');
  if (!process.env.NATS_CLUSTER_ID) throw new Error('NATS_CLUSTER_ID must be defined');
  if (!process.env.NATS_CLIENT_ID) throw new Error('NATS_CLIENT_ID must be defined');
  if (!process.env.NATS_URL) throw new Error('NATS_URL must be defined');

  try {
    await natsWrapper
      .connect(process.env.NATS_CLUSTER_ID, process.env.NATS_CLIENT_ID, process.env.NATS_URL);

    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed');
      process.exit();
    });
    process.on('SIGINT', () => natsWrapper.client.close());
    process.on('SIGTERM', () => natsWrapper.client.close());

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();
    new ExpirationCompletedListener(natsWrapper.client).listen();
    new PaymentCreatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDb');
  } catch (error) {
    console.error(error);
  }

  app.listen(port, () => console.log(`Running on http://localhost:${port}`));
}

startServer();