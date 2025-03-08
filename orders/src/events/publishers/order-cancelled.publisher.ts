import { Publisher, Subjects, OrderCancelledEvent } from "@ticketing-microsservices/common";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}