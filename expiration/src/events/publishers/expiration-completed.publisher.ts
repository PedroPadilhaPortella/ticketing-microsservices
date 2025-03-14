import { Publisher, Subjects, ExpirationCompletedEvent } from "@ticketing-microsservices/common";

export class ExpirationCompletedPublisher extends Publisher<ExpirationCompletedEvent> {
  subject: Subjects.ExpirationCompleted = Subjects.ExpirationCompleted;
}