import { OrderCancelledEvent, OrderStatus } from '@ticketing-microsservices/common';
import { Message } from 'node-nats-streaming';
import mongoose from 'mongoose';

import { OrderCancelledListener } from '../order-cancelled.listener';
import { natsWrapper } from '../../../nats.wrapper';
import { Order } from '../../../models';

const setup = async () => {
  const listener = new OrderCancelledListener(natsWrapper.client);

  const order = Order.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    userId: new mongoose.Types.ObjectId().toHexString(),
    status: OrderStatus.Created,
    version: 0,
    price: 100,
  });
  await order.save();

  const data: OrderCancelledEvent['data'] = {
    id: order.id,
    ticket: { id: new mongoose.Types.ObjectId().toHexString() },
    version: 1,
  };

  const message = { ack: jest.fn() } as unknown as Message;

  return { listener, data, message };
}

describe('OrderCancelledListener', () => {
  it('should update the order status to be cancelled', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    const order = await Order.findById(data.id);

    expect(order!.status).toEqual(OrderStatus.Cancelled);
  });

  it('should ack the message', async () => {
    const { listener, data, message } = await setup();

    await listener.onMessage(data, message);

    expect(message.ack).toHaveBeenCalled();
  });
});