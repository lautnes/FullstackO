import { createSlice } from '@reduxjs/toolkit';
import loginService from '../services/login';
import blogService from '../services/blogs';

const userSlice = createSlice({
  name: 'user',
  initialState: null,
  reducers: {
    setUser(state, action) {
      return action.payload;
    },
    clearUser() {
      return null;
    },
  },
});

export const { setUser, clearUser } = userSlice.actions;

export const loginUser = (credentials) => async (dispatch) => {
  const user = await loginService.login(credentials);
  window.localStorage.setItem('loggedBlogAppUser', JSON.stringify(user));
  blogService.setToken(user.token);
  dispatch(setUser(user));
};

export const logoutUser = () => (dispatch) => {
  window.localStorage.removeItem('loggedBlogAppUser');
  blogService.setToken(null);
  dispatch(clearUser());
};

export default userSlice.reducer;
