import React from 'react';
import { Routes, Route } from 'react-router-dom';
import BlogList from './BlogList';
import BlogDetails from './BlogDetails';
import Users from './Users';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<BlogList />} />
      <Route path="/blogs/:id" element={<BlogDetails />} />
      <Route path="/users" element={<Users />} />
    </Routes>
  );
};

export default AppRoutes;
