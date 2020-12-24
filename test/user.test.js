const request = require('supertest');
const expect = require('chai').expect;
const app = require('../app');
const User = require('../model/userModel');

const userAdminData = {
  email: 'itsmeacs01@gmail.com',
  userName: 'Aashish Pokhrel',
  password: 'testtesttest',
  confirmPassword: 'testtesttest',
  role: 'admin',
  image: '../public/img/1500x500.jpeg-1608790415025.jpeg',
};

const userEmployerData = {
  email: 'itsmeacs02@gmail.com',
  userName: 'Aashish Pokhrel',
  password: 'testtesttest',
  confirmPassword: 'testtesttest',
  role: 'employer',
  image: '../public/img/1500x500.jpeg-1608790415025.jpeg',
};

const userLoginData = {
  email: 'itsmeacs01@gmail.com',
  password: 'testtesttest',
};

describe('Signup as Admin', () => {
  beforeEach(async () => {
    await User.deleteMany({});
  });

  it('Should Signup Successfully as Admin', () => {
    return request(app)
      .post('/api/users/register')
      .send(userAdminData)
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
      .set({ authorization: `${this.token}` })
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

describe('Signup as Employer', () => {
  it('Should Signup Successfully as Employer', () => {
    return request(app)
      .post('/api/users/register')
      .send(userEmployerData)
      .expect(200)
      .then((res) => {
        const body = res.body;
        expect(body.message).equal('success');
      });
  });
});

describe('Get Employer', () => {
  it('Should get Employer Successfully', () => {
    return request(app)
      .get('/api/users/employers')
      .expect(200)
      .then((res) => {
        const body = res.body;
        expect(body.isemployersExists).equal(true);
      });
  });
});
