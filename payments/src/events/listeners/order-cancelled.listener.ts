import { Subjects, Listener, OrderCancelledEvent } from "@ticketing-microsservices/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Order, OrderStatus } from "../../models";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], message: Message): Promise<void> {
    const order = await Order.findByEvent({ id: data.id, version: data.version });

    if (!order) throw new Error('Order not found');

    order.set({ status: OrderStatus.Cancelled })
    await order.save();

    message.ack();
  }
}