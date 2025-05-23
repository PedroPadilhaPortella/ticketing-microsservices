import { NotFoundError, requireAuth, UnauthorizedError } from '@ticketing-microsservices/common';
import express, { Request, Response } from 'express';

import { OrderCancelledPublisher } from '../events';
import { Order, OrderStatus } from '../models';
import { natsWrapper } from '../nats.wrapper';

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id).populate('ticket');

  if (!order) throw new NotFoundError();
  if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();

  order.status = OrderStatus.Cancelled;
  await order.save();

  await new OrderCancelledPublisher(natsWrapper.client).publish({
    id: order.id,
    version: order.version,
    ticket: { id: order.ticket.id }
  });

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
