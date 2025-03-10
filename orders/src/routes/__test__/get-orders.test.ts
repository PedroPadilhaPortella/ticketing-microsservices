import request from 'supertest';
import mongoose from 'mongoose';

import { Ticket } from '../../models';
import { app } from '../../app';

const createTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: 'ticket 1',
    price: 10
  });
  await ticket.save();
  return ticket;
}

describe('GetOrders Route', () => {
  it('should fetch all the orders from the current user', async () => {
    const ticket1 = await createTicket('ticket 1', 10);
    const ticket2 = await createTicket('ticket 2', 20);
    const ticket3 = await createTicket('ticket 3', 30);

    const userOne = global.signIn();
    const userTwo = global.signIn();

    await request(app)
      .post('/api/orders')
      .set('Cookie', userOne)
      .send({ ticketId: ticket1.id })
      .expect(201);

    const { body: order1 } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticket2.id })
      .expect(201);

    const { body: order2 } = await request(app)
      .post('/api/orders')
      .set('Cookie', userTwo)
      .send({ ticketId: ticket3.id })
      .expect(201);

    const response = await request(app)
      .get('/api/orders')
      .set('Cookie', userTwo)
      .send()
      .expect(200);

    expect(response.body.length).toEqual(2);
    expect(response.body).toEqual([order1, order2]);
  });
});