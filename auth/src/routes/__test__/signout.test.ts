import request from 'supertest';
import { app } from '../../app';

describe('SignOut Route', () => {

  it('should returns 200 on signOut success', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'test123' })
      .expect(201);

    const response = await request(app)
      .post('/api/users/signout')
      .send()
      .expect(200);

    expect(response.get('Set-Cookie')![0]).toEqual('session=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT; httponly');
  });
});