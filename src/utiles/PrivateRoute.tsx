import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PrivateRoute = () => {
  // Retrieve the user data from localStorage
  const userData = localStorage.getItem('user');
  
  // If user data doesn't exist or isAdmin is false, redirect to login
  if (!userData || !JSON.parse(userData).isAdmin) {
    return <Navigate to="/auth/login" />;
  }

  // If the user is an admin, render the child routes
  return <Outlet />;
};

export default PrivateRoute;
