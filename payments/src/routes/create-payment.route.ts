import { requireAuth, validateRequest, NotFoundError, UnauthorizedError, BadRequestError } from '@ticketing-microsservices/common';
import express, { Request, Response } from 'express';
import { body } from 'express-validator';
import mongoose from 'mongoose';

import { Order, OrderStatus, Payment } from '../models';
import { stripe } from '../stripe';
import { PaymentCreatedPublisher } from '../events';
import { natsWrapper } from '../nats.wrapper';

const router = express.Router();

const isValidId = (input: string) => mongoose.Types.ObjectId.isValid(input);

router.post('/api/payments', requireAuth, [
  body('token').not().isEmpty().withMessage('Token is required'),
  body('orderId').not().isEmpty().custom(isValidId).withMessage('Token is required'),
], validateRequest, async (req: Request, res: Response) => {
  const { token, orderId } = req.body;

  const order = await Order.findById(orderId);

  if (!order) throw new NotFoundError();
  if (order.userId !== req.currentUser!.id) throw new UnauthorizedError();
  if (order.status === OrderStatus.Cancelled)
    throw new BadRequestError('Cannot pay for an cancelled order');

  const charge = await stripe.charges.create({
    currency: 'usd',
    amount: order.price * 100,
    source: token,
  });

  const payment = Payment.build({ orderId: order.id, stripeId: charge.id });
  await payment.save();

  await new PaymentCreatedPublisher(natsWrapper.client).publish({
    id: payment.id,
    orderId: payment.orderId,
    stripeId: payment.stripeId,
  });

  res.status(201).send({ id: payment.id });
});

export { router as createPaymentRouter };

