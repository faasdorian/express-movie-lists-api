import { AppDataSource } from "../../config/database";
import request from "supertest";
import app from "../../app";

let user = {
  id: undefined,
  username: `testuser${Math.ceil(Math.random() * 1000)}`,
  password: "$tr0ngP4$$w0rd",
}

let token: string;

beforeAll(async () => {
  await AppDataSource.initialize();

  const response = await request(app)
    .post('/auth/signup')
    .send(user)

  const loginReponse = await request(app)
    .post('/auth/login')
    .send(user)

  user.id = response.body.id;
  token = loginReponse.body.token;
});

describe('User routes', () => {

  it('can delete a user', async () => {
    await request(app)
      .delete(`/users/${user.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
  });

});
