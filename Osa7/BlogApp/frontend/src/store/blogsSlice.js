// src/store/blogsSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import blogService from '../services/blogs';

// Thunks for fetching, creating, updating, and deleting blogs
export const fetchBlogs = createAsyncThunk('blogs/fetchBlogs', async () => {
  const blogs = await blogService.getAll();
  return blogs;
});

export const createBlog = createAsyncThunk('blogs/createBlog', async (newBlog) => {
  const blog = await blogService.create(newBlog);
  return blog;
});

export const likeBlog = createAsyncThunk('blogs/likeBlog', async (blog) => {
  const updatedBlog = await blogService.update(blog.id, { ...blog, likes: blog.likes + 1 });
  return updatedBlog;
});

export const deleteBlog = createAsyncThunk('blogs/deleteBlog', async (id) => {
  await blogService.remove(id);
  return id;
});

export const fetchSingleBlog = createAsyncThunk('blogs/fetchSingleBlog', async (id) => {
  const blog = await blogService.getBlogById(id);
  return blog;
});

export const addComment = createAsyncThunk('blogs/addComment', async ({ id, comment }) => {
  const updatedBlog = await blogService.addComment(id, comment);
  return updatedBlog;
});

const blogsSlice = createSlice({
  name: 'blogs',
  initialState: [],
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchBlogs.fulfilled, (state, action) => action.payload)
      .addCase(createBlog.fulfilled, (state, action) => {
        state.push(action.payload);
      })
      .addCase(likeBlog.fulfilled, (state, action) => {
        const index = state.findIndex((blog) => blog.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      })
      .addCase(deleteBlog.fulfilled, (state, action) => {
        return state.filter((blog) => blog.id !== action.payload);
      })
      .addCase(fetchSingleBlog.fulfilled, (state, action) => {
        const index = state.findIndex((blog) => blog.id === action.payload.id);
        if (index === -1) {
          state.push(action.payload);
        } else {
          state[index] = action.payload;
        }
      })
      .addCase(addComment.fulfilled, (state, action) => {
        const index = state.findIndex((blog) => blog.id === action.payload.id);
        if (index !== -1) {
          state[index] = action.payload;
        }
      });
  },
});

export default blogsSlice.reducer;
