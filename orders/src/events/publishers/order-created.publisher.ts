import { Publisher, Subjects, OrderCreatedEvent } from "@ticketing-microsservices/common";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}