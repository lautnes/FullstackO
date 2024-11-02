import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchSingleBlog, addComment } from '../store/blogsSlice';
import { useParams } from 'react-router-dom';

const BlogDetails = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const [newComment, setNewComment] = useState('');
  const blog = useSelector((state) => 
    state.blogs.find((blog) => blog.id === id)
  );

  useEffect(() => {
    dispatch(fetchSingleBlog(id));
  }, [dispatch, id]);

  const handleAddComment = (e) => {
    e.preventDefault();
    if (newComment.trim()) {
      dispatch(addComment({ id: blog.id, comment: newComment }));
      setNewComment(''); // Clear the input after submitting
    }
  };

  if (!blog) return <p>Loading...</p>;

  return (
    <div>
      <h2>{blog.title}</h2>
      <p>{blog.author}</p>
      <p>{blog.likes} likes</p>
      <p>{blog.url}</p>
      
      <h3>Comments</h3>
      <ul>
        {(blog.comments || []).map((comment, index) => (
          <li key={index}>{comment}</li>
        ))}
      </ul>

      <form onSubmit={handleAddComment}>
        <input
          type="text"
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          placeholder="Add a comment"
        />
        <button type="submit">Add Comment</button>
      </form>
    </div>
  );
};

export default BlogDetails;
