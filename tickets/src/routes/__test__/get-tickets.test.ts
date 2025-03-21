import request from 'supertest';

import { app } from '../../app';

const createTicket = (title: string, price: number) => {
  return request(app)
    .post('/api/tickets')
    .set('Cookie', global.signIn())
    .send({ title, price });
}

describe('GetTicket Route', () => {
  it('should fetch all the tickets', async () => {
    await createTicket('ticket 1', 10);
    await createTicket('ticket 2', 20);
    await createTicket('ticket 3', 30);

    const response = await request(app)
      .get('/api/tickets')
      .send()
      .expect(200);

    expect(response.body.length).toEqual(3);
  });
});