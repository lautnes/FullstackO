const { test, describe, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);

describe('Login', () => {
  test('user can login and receive a valid token', async () => {
    const loginDetails = { username: 'testuser', password: 'testpass' };
    
    const response = await api
      .post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/);
    
    assert.ok(response.body.token, 'Expected a valid token in response');
  });
});

after(async () => {
  await mongoose.connection.close();
});
