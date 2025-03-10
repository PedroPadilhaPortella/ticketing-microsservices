import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';
import { Ticket } from '../../models';

describe('GetOrder Route', () => {

  it('should returns 404 on notFound order', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .get(`/api/orders/${id}`)
      .set('Cookie', global.signIn())
      .send()
      .expect(404);
  });

  it('should returns 401 when the currentUser is different from the orderUser', async () => {
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'ticket 1',
      price: 10
    });
    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', global.signIn())
      .send()
      .expect(401);
  });

  it('should returns a order when found', async () => {
    const currentUser = global.signIn();
    const ticket = Ticket.build({
      id: new mongoose.Types.ObjectId().toHexString(),
      title: 'ticket 1',
      price: 10
    });
    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', currentUser)
      .send({ ticketId: ticket.id })
      .expect(201);

    const response = await request(app)
      .get(`/api/orders/${order.id}`)
      .set('Cookie', currentUser)
      .send()
      .expect(200);

    expect(response.body).toEqual(order);
  });
});