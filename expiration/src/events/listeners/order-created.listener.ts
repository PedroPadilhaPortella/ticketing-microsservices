import { Subjects, Listener, OrderCreatedEvent } from "@ticketing-microsservices/common";
import { Message } from "node-nats-streaming";

import { queueGroupName } from "./queue-group-name";
import { expirationQueue } from "../../queues/expiration.queue";

export class OrderCreatedListener extends Listener<OrderCreatedEvent> {
  readonly subject: Subjects.OrderCreated = Subjects.OrderCreated;
  queueGroupName = queueGroupName;

  async onMessage(data: OrderCreatedEvent['data'], message: Message): Promise<void> {
    const delay = new Date(data.expiresAt).getTime() - new Date().getTime();

    console.log(`Waiting ${delay} seconds while processing the order`);

    await expirationQueue.add({ orderId: data.id }, { delay });

    message.ack();
  }
}