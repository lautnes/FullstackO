import { useState } from 'react';
import PropTypes from 'prop-types';

const Blog = ({ blog, user, onLike, onDelete }) => {
  const [expanded, setExpanded] = useState(false);

  const toggleExpanded = () => {
    setExpanded(!expanded);
  };

  return (
    <div
      data-testid="blog-item"
      style={{
        border: '1px solid #ccc',
        borderRadius: '5px',
        padding: '10px',
        marginBottom: '10px',
        background: '#f9f9f9'
      }}
    >
      <div data-testid={`blog-item-${blog.title.replace(/\s+/g, '-')}`}>
        <p>{blog.title} {blog.author}</p>
        <button onClick={toggleExpanded}>{expanded ? 'hide' : 'view'}</button>
      </div>
      {expanded && (
        <div data-testid="blog-details">
          <p data-testid="blog-url">URL: {blog.url}</p>
          <p data-testid="blog-likes">
            Likes: {blog.likes}
            <button data-testid="like-button" onClick={() => onLike(blog)}>like</button>
          </p>
          <p data-testid="blog-user">Added by: {blog.user?.name || "Unknown"}</p>
          {user && blog.user?.username === user.username && (
            <button data-testid="delete-button" onClick={() => onDelete(blog)}>delete</button>
          )}
        </div>
      )}
    </div>
  );
};

Blog.propTypes = {
  blog: PropTypes.object.isRequired,
  user: PropTypes.object,
  onLike: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired
};

export default Blog;
