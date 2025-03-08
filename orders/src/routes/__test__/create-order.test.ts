import request from 'supertest';
import mongoose from 'mongoose';

import { Ticket, Order, OrderStatus } from '../../models';
import { natsWrapper } from '../../nats.wrapper';
import { app } from '../../app';

describe('CreateOrder Route', () => {

  it('should returns 401 on post a order without being signed in', async () => {
    await request(app)
      .post('/api/orders')
      .send({})
      .expect(401);
  });

  it('should returns a status different from 401 on post a order while signed in', async () => {
    const response = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('should returns 400 on post with invalid ticketId', async () => {
    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId: '' })
      .expect(400);

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId: 'fake-ticket-id' })
      .expect(400);
  });

  it('should returns 404 when posts an order with a NotFound ticket', async () => {
    const ticketId = new mongoose.Types.ObjectId().toString();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId })
      .expect(404);
  });

  it('should returns 400 when posts an order with a already reserved ticket', async () => {
    const ticket = Ticket.build({ title: 'title', price: 10 });
    await ticket.save();

    const order = Order.build({
      ticket,
      userId: 'userId',
      status: OrderStatus.Created,
      expiresAt: new Date()
    });
    await order.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId: ticket.id })
      .expect(400);
  });

  it('should returns 201 on reserve a ticket with success', async () => {
    const ticket = Ticket.build({ title: 'concert', price: 10 });
    await ticket.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId: ticket.id })
      .expect(201);
  });

  it('should publish an order on success', async () => {
    const ticket = Ticket.build({ title: 'concert', price: 10 });
    await ticket.save();

    await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId: ticket.id })
      .expect(201);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});