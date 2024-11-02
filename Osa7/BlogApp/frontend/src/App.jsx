import { useState, useEffect, useRef } from 'react';
import './App.css';
import { useDispatch, useSelector } from 'react-redux';
import { setNotification, clearNotification } from './store/notificationSlice';
import { fetchBlogs, createBlog, likeBlog, deleteBlog } from './store/blogsSlice';
import { setUser, loginUser, logoutUser } from './store/userSlice';

import { BrowserRouter as Router, Link } from 'react-router-dom';
import Notification from './components/Notification';
import LoginForm from './components/LoginForm';
import BlogForm from './components/BlogForm';
import AppRoutes from './components/AppRoutes';
import blogService from './services/blogs';
import Togglable from './components/Togglable';


const App = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user);
  const notification = useSelector((state) => state.notification);
  const blogFormRef = useRef();

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBlogAppUser');
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON);
      dispatch(setUser(user));
      blogService.setToken(user.token);
    }
    dispatch(fetchBlogs());
  }, [dispatch]);

  const handleLogin = async (event) => {
    event.preventDefault();
    try {
      await dispatch(loginUser({ username, password }));
      setUsername('');
      setPassword('');
    } catch {
      dispatch(setNotification('Invalid username or password'));
      setTimeout(() => dispatch(clearNotification()), 10000);
    }
  };

  const handleLogout = () => {
    dispatch(logoutUser());
  };

  const addBlog = async (newBlog) => {
    try {
      const createdBlog = await dispatch(createBlog(newBlog)).unwrap();
      blogFormRef.current.toggleVisibility();
      dispatch(
        setNotification(`Added new blog: ${createdBlog.title} by ${createdBlog.author}`)
      );
      setTimeout(() => dispatch(clearNotification()), 5000);
    } catch {
      dispatch(setNotification('Failed to add blog'));
      setTimeout(() => dispatch(clearNotification()), 5000);
    }
  };

  return (
    <Router>
      <div className="app-container">
        <div className="navbar">
          <h1>Blog App</h1>
          <div>
            <Link to="/">Home</Link>
            <Link to="/users">Users</Link>
          </div>
        </div>

        <Notification message={notification} />

        {user ? (
          <div className="login-section">
            <p>{user.name} logged in</p>
            <button onClick={handleLogout}>Logout</button>
            <Togglable buttonLabel="New Blog" ref={blogFormRef}>
              <BlogForm createBlog={addBlog} />
            </Togglable>
          </div>
        ) : (
          <LoginForm
            handleSubmit={handleLogin}
            handleUsernameChange={({ target }) => setUsername(target.value)}
            handlePasswordChange={({ target }) => setPassword(target.value)}
            username={username}
            password={password}
          />
        )}

        <AppRoutes />
      </div>
    </Router>
  );
};

export default App;
