const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const User = require('../model/userModel');

const userData = {
  email: 'itsmeacs01@gmail.com',
  userName: 'Aashish Pokhrel',
  password: 'testtesttest',
  confirmPassword: 'testtesttest',
  role: 'employer',
  image: '../public/img/1500x500.jpeg-1608790415025.jpeg',
};

describe('Signup', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('Should Signup Successfully', () => {
    return request(app)
      .post('/api/users/register')
      .send(userData)
      .expect(200)
      .then((res) => {
          const body = res.body;
        expect(body.message).equal('success');
      });
  });
});
