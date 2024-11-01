const express = require('express');
const Blog = require('../models/blog');

const blogsRouter = express.Router();

// GET all blogs
blogsRouter.get('/', async (req, res) => {
  const blogs = await Blog.find({});
  res.json(blogs);
});

// POST a new blog
blogsRouter.post('/', async (req, res) => {
  const blog = new Blog(req.body);

  try {
    const savedBlog = await blog.save();
    res.status(201).json(savedBlog);
  } catch (error) {
    if (error.name === 'ValidationError') {
      res.status(400).json({ error: error.message });
    } else {
      res.status(500).json({ error: 'Something went wrong' });
    }
  }
});

// DELETE a specific blog
blogsRouter.delete('/:id', async (req, res) => {
  const { id } = req.params;
  
  const deletedBlog = await Blog.findByIdAndDelete(id);
  
  if (deletedBlog) {
    res.status(204).end();
  } else {
    res.status(404).json({ error: 'Blog not found' });
  }
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
