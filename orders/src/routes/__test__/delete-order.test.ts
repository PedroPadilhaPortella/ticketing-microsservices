import request from 'supertest';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats.wrapper';
import { app } from '../../app';
import { Ticket, Order, OrderStatus } from '../../models';

describe('DeleteOrder Route', () => {
  it('should returns 404 on notFound order', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .delete(`/api/orders/${id}`)
      .set('Cookie', global.signIn())
      .send()
      .expect(404);
  });

  it('should returns 401 when the currentUser is different from the orderUser', async () => {
    const ticket = Ticket.build({ title: 'ticket 1', price: 10 });
    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', global.signIn())
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', global.signIn())
      .send()
      .expect(401);
  });

  xit('should returns a order when found', async () => {
    const currentUser = global.signIn();
    const ticket = Ticket.build({ title: 'ticket 1', price: 10 });
    await ticket.save();

    const { body: order } = await request(app)
      .post('/api/orders')
      .set('Cookie', currentUser)
      .send({ ticketId: ticket.id })
      .expect(201);

    await request(app)
      .delete(`/api/orders/${order.id}`)
      .set('Cookie', currentUser)
      .send()
      .expect(204);

    const cancelledOrder = await Order.findById(order.id);
    expect(cancelledOrder!.status).toEqual(OrderStatus.Cancelled);
  });

  //TODO: publish event
  it.todo('should publish a reserve of a ticket on success');
});