import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import mongoose from 'mongoose';

interface TicketProps {
  title: string
  price: number
  userId: string
}

interface TicketDoc extends mongoose.Document {
  title: string
  price: number
  userId: string
  version: number;
}

interface TicketModel extends mongoose.Model<TicketDoc> {
  build(props: TicketProps): TicketDoc
}

const ticketSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  userId: {
    type: String,
    required: true,
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

ticketSchema.statics.build = (props: TicketProps) => new Ticket(props);

const Ticket = mongoose.model<TicketDoc, TicketModel>('Ticket', ticketSchema);

export { Ticket };