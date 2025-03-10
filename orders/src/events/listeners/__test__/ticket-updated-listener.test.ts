import { TicketUpdatedEvent } from '@ticketing-microsservices/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { TicketUpdatedListener } from '../ticket-updated.listener';
import { natsWrapper } from '../../../nats.wrapper';
import { Ticket } from '../../../models';

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    userId: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert 2',
    price: 20,
    version: ticket.version + 1,
  };

  const message = { ack: jest.fn() } as unknown as Message;

  return { listener, data, message };
}

describe('TicketUpdatedListener', () => {
  it('should find a ticket, update and save a it', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedTicket = await Ticket.findById(data.id);

    expect(updatedTicket!.title).toEqual(data.title);
    expect(updatedTicket!.price).toEqual(data.price);
    expect(updatedTicket!.version).toEqual(data.version);
  });

  it('should ack the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });

  it('should not ack when the event has been skipped', async () => {
    const { listener, data, message } = await setup();

    data.version = 3;

    try {
      await listener.onMessage(data, message);
    } catch (err) {
      return;
    }

    expect(message.ack).not.toHaveBeenCalled();
  });
});