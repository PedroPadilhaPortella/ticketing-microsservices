import { Publisher, Subjects, PaymentCreatedEvent } from "@ticketing-microsservices/common";

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}