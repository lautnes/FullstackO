import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = ({ user, handleLogout }) => (
  <div className="navbar">
    <h1>Blog App</h1>
    <nav>
      <Link to="/">Home</Link>
      <Link to="/users">Users</Link>
      {user && (
        <button onClick={handleLogout} style={{ marginLeft: '20px' }}>
          Logout
        </button>
      )}
    </nav>
  </div>
);

export default Navbar;
