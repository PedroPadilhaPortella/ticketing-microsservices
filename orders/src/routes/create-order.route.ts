import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ticketing-microsservices/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import { OrderCreatedPublisher } from '../events';
import { natsWrapper } from '../nats.wrapper';
import { Order, Ticket } from '../models';

const EXPIRATION_WINDOW_SECONDS = 1 * 60;

const router = express.Router();

const isValidId = (input: string) => mongoose.Types.ObjectId.isValid(input);

router.post('/api/orders', requireAuth, [
  body('ticketId').not().isEmpty().custom(isValidId).withMessage('Ticket Id is required'),
], validateRequest, async (req: Request, res: Response) => {
  const { ticketId } = req.body;

  const ticket = await Ticket.findById(ticketId);
  if (!ticket) throw new NotFoundError();

  const ticketIsReserved = await ticket.isReserved();
  if (ticketIsReserved) throw new BadRequestError('Ticket already reserved');

  const expiration = new Date();
  expiration.setSeconds(expiration.getSeconds() + EXPIRATION_WINDOW_SECONDS);

  const order = Order.build({
    userId: req.currentUser!.id,
    status: OrderStatus.Created,
    expiresAt: expiration,
    ticket
  });
  await order.save();

  await new OrderCreatedPublisher(natsWrapper.client).publish({
    id: order.id,
    userId: order.userId,
    status: order.status,
    expiresAt: order.expiresAt.toISOString(),
    version: order.version,
    ticket: { id: ticket.id, price: ticket.price }
  });

  res.status(201).send(order);
});

export { router as createOrderRouter };

