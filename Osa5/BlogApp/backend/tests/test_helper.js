const Blog = require('../models/blog');

const initialBlogs = [
  {
    title: "First Blog",
    author: "Author One",
    url: "http://example.com/1",
    likes: 10
  },
  {
    title: "Second Blog",
    author: "Author Two",
    url: "http://example.com/2",
    likes: 20
  }
];

// Function to retrieve blogs from the database
const blogsInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map(blog => blog.toJSON());
};

// Function to generate a valid but non-existing MongoDB ID
const nonExistingId = async () => {
    const blog = new Blog({ title: 'temp', author: 'temp', url: 'tempurl.com' });
    await blog.save();
    const id = blog._id.toString();
    await blog.deleteOne(); // Remove the temporary blog
    return id;
};

module.exports = {
  initialBlogs,
  blogsInDb,
  nonExistingId
};
