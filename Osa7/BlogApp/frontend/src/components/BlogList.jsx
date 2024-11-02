import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Blog from './Blog';
import { likeBlog, deleteBlog } from '../store/blogsSlice';
import { Link } from 'react-router-dom';

const BlogList = () => {
  const dispatch = useDispatch();
  const blogs = useSelector((state) => state.blogs);

  const Blog = ({ blog }) => (
    <div>
      <Link to={`/blogs/${blog.id}`}>{blog.title}</Link>
      {/* Other blog info here */}
    </div>
  );

  // Define onLike and onDelete handlers
  const onLike = (blog) => {
    dispatch(likeBlog(blog));
  };

  const onDelete = (blog) => {
    const confirmDelete = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}?`
    );
    if (confirmDelete) {
      dispatch(deleteBlog(blog.id));
    }
  };

  return (
    <div className="blog-list">
      {[...blogs]
        .sort((a, b) => b.likes - a.likes)
        .map((blog) => (
          <Blog
            key={blog.id}
            blog={blog}
            onLike={() => onLike(blog)}
            onDelete={() => onDelete(blog)}
          />
        ))}
    </div>
  );
};

export default BlogList;
