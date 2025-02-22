import request from 'supertest';
import { app } from '../../app';

describe('CurrentUser Route', () => {

  it('should not return the currentUser when there is no cookies', async () => {
    const response = await request(app)
      .get('/api/users/currentUser')
      .send()
      .expect(200);

    expect(response.body.currentUser).toBeNull();
  });

  it('should returns the currentUser', async () => {
    const email = 'test@test.com';

    const authResponse = await request(app)
      .post('/api/users/signup')
      .send({ email: email, password: 'test123' })
      .expect(201);

    const response = await request(app)
      .get('/api/users/currentUser')
      .set('Cookie', authResponse.get('Set-Cookie')!)
      .send()
      .expect(200);

    expect(response.body.currentUser.email).toEqual(email);
  });
});