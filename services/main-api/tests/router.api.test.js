const {describe, it} = require('mocha');
const assert = require('assert');
const request = require('supertest');
require('./mocks');
const server = require('../bin/www');

const app = request(server);


const todo = () => {
  assert(false, "method not yet implemented");
};

describe('test service /api endpoints', () => {

  describe('test /api/screenshot', () => {

    it('gel list of screenshots', (done) => {
      app
        .get('/api/screenshot/')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, [], done)
        ;
    });

    it('get screenshot by id', (done) => {
      app
        .get('/api/screenshot/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(404, done)
        ;
    });

    it('delete screenshot by id', (done) => {
      app
        .delete('/api/screenshot/1')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        ;
    });

    it('create screenshot', (done) => {
      app
        .post('/api/screenshot')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
        ;
    });

  });

  // user -------------

  describe('test /api/user', () => {

    // it('gel list of users', (done) => {
    //   app
    //     .get('/api/user/')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(200, [], done)
    //   ;
    // });

    it('get user by id', (done) => {
      app
        .get('/api/user/dd0b798f-dab1-4c00-b266-3e3f19ac1707')
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(200, done)
      ;
    });

    // it('delete screenshot by id', (done) => {
    //   app
    //     .delete('/api/screenshot/1')
    //     .set('Accept', 'application/json')
    //     .expect('Content-Type', /json/)
    //     .expect(200, done)
    //   ;
    // });

    it('create user', async (done) => {
      app
        .post('/api/user/')
        .send({
          "username": "first",
          "email": "test@gmail.com",
          "password": "123456"
        })
        .expect(200)
        .end(function(err, res) {

          // expect(res.body.token).to.be.not.undefined;
          // expect(res.body.user).to.be.not.undefined;
          // expect(res.body.user.username).to.be.eql('username@wonderflow.co');

          done();
        })
      ;
    });

  });

});