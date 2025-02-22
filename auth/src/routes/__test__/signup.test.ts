import request from 'supertest';
import { app } from '../../app';

describe('SignUp Route', () => {

  it('should returns 400 on signUp with invalid email or password', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'invalidEmail', password: 'test123' })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'psw' })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: '' })
      .expect(400);

    await request(app)
      .post('/api/users/signup')
      .send({ email: '', password: 'test123' })
      .expect(400);
  });

  it('should returns 400 on signUp with already taken email', async () => {
    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'test123' })
      .expect(201);

    await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'test123' })
      .expect(400);
  });

  it('should returns 201 and set cookie on signUp success', async () => {
    const response = await request(app)
      .post('/api/users/signup')
      .send({ email: 'test@test.com', password: 'test123' })
      .expect(201);

    expect(response.get('Set-Cookie')).toBeDefined();
  });
});