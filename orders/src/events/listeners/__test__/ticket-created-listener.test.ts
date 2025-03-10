import { TicketCreatedEvent } from '@ticketing-microsservices/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { TicketCreatedListener } from '../ticket-created.listener';
import { natsWrapper } from '../../../nats.wrapper';
import { Ticket } from '../../../models';

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);

  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
    version: 0,
  };

  const message = { ack: jest.fn() } as unknown as Message;

  return { listener, data, message };
}

describe('TicketCreatedListener', () => {
  it('should create and save a ticket', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.id);

    expect(ticket).toBeDefined();
    expect(ticket!.title).toEqual(data.title);
    expect(ticket!.price).toEqual(data.price);
  });

  it('should ack the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});