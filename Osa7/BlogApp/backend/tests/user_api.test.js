const { test, beforeEach, describe, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const app = require('../app');
const User = require('../models/user');
const api = supertest(app);

beforeEach(async () => {
  await User.deleteMany({});
  const passwordHash = await bcrypt.hash('testpass', 10);
  await new User({ username: 'uniqueUserForTest', passwordHash }).save();
});

describe('User creation and validation', () => {
  test('succeeds with a unique username and valid password', async () => {
    const usersAtStart = await User.find({});
    
    const newUser = {
      username: 'uniqueuser',
      name: 'Unique User',
      password: 'validpassword',
    };

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1, 'User count should increase by one');

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username), 'New user should be added with unique username');
  });

  test('fails with status 400 if username is already taken', async () => {
    const newUser = {
      username: 'uniqueUserForTest',
      name: 'Duplicate User',
      password: 'anotherpassword'
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('username must be unique'), 'Expected unique username error');

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, 1, 'No new user should be added on duplicate username');
  });

  test('fails with status 400 if username is shorter than 3 characters', async () => {
    const newUser = {
      username: 'ab',
      name: 'Short Username',
      password: 'validpassword',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('is shorter than the minimum allowed length'), 'Username too short error expected');

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, 1, 'User count should remain the same on invalid username');
  });

  test('fails with status 400 if password is shorter than 3 characters', async () => {
    const newUser = {
      username: 'validusername',
      name: 'Valid User',
      password: 'ab',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('Password must be at least 3 characters long'), 'Expected error on short password');

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, 1, 'User count should remain the same on invalid password');
  });

  test('fails with status 400 if password is missing', async () => {
    const newUser = {
      username: 'validusername',
      name: 'Valid User',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('Password must be at least 3 characters long'), 'Expected error on missing password');

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, 1, 'User count should remain the same on missing password');
  });

  test('fails with status 400 if username is missing', async () => {
    const newUser = {
      name: 'User Without Username',
      password: 'validpassword',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('`username` is required'), 'Expected error on missing username');

    const usersAtEnd = await User.find({});
    assert.strictEqual(usersAtEnd.length, 1, 'User count should remain the same on missing username');
  });
});

describe('Login API tests', () => {
  test('user can log in with valid credentials and receive a token', async () => {
    const loginDetails = {
      username: 'uniqueUserForTest',
      password: 'testpass'
    };

    const response = await api
      .post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert(response.body.token, 'Token should be present in response');
  });

  test('login fails with 401 status if username is incorrect', async () => {
    const loginDetails = {
      username: 'wrongUsername',
      password: 'testpass'
    };

    const response = await api
      .post('/api/login')
      .send(loginDetails)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    assert(response.body.error.includes('invalid username or password'), 'Expected invalid username/password error');
  });

  test('login fails with 401 status if password is incorrect', async () => {
    const loginDetails = {
      username: 'uniqueUserForTest',
      password: 'wrongpassword'
    };

    const response = await api
      .post('/api/login')
      .send(loginDetails)
      .expect(401)
      .expect('Content-Type', /application\/json/);

    assert(response.body.error.includes('invalid username or password'), 'Expected invalid username/password error');
  });
});

after(async () => {
  await mongoose.connection.close();
});
