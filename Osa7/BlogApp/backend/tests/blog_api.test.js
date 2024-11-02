const { test, beforeEach, describe, after } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const User = require('../models/user');
const helper = require('./test_helper');

let authToken;

beforeEach(async () => {
  await Blog.deleteMany({});
  await User.deleteMany({});

  const passwordHash = await bcrypt.hash('testpass', 10);
  const testUser = new User({ username: 'testuser', passwordHash });
  await testUser.save();

  const userForToken = { username: testUser.username, id: testUser._id };
  authToken = jwt.sign(userForToken, process.env.SECRET, { expiresIn: '1h' });

  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

describe('Blog API tests', () => {
  test('blogs are returned as JSON and initial blogs are present', async () => {
    const response = await api
      .get('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.length, helper.initialBlogs.length);
  });

  test('unique identifier field is named id', async () => {
    const response = await api.get('/api/blogs').set('Authorization', `Bearer ${authToken}`);
    response.body.forEach(blog => {
      assert.ok(blog.id, 'Expected "id" field to be defined');
    });
  });

  test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://newblog.com',
      likes: 0,
    };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
    const titles = blogsAtEnd.map(b => b.title);
    assert(titles.includes('New Blog'));
  });

  test('likes default to 0 if missing', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author',
      url: 'http://nolikes.com',
    };

    const response = await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);

    assert.strictEqual(response.body.likes, 0);
  });

  test('blog without title and url is not added', async () => {
    const newBlog = { author: 'Author without URL and Title' };

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${authToken}`)
      .send(newBlog)
      .expect(400);

    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length);
  });

  describe('Updating a blog', () => {
    test('succeeds in updating likes with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const newLikes = blogToUpdate.likes + 1;

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ likes: newLikes })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, newLikes);
    });

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .send({ likes: 10 })
        .expect(404);
    });
  });

  describe('Authorization checks', () => {
    test('fails with 401 Unauthorized if token is not provided', async () => {
      const newBlog = {
        title: 'Test Blog without Token',
        author: 'Author',
        url: 'http://example.com',
        likes: 5,
      };

      await api.post('/api/blogs').send(newBlog).expect(401);
    });
  });
});

describe('User API tests', () => {
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
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1);

    const usernames = usersAtEnd.map(u => u.username);
    assert(usernames.includes(newUser.username));
  });

  test('fails with status 400 if username is already taken', async () => {
    const newUser = {
      username: 'testuser',
      name: 'Duplicate User',
      password: 'anotherpassword',
    };

    const result = await api
      .post('/api/users')
      .send(newUser)
      .expect(400)
      .expect('Content-Type', /application\/json/);

    assert(result.body.error.includes('username must be unique'));
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

    assert(result.body.error.includes('is shorter than the minimum allowed length'));
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

    assert(result.body.error.includes('Password must be at least 3 characters long'));
  });
});

describe('Login tests', () => {
  test('user can login and receive a valid token', async () => {
    const loginDetails = { username: 'testuser', password: 'testpass' };

    const response = await api
      .post('/api/login')
      .send(loginDetails)
      .expect(200)
      .expect('Content-Type', /application\/json/);

    assert(response.body.token, 'Token should be present in response');
  });
});

after(async () => {
  await mongoose.connection.close();
});
