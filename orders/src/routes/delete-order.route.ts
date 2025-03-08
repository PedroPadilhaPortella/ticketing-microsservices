import { NotFoundError, requireAuth, UnauthorizedError } from '@ticketing-microsservices/common';
import express, { Request, Response } from 'express';

import { Order, OrderStatus } from '../models';

const router = express.Router();

router.delete('/api/orders/:id', requireAuth, async (req: Request, res: Response) => {
  const order = await Order.findById(req.params.id);

  if (!order) throw new NotFoundError();
  if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();

  order.status = OrderStatus.Cancelled;
  await order.save();

  //TODO: Publish the event

  res.status(204).send(order);
});

export { router as deleteOrderRouter };
