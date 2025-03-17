import { Subjects, Listener, PaymentCreatedEvent } from "@ticketing-microsservices/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Order, OrderStatus } from '../../models';

export class PaymentCreatedListener extends Listener<PaymentCreatedEvent> {
  readonly subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: PaymentCreatedEvent['data'], message: Message): Promise<void> {
    const order = await Order.findById(data.orderId);

    if (!order) throw new Error('Order not found');

    order.set({ status: OrderStatus.Complete });
    await order.save();

    message.ack();
  }
}