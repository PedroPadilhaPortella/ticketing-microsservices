import request from 'supertest';
import mongoose from 'mongoose';

import { natsWrapper } from '../../nats.wrapper';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

describe('UpdateTicket Route', () => {

  it('should returns 404 on notFound ticket', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .set('Cookie', global.signIn())
      .send({ title: 'title', price: 10 })
      .expect(404);
  });

  it('should returns 401 when the user is not authenticated', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .put(`/api/tickets/${id}`)
      .send({ title: 'title', price: 10 })
      .expect(401);
  });

  it('should returns 401 when the user is not the ticket owner', async () => {
    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', global.signIn())
      .send({ title: 'title1', price: 10 });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', global.signIn())
      .send({ title: 'title2', price: 20 })
      .expect(401);
  });

  it('should returns 400 when the ticket is reserved', async () => {
    const cookie = global.signIn();

    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({ title: 'title1', price: 10 });

    const ticket = await Ticket.findById(response.body.id);
    ticket!.set({ orderId: new mongoose.Types.ObjectId().toHexString() });
    await ticket!.save();

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'title2', price: 20 })
      .expect(400);
  });

  it('should returns 400 when the user update the ticket with invalid title or price', async () => {
    const cookie = global.signIn();

    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({ title: 'title1', price: 10 });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ price: 10 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ title: '', price: 10 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'title', price: -1 })
      .expect(400);

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'title' })
      .expect(400);
  });

  it('should returns 200 and update the ticket on success', async () => {
    const cookie = global.signIn();

    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({ title: 'title1', price: 10 });


    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'title2', price: 20 })
      .expect(200);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toEqual('title2');
    expect(ticketResponse.body.price).toEqual(20);
  });

  it('should publish a ticket on success', async () => {
    const cookie = global.signIn();

    const response = await request(app)
      .post(`/api/tickets`)
      .set('Cookie', cookie)
      .send({ title: 'title1', price: 10 });

    await request(app)
      .put(`/api/tickets/${response.body.id}`)
      .set('Cookie', cookie)
      .send({ title: 'title2', price: 20 })
      .expect(200);

    expect(natsWrapper.client.publish).toHaveBeenCalled();
  });
});