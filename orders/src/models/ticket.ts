import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose from 'mongoose';

import { Order, OrderStatus } from './order';

interface TicketProps {
  id: string
  title: string
  price: number
}

export interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  version: number
  isReserved(): Promise<boolean>
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(props: TicketProps): TicketDoc
  findByEvent(event: { id: string, version: number }): Promise<TicketDoc | null>
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
    min: 0
  }
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

ticketSchema.set('versionKey', 'version');

ticketSchema.plugin(updateIfCurrentPlugin);

ticketSchema.statics.build = ({ id, title, price }: TicketProps) => {
  return new Ticket({ _id: id, title, price });
}

ticketSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Ticket.findOne({ _id: event.id, version: event.version - 1 });
}

ticketSchema.methods.isReserved = async function (): Promise<boolean> {
  const ticketAlreadyReserved = await Order.findOne({
    ticket: this,
    status: {
      $in: [
        OrderStatus.Created,
        OrderStatus.AwaitingPayment,
        OrderStatus.Complete,
      ]
    }
  });
  return !!ticketAlreadyReserved;
}

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };