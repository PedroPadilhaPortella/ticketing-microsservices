import { OrderCreatedEvent, OrderStatus } from '@ticketing-microsservices/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { OrderCreatedListener } from '../order-created.listener';
import { natsWrapper } from '../../../nats.wrapper';
import { Order } from '../../../models';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toString(),
    ticket: { id: new mongoose.Types.ObjectId().toHexString(), price: 10 },
    version: 0,
  };

  const message = { ack: jest.fn() } as unknown as Message;

  return { listener, data, message };
}

describe('OrderCreatedListener', () => {
  it('should save the order data', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const order = await Order.findById(data.id);

    expect(order!.price).toEqual(data.ticket.price);
  });

  it('should ack the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});