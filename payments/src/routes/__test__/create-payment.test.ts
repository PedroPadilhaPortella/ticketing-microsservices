import request from 'supertest';
import mongoose from 'mongoose';

import { Payment, Order, OrderStatus } from '../../models';
import { natsWrapper } from '../../nats.wrapper';
import { stripe } from '../../stripe';
import { app } from '../../app';

jest.mock('../../stripe');

describe('CreatePayment Route', () => {

  it('should returns 401 on post a payment without being signed in', async () => {
    await request(app)
      .post('/api/payments')
      .send({})
      .expect(401);
  });

  it('should returns 400 on post with invalid token or orderId', async () => {
    const orderId = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signIn())
      .send({ token: '', orderId })
      .expect(400);

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signIn())
      .send({ orderId })
      .expect(400);

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signIn())
      .send({ token: 'token', orderId: 'orderId' })
      .expect(400);

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signIn())
      .send({ token: 'token' })
      .expect(400);
  });

  it('should returns 404 when purchasing an order that does not exist', async () => {
    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signIn())
      .send({ token: 'token', orderId: new mongoose.Types.ObjectId().toHexString() })
      .expect(404);
  });

  it('should returns 401 when purchasing an order that does not belong to the user', async () => {
    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      userId: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      price: 10,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signIn())
      .send({ token: 'token', orderId: order.id })
      .expect(401);
  });

  it('should returns 400 when purchasing a cancelled order', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Cancelled,
      version: 0,
      price: 10,
      userId,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signIn(userId))
      .send({ token: 'token', orderId: order.id })
      .expect(400);
  });

  it('should returns 201 on process a payment with success', async () => {
    const userId = new mongoose.Types.ObjectId().toHexString();
    const price = Math.floor(Math.random() * 1000);

    const order = Order.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      status: OrderStatus.Created,
      version: 0,
      price,
      userId,
    });
    await order.save();

    await request(app)
      .post('/api/payments')
      .set('Cookie', global.signIn(userId))
      .send({ token: 'tok_visa', orderId: order.id })
      .expect(201);

    const chargeOptions = (stripe.charges.create as jest.Mock).mock.calls[0][0];

    expect(chargeOptions.source).toEqual('tok_visa');
    expect(chargeOptions.amount).toEqual(price * 100);
    expect(chargeOptions.currency).toEqual('usd');

    const payment = await Payment.findOne({ orderId: order.id });
    expect(payment).not.toBeNull();

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});