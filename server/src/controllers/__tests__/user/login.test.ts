import request from 'supertest';
import app from '../../../app';
import connection from '../../../__testutils__/utils/connection';
import { AppUser } from '../../../entity/AppUser';
import { hash } from 'bcryptjs';

describe('Test user log in', () => {
  beforeAll(async () => {
    await connection.create();

    // insert user
    let user = new AppUser();
    user.email = 'mike@hunt.com';
    user.firstName = 'Mike';
    user.lastName = 'Hunt';
    user.password = await hash('12345678', 11);
    await AppUser.insert(user);
  });

  afterAll(async () => {
    await connection.clear();
    await connection.close();
  });

  it('POST /user/login ---> log in success', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({
        email: 'mike@hunt.com',
        password: '12345678',
      })
      .expect(200);
    expect(res.body && res.body).toHaveProperty('user');
  });

  it('POST /user/login ---> empty email', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({
        email: '',
        password: '12345678',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Fields cannot be empty');
  });

  it('POST /user/login ---> empty password', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({
        email: 'mike@hunt.com',
        password: '',
      })
      .expect(422);
    expect(res.body && res.body).toStrictEqual('Fields cannot be empty');
  });

  it('POST /user/login ---> incorrect email', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({
        email: 'micheal@hunter.com',
        password: '12345678',
      })
      .expect(401);
    expect(res.body && res.body).toStrictEqual('Invalid email or password');
  });

  it('POST /user/login ---> incorrect password', async () => {
    const res = await request(app)
      .post('/user/login')
      .send({
        email: 'mike@hunt.com',
        password: 'wrongpassword',
      })
      .expect(401);
    expect(res.body && res.body).toStrictEqual('Invalid email or password');
  });
});
