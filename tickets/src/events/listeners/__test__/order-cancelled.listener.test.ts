import { OrderCancelledEvent } from '@ticketing-microsservices/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { OrderCancelledListener } from '../order-cancelled.listener';
import { natsWrapper } from '../../../nats.wrapper';
import { Ticket } from '../../../models/ticket';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);
  const orderId = new mongoose.Types.ObjectId().toHexString();

  const ticket = Ticket.build({ title: 'concert', price: 10, userId: 'userId', });
  ticket.set({ orderId });
  await ticket.save();

  const data: OrderCancelledEvent['data'] = {
    id: orderId,
    ticket: { id: ticket.id },
    version: 0,
  };

  const message = { ack: jest.fn() } as unknown as Message;

  return { listener, ticket, data, message };
}

describe('OrderCancelledListener', () => {
  it('should update the orderId property into the ticket to be undefined', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const ticket = await Ticket.findById(data.ticket.id);

    expect(ticket!.orderId).not.toBeDefined();
  });

  it('should publish the ticket updated event', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedTicket = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(updatedTicket.orderId).not.toBeDefined();
  });

  it('should ack the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});