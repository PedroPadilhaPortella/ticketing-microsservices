import { Subjects, Listener, OrderCancelledEvent } from "@ticketing-microsservices/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models/ticket";
import { TicketUpdatedPublisher } from "../publishers/ticket-updated.publisher";

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  readonly subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCancelledEvent['data'], message: Message): Promise<void> {
    const ticket = await Ticket.findById(data.ticket.id);
    if (!ticket) throw new Error('Ticket not found');

    ticket.set({ orderId: undefined });
    await ticket.save();

    const publisher = new TicketUpdatedPublisher(this.client)
    await publisher.publish({
      id: ticket.id,
      title: ticket.title,
      price: ticket.price,
      userId: ticket.userId,
      version: ticket.version,
      orderId: ticket.orderId
    });

    message.ack();
  }
}