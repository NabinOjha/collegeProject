const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const User = require('../model/userModel');

const userRegisterData = {
  email: 'itsmeacs01@gmail.com',
  userName: 'Aashish Pokhrel',
  password: 'testtesttest',
  confirmPassword: 'testtesttest',
  role: 'admin',
  image: '../public/img/1500x500.jpeg-1608790415025.jpeg',
};

const userLoginData = {
  email: 'itsmeacs01@gmail.com',
  password: 'testtesttest',
};

describe('Signup', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('Should Signup Successfully', () => {
    return request(app)
      .post('/api/users/register')
      .send(userRegisterData)
      .expect(200)
      .then((res) => {
        const body = res.body;
        expect(body.message).equal('success');
      });
  });
});

describe('Login', () => {
  it('Should login Successfully', () => {
    return request(app)
      .post('/api/users/login')
      .send(userLoginData)
      .expect(200)
      .then((res) => {
        const body = res.body;
        exports.token = `Bearer ${body.token}`;
        expect(body.isLoggedIn).equal(true);
      });
  });

  it('Should get the current user Successfully', () => {
    return request(app)
      .get('/api/users/loggedIn')
      .set({authorization: `${this.token}`})
      .expect(200)
      .then((res) => {
        const body = res.body;
        expect(body.loggedIn).equal(true);
      });
  });
});

describe('Get Admin', () => {
  it('Should get admin Successfully', () => {
    return request(app)
      .get('/api/users/admin')
      .expect(200)
      .then((res) => {
        const body = res.body;
        expect(body.isAdminExists).equal(true);
      });
  });
});

describe('Logout', () => {
  it('Should Logout Successfully', () => {
    return request(app)
      .get('/api/users/logout')
      .expect(200)
      .then((res) => {
        const body = res.body;
        expect(body.islogOut).equal(true);
      });
  });
});
