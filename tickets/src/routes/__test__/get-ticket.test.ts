import request from 'supertest';
import mongoose from 'mongoose';

import { app } from '../../app';

describe('GetTicket Route', () => {

  it('should returns 404 on notFound ticket', async () => {
    const id = new mongoose.Types.ObjectId().toHexString();

    await request(app)
      .get(`/api/tickets/${id}`)
      .send()
      .expect(404);
  });

  it('should returns a ticket when found', async () => {
    const title = 'title';
    const price = 10;

    const response = await request(app)
      .post('/api/tickets')
      .set('Cookie', global.signIn())
      .send({ title, price })
      .expect(201);

    const ticketResponse = await request(app)
      .get(`/api/tickets/${response.body.id}`)
      .send()
      .expect(200);

    expect(ticketResponse.body.title).toEqual(title);
    expect(ticketResponse.body.price).toEqual(price);
  });
});