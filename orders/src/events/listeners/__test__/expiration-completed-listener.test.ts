import { ExpirationCompletedEvent, TicketUpdatedEvent } from '@ticketing-microsservices/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { ExpirationCompletedListener } from '../expiration-completed.listener';
import { natsWrapper } from '../../../nats.wrapper';
import { Order, Ticket, OrderStatus } from '../../../models';

const setup = async () => {
  const listener = new ExpirationCompletedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'concert',
    price: 10,
  });
  await ticket.save();

  const order = Order.build({
    status: OrderStatus.Created,
    userId: 'userId',
    expiresAt: new Date(),
    ticket
  });
  await order.save();

  const data: ExpirationCompletedEvent['data'] = { orderId: order.id };

  const message = { ack: jest.fn() } as unknown as Message;

  return { listener, data, message };
}

describe('ExpirationCompletedListener', () => {
  it('should find a order, update the status and save', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const updatedOrder = await Order.findById(data.orderId);

    expect(updatedOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  it('should publish the order updated event', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(natsWrapper.client.publish).toHaveBeenCalled();

    const updatedOrder = JSON.parse((natsWrapper.client.publish as jest.Mock).mock.calls[0][1]);
    expect(updatedOrder.id).toEqual(data.orderId);
  });

  it('should ack the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});