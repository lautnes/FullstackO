import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

const Blog = ({ blog, onLike, onDelete }) => (
  <div className="blog-item">
    <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
    <p>Author: {blog.author}</p>
    <p>{blog.likes} likes</p>
    <button onClick={onLike}>Like</button>
    {onDelete && <button onClick={onDelete}>Delete</button>}
  </div>
);

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func,
};

export default Blog;
