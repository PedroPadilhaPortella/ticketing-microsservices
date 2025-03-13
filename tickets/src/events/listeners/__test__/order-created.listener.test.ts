import { OrderCreatedEvent, OrderStatus } from '@ticketing-microsservices/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { OrderCreatedListener } from '../order-created.listener';
import { natsWrapper } from '../../../nats.wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({ title: 'concert', price: 10, userId: 'userId' });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    expiresAt: new Date().toString(),
    ticket: { id: ticket.id, price: ticket.price },
    version: 0,
  };

  const message = { ack: jest.fn() } as unknown as Message;

  return { listener, ticket, data, message };
}

describe('OrderCreatedListener', () => {
  it('should set the orderId of the ticket', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.ticket.id);

    expect(ticket!.orderId).toEqual(data.id);
  });

  it('should publish the ticket updated event', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedTicket = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(updatedTicket.orderId).toEqual(data.id);
  });

  it('should ack the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});