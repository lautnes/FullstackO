import { configureStore } from '@reduxjs/toolkit';
import notificationReducer from './notificationSlice';
import userReducer from './userSlice';
import usersReducer from './usersSlice';
import blogsReducer from './blogsSlice';

const store = configureStore({
  reducer: {
    notification: notificationReducer,
    blogs: blogsReducer,
    users: usersReducer,       
    user: userReducer,
  },
});

export default store;
