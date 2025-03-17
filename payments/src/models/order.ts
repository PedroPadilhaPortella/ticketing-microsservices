import { updateIfCurrentPlugin } from 'mongoose-update-if-current';
import { OrderStatus } from '@ticketing-microsservices/common';
import mongoose from 'mongoose';

export { OrderStatus };

interface OrderProps {
  id: string
  userId: string
  status: OrderStatus
  price: number
  version: number
}

interface OrderDoc extends mongoose.Document {
  userId: string
  status: OrderStatus
  price: number
  version: number
}

interface OrderModel extends mongoose.Model<OrderDoc> {
  build(props: OrderProps): OrderDoc
  findByEvent(event: { id: string, version: number }): Promise<OrderDoc | null>
}

const orderSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: Object.values(OrderStatus),
    default: OrderStatus.Created
  },
  price: {
    type: Number,
    required: true,
  },
}, {
  toJSON: {
    transform(doc, ret) {
      ret.id = ret._id;
      delete ret._id;
    }
  }
});

orderSchema.set('versionKey', 'version');

orderSchema.plugin(updateIfCurrentPlugin);

orderSchema.statics.build = (props: OrderProps) => {
  return new Order({
    _id: props.id,
    version: props.version,
    userId: props.userId,
    status: props.status,
    price: props.price,
  });
}

orderSchema.statics.findByEvent = (event: { id: string, version: number }) => {
  return Order.findOne({ _id: event.id, version: event.version - 1 });
}

const Order = mongoose.model<OrderDoc, OrderModel>('Order', orderSchema);

export { Order };