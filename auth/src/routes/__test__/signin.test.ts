import request from 'supertest';
import { app } from '../../app';

describe('SignIn Route', () => {
  it('should returns 400 on signIn with invalid email or password', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({ email: 'invalidEmail', password: 'test123' })
      .expect(400);

    await request(app)
      .post('/api/users/signin')
      .send({ email: 'test@test.com', password: '' })
      .expect(400);

    await request(app)
      .post('/api/users/signin')
      .send({ email: '', password: 'test123' })
      .expect(400);
  });

  it('should returns 400 on signIn with not registered email', async () => {
    await request(app)
      .post('/api/users/signin')
      .send({ email: 'test@test.com', password: 'test123' })
      .expect(400);
  });

  it('should returns 400 on SignIn with wrong password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'test123' })
      .expect(201);

    await request(app)
      .post('/api/users/signin')
      .send({ email: 'test@test.com', password: 'test1234' })
      .expect(400);
  });

  it('should returns 200 and set cookie on SignIn success', async () => {
    const body = { email: 'test@test.com', password: 'test123' };
    await request(app)
      .post('/api/users/signup')
      .send(body)
      .expect(201);

    const response = await request(app)
      .post('/api/users/signin')
      .send(body)
      .expect(200);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});