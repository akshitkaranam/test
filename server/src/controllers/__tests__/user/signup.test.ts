import request from 'supertest';
import app from '../../../app';
import connection from '../../../__testutils__/utils/connection';

describe('Test user sign up', () => {
  beforeAll(async () => {
    await connection.create();
  });

  afterAll(async () => {
    await connection.close();
  });

  beforeEach(async () => {
    await connection.clear();
  });

  it('POST /user/signup ---> signed up success', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName: 'Ben',
        lastName: 'Dover',
        password: '12345678',
        password2: '12345678',
      })
      .expect(201);
    expect(res.body && res.body).toStrictEqual(true);
  });

  it('POST /user/signup  ---> empty email', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: '',
        firstName: 'Ben',
        lastName: 'Dover',
        password: '12345678',
        password2: '12345678',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Fields cannot be empty');
  });

  it('POST /user/signup ---> duplicate email', async () => {
    await request(app).post('/user/signup').send({
      email: 'ben@dover.com',
      firstName: 'Ben',
      lastName: 'Dover',
      password: '12345678',
      password2: '12345678',
    });

    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName: 'Ben',
        lastName: 'Dover',
        password: '12345678',
        password2: '12345678',
      })
      .expect(409);
    expect(res.body && res.body).toStrictEqual('Email already exist');
  });

  it('POST /user/signup  ---> invalid email', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben',
        firstName: 'Ben',
        lastName: 'Dover',
        password: '12345678',
        password2: '12345678',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Invalid email');
  });

  it('POST /user/signup  ---> empty first name', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName: '',
        lastName: 'Dover',
        password: '12345678',
        password2: '12345678',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Fields cannot be empty');
  });

  it('POST /user/signup  ---> first name too long', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName:
          'BenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBenBen',
        lastName: 'Dover',
        password: '12345678',
        password2: '12345678',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('First Name has to be between 1 and 30 characters');
  });

  it('POST /user/signup  ---> empty last name', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName: 'Ben',
        lastName: '',
        password: '12345678',
        password2: '12345678',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Fields cannot be empty');
  });

  it('POST /user/signup  ---> last name too long', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName: 'Ben',
        lastName:
          'DoverDoverDoverDoverDoverDoverDoverDoverDoverDoverDoverDoverDoverDoverDoverDoverDoverDover',
        password: '12345678',
        password2: '12345678',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Last Name has to be between 1 and 30 characters');
  });

  it('POST /user/signup  ---> empty password', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName: 'Ben',
        lastName: 'Dover',
        password: '',
        password2: '12345678',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Fields cannot be empty');
  });

  it('POST /user/signup  ---> empty password2', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName: 'Ben',
        lastName: 'Dover',
        password: '12345678',
        password2: '',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Fields cannot be empty');
  });

  it('POST /user/signup  ---> passwords do not match', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName: 'Ben',
        lastName: 'Dover',
        password: '12345678',
        password2: '123456789',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Passwords do not match');
  });

  it('POST /user/signup  ---> passwords are less than 8 characters', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName: 'Ben',
        lastName: 'Dover',
        password: '1234567',
        password2: '1234567',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Password has to be between 8 and 50 characters');
  });

  it('POST /user/signup  ---> passwords are more than 50 characters', async () => {
    const res = await request(app)
      .post('/user/signup')
      .send({
        email: 'ben@dover.com',
        firstName: 'Ben',
        lastName: 'Dover',
        password: '1234567890123456789012345678901234567890123456789012345678901',
        password2: '1234567890123456789012345678901234567890123456789012345678901',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Password has to be between 8 and 50 characters');
  });
});
