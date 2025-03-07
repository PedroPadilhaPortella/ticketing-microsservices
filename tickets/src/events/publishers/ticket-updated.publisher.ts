import { Publisher, Subjects, TicketUpdatedEvent } from "@ticketing-microsservices/common";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}