import { Subjects, Listener, ExpirationCompletedEvent } from "@ticketing-microsservices/common";
import { Message } from "node-nats-streaming";

import { OrderCancelledPublisher } from "../publishers/order-cancelled.publisher";
import { queueGroupName } from "./queue-group-name";
import { Order, OrderStatus } from "../../models";

export class ExpirationCompletedListener extends Listener<ExpirationCompletedEvent> {
  readonly subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
  queueGroupName = queueGroupName;

  async onMessage(data: ExpirationCompletedEvent['data'], message: Message): Promise<void> {
    const order = await Order.findById(data.orderId).populate('ticket');
    if (!order) throw new Error('order not found');

    order.set({ status: OrderStatus.Cancelled });
    await order.save();

    await new OrderCancelledPublisher(this.client).publish({
      id: order.id,
      version: order.version,
      ticket: { id: order.ticket.id }
    });

    message.ack();
  }
}