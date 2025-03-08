import { BadRequestError, NotFoundError, OrderStatus, requireAuth, validateRequest } from '@ticketing-microsservices/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import { Order, Ticket } from '../models';

const EXPIRATION_WINDOW_SECONDS = 15 * 60;

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

  //TODO: Publish the event

  // const publisher = new TicketCreatedPublisher(natsWrapper.client)
  // await publisher.publish({
  //   id: ticket.id,
  //   title: ticket.title,
  //   price: ticket.price,
  //   userId: ticket.userId
  // });

  res.status(201).send(order);
});

export { router as createOrderRouter };

