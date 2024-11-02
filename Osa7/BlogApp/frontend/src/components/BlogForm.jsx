// BlogForm.jsx
import React, { useState } from 'react';

const BlogForm = ({ createBlog }) => {
  const [newBlog, setNewBlog] = useState({ title: '', author: '', url: '' });

  const handleBlogChange = (event) => {
    const { name, value } = event.target;
    setNewBlog({ ...newBlog, [name]: value });
  };

  const addBlog = (event) => {
    event.preventDefault();
    createBlog(newBlog);
    setNewBlog({ title: '', author: '', url: '' });
  };

  return (
    <form onSubmit={addBlog} className="blog-form">
      <h3>Add a New Blog</h3>
      <div className="form-group">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          type="text"
          name="title"
          value={newBlog.title}
          onChange={handleBlogChange}
          placeholder="Enter the blog title"
          className="input-field"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="author">Author</label>
        <input
          id="author"
          type="text"
          name="author"
          value={newBlog.author}
          onChange={handleBlogChange}
          placeholder="Enter the author's name"
          className="input-field"
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="url">URL</label>
        <input
          id="url"
          type="text"
          name="url"
          value={newBlog.url}
          onChange={handleBlogChange}
          placeholder="Enter the blog URL"
          className="input-field"
          required
        />
      </div>
      <button type="submit" className="submit-button">Create Blog</button>
    </form>
  );
};

export default BlogForm;
