import request from 'supertest';

import { Ticket } from '../../models/ticket';
import { app } from '../../app';

describe('CreateTicket Route', () => {

  it('should returns 401 on post a ticket without being signed in', async () => {
    await request(app)
      .post('/api/tickets')
      .send({})
      .expect(401);
  });

  it('should returns a status different from 401 on post a ticket signed in', async () => {
    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({});

    expect(response.status).not.toEqual(401);
  });

  it('should returns 400 on post with invalid title or price', async () => {
    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({ title: '', price: 10 })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({ price: 10 })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({ title: 'title', price: -1 })
      .expect(400);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({ title: 'title' })
      .expect(400);
  });

  it('should returns 201 on post ticket with success', async () => {
    let tickets = await Ticket.find({});
    expect(tickets.length).toEqual(0);

    await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({ title: 'title', price: 10 })
      .expect(201);

    tickets = await Ticket.find({});
    expect(tickets.length).toEqual(1);
    expect(tickets[0].price).toEqual(10);
    expect(tickets[0].title).toEqual('title');
  });
});