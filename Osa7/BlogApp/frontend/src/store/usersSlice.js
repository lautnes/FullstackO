// src/store/usersSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import userService from '../services/users';

// Define the fetchUsers async thunk
export const fetchUsers = createAsyncThunk('users/fetchUsers', async () => {
  const users = await userService.getAll();
  return users;
});

const usersSlice = createSlice({
  name: 'users',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchUsers.fulfilled, (state, action) => {
      return action.payload;
    });
  },
});

export default usersSlice.reducer;
