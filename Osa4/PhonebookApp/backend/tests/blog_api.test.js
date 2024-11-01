const { test, beforeEach, after, describe } = require('node:test');
const assert = require('node:assert');
const mongoose = require('mongoose');
const supertest = require('supertest');
const app = require('../app');
const api = supertest(app);
const Blog = require('../models/blog');
const helper = require('./test_helper');

beforeEach(async () => {
  await Blog.deleteMany({});
  const blogObjects = helper.initialBlogs.map(blog => new Blog(blog));
  const promiseArray = blogObjects.map(blog => blog.save());
  await Promise.all(promiseArray);
});

test('blogs are returned as JSON and initial blogs are present', async () => {
  const response = await api
    .get('/api/blogs')
    .expect(200)
    .expect('Content-Type', /application\/json/);

  // Use 'assert' instead of 'expect'
  assert.strictEqual(response.body.length, helper.initialBlogs.length);

  const titles = response.body.map(blog => blog.title);
  assert(titles.includes(helper.initialBlogs[0].title));
});

test('unique identifier field is named id', async () => {
    const response = await api.get('/api/blogs');
  
    response.body.forEach(blog => {
      // Use 'assert' to check that 'id' field exists
      assert.ok(blog.id, 'Expected "id" field to be defined');
    });
});

test('a valid blog can be added', async () => {
    const newBlog = {
      title: 'New Blog',
      author: 'New Author',
      url: 'http://newblog.com',
      likes: 0
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1);
  
    const titles = blogsAtEnd.map(b => b.title);
    assert(titles.includes('New Blog'), 'New Blog should be added');
});
  
test('if likes is missing, it defaults to 0', async () => {
    const newBlog = {
      title: 'Blog without likes',
      author: 'Author',
      url: 'http://nolikes.com'
    };
  
    const response = await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(201)
      .expect('Content-Type', /application\/json/);
  
    assert.strictEqual(response.body.likes, 0, 'Expected likes to default to 0');
});

test('blog without title and url is not added', async () => {
    const newBlog = {
      author: 'Author without URL and Title'
    };
  
    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(400);
  
    const blogsAtEnd = await Blog.find({});
    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length, 'No new blog should be added');
});
  
describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToDelete = blogsAtStart[0];

      await api
        .delete(`/api/blogs/${blogToDelete.id}`)
        .expect(204);

      const blogsAtEnd = await helper.blogsInDb();
      assert.strictEqual(blogsAtEnd.length, blogsAtStart.length - 1);

      const titles = blogsAtEnd.map(b => b.title);
      assert(!titles.includes(blogToDelete.title));
    });

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api
        .delete(`/api/blogs/${validNonexistingId}`)
        .expect(404);
    });
});

describe('updating a blog', () => {
    test('succeeds in updating likes with a valid id', async () => {
      const blogsAtStart = await helper.blogsInDb();
      const blogToUpdate = blogsAtStart[0];
      const newLikes = blogToUpdate.likes + 1;

      const response = await api
        .put(`/api/blogs/${blogToUpdate.id}`)
        .send({ likes: newLikes })
        .expect(200)
        .expect('Content-Type', /application\/json/);

      assert.strictEqual(response.body.likes, newLikes);
    });

    test('fails with status code 404 if blog does not exist', async () => {
      const validNonexistingId = await helper.nonExistingId();

      await api
        .put(`/api/blogs/${validNonexistingId}`)
        .send({ likes: 10 })
        .expect(404);
    });
});

// Use 'after' to close the MongoDB connection
after(async () => {
  await mongoose.connection.close();
});
