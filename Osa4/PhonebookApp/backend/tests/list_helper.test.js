const { test, describe } = require('node:test')
const assert = require('node:assert')
const listHelper = require('../utils/list_helper')

// Dummy test
describe('dummy', () => {
  test('dummy returns one', () => {
    const blogs = []
    const result = listHelper.dummy(blogs)
    assert.strictEqual(result, 1)
  })
})

// Total likes test
describe('total likes', () => {
  const listWithOneBlog = [
    {
      _id: '5a422aa71b54a676234d17f8',
      title: 'Go To Statement Considered Harmful',
      author: 'Edsger W. Dijkstra',
      url: 'http://www.u.arizona.edu/~rubinson/copyright_violations/Go_To_Considered_Harmful.html',
      likes: 5,
      __v: 0
    }
  ]

  test('when list has only one blog, equals the likes of that blog', () => {
    const result = listHelper.totalLikes(listWithOneBlog)
    assert.strictEqual(result, 5)
  })
})

// Favorite blog test
describe('favorite blog', () => {
  const blogs = [
    {
      title: "Canonical string reduction",
      author: "Edsger W. Dijkstra",
      likes: 12
    },
    {
      title: "Another blog",
      author: "Another author",
      likes: 10
    }
  ]

  test('returns the blog with most likes', () => {
    const result = listHelper.favoriteBlog(blogs)
    assert.deepStrictEqual(result, blogs[0])
  })
})

// Most blogs test
describe('most blogs', () => {
  const blogs = [
    {
      _id: '1',
      title: 'Test Blog 1',
      author: 'Robert C. Martin',
      url: 'http://example.com/1',
      likes: 10,
    },
    {
      _id: '2',
      title: 'Test Blog 2',
      author: 'Edsger W. Dijkstra',
      url: 'http://example.com/2',
      likes: 5,
    },
    {
      _id: '3',
      title: 'Test Blog 3',
      author: 'Robert C. Martin',
      url: 'http://example.com/3',
      likes: 2,
    },
    {
      _id: '4',
      title: 'Test Blog 4',
      author: 'Robert C. Martin',
      url: 'http://example.com/4',
      likes: 7,
    },
  ]

  test('returns the author with most blogs', () => {
    const result = listHelper.mostBlogs(blogs)
    const expected = { author: 'Robert C. Martin', blogs: 3 }
    assert.deepStrictEqual(result, expected)
  })
})

// Most likes test
describe('most likes', () => {
  const blogs = [
    { author: "Edsger W. Dijkstra", likes: 17 },
    { author: "Another Author", likes: 10 },
  ]

  test('returns the author with most likes', () => {
    const result = listHelper.mostLikes(blogs)
    assert.deepStrictEqual(result, { author: "Edsger W. Dijkstra", likes: 17 })
  })
})
