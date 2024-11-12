import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Check if the admin user is saved in localStorage
  const adminData = localStorage.getItem('user');
  
  // If admin data doesn't exist or user is not an admin, redirect to login
  if (!adminData || JSON.parse(adminData).role !== 'admin') {
    return <Navigate to="/auth/login" />;
  }

  // If admin user exists, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
