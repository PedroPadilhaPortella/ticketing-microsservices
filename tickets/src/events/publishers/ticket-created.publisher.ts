import { Publisher, Subjects, TicketCreatedEvent } from "@ticketing-microsservices/common";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}