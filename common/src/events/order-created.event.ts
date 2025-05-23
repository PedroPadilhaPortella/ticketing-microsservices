import { OrderStatus } from "./types/order-status";
import { Subjects } from "./subjects";

export interface OrderCreatedEvent {
  subject: Subjects.OrderCreated;
  data: {
    id: string;
    userId: string;
    status: OrderStatus;
    expiresAt: string;
    version: number;
    ticket: {
      id: string;
      price: number;
    }
  };
}