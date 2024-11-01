const express = require('express');
const Blog = require('../models/blog');
const { userExtractor } = require('../utils/middleware'); 

const blogsRouter = express.Router();

// GET all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

// POST a new blog with user authentication
blogsRouter.post('/', async (req, res) => {
  if (!req.user) {
    return res.status(401).json({ error: 'token missing or invalid' });
  }

  const blog = new Blog({
    ...req.body,
    user: req.user._id,
  });

  try {
    const savedBlog = await blog.save();
    req.user.blogs = req.user.blogs.concat(savedBlog._id); // Add blog to user's blog list
    await req.user.save();
    
    res.status(201).json(savedBlog);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
});

// DELETE a specific blog only if the user is the creator
blogsRouter.delete('/:id', userExtractor, async (request, response) => {
  const user = request.user;
  const blog = await Blog.findById(request.params.id);

  if (!blog) {
    return response.status(404).json({ error: 'Blog not found' });
  }
  if (blog.user.toString() !== user._id.toString()) {
    return response.status(401).json({ error: 'Unauthorized user' });
  }
  await blog.remove();
  response.status(204).end();
});



// UPDATE likes for a specific blog
blogsRouter.put('/:id', async (req, res) => {
  const { id } = req.params;
  const { likes } = req.body;
  
  const updatedBlog = await Blog.findByIdAndUpdate(
    id,
    { likes },
    { new: true, runValidators: true }
  );
  
  if (updatedBlog) {
    res.json(updatedBlog);
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
});

module.exports = blogsRouter;
