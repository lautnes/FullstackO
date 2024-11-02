import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUsers } from '../store/usersSlice'; // Assuming you have a usersSlice

const Users = () => {
  const dispatch = useDispatch();
  const users = useSelector((state) => state.users); // Assuming your users data is stored in state.users

  useEffect(() => {
    if (!users) {
      dispatch(fetchUsers()); // Fetch users if they are not already loaded
    }
  }, [dispatch, users]);

  if (!users) {
    return <div>Loading...</div>; // Display loading state if users data is not available yet
  }

  return (
    <div>
      <h2>Users</h2>
      <ul>
        {users.length > 0 ? (
          users.map((user) => (
            <li key={user.id}>
              {user.name} - {user.blogs.length} blogs
            </li>
          ))
        ) : (
          <p>No users found</p> // Display message if users array is empty
        )}
      </ul>
    </div>
  );
};

export default Users;
