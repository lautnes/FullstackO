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
    <form onSubmit={addBlog}>
      <div>
        <label htmlFor="title">Title</label>
        <input
          id="title" // Added id for label association
          type="text"
          name="title"
          value={newBlog.title}
          onChange={handleBlogChange}
          placeholder="Title"
        />
      </div>
      <div>
        <label htmlFor="author">Author</label>
        <input
          id="author" // Added id for label association
          type="text"
          name="author"
          value={newBlog.author}
          onChange={handleBlogChange}
          placeholder="Author"
        />
      </div>
      <div>
        <label htmlFor="url">URL</label>
        <input
          id="url" // Added id for label association
          type="text"
          name="url"
          value={newBlog.url}
          onChange={handleBlogChange}
          placeholder="URL"
        />
      </div>
      <button type="submit">Create</button>
    </form>
  );
};

export default BlogForm;
