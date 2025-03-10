import { Subjects, Listener, TicketUpdatedEvent } from "@ticketing-microsservices/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { Ticket } from "../../models";

export class TicketUpdatedListener extends Listener<TicketUpdatedEvent> {
  readonly subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
  queueGroupName = queueGroupName;

  async onMessage(data: TicketUpdatedEvent['data'], message: Message): Promise<void> {
    const { id, title, price, version } = data;

    const ticket = await Ticket.findByEvent({ id, version });
    if (!ticket) throw new Error('ticket not found');

    ticket.set({ title, price });
    await ticket.save();
    message.ack();
  }
}