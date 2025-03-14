import { BadRequestError, NotFoundError, UnauthorizedError, requireAuth, validateRequest } from '@ticketing-microsservices/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';

import { TicketUpdatedPublisher } from '../events';
import { natsWrapper } from '../nats.wrapper';
import { Ticket } from '../models/ticket';

const router = express.Router();

router.put('/api/tickets/:id', requireAuth, [
  body('title').not().isEmpty().withMessage('Title is required'),
  body('price').isFloat({ gt: 0 }).withMessage('Price must be greater than zero')
], validateRequest, async (req: Request, res: Response) => {
  const { title, price } = req.body;
  const { id } = req.params;

  const ticket = await Ticket.findById(id);
  if (!ticket) throw new NotFoundError();

  if (ticket.userId !== req.currentUser!.id) throw new UnauthorizedError();

  if (ticket.orderId) throw new BadRequestError('Cannot edit a reserved ticket');

  ticket.set({ title, price });
  await ticket.save();

  await new TicketUpdatedPublisher(natsWrapper.client).publish({
    id: ticket.id,
    title: ticket.title,
    price: ticket.price,
    userId: ticket.userId,
    version: ticket.version
  });

  res.send(ticket);
});

export { router as updateTicketRouter };