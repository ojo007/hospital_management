import React from 'react';
import { Navigate } from 'react-router-dom';

const RoleBasedRoute = ({ children, allowedRoles }) => {
  const userData = localStorage.getItem('userData');
  
  if (!userData) {
    return <Navigate to="/" replace />;
  }

  try {
    const user = JSON.parse(userData);
    
    if (!user || !user.role) {
      return <Navigate to="/" replace />;
    }

    if (!allowedRoles.includes(user.role)) {
      // Redirect to appropriate dashboard based on role
      const roleRedirects = {
        'ADMIN': '/admin-dashboard',
        'STORE OFFICER': '/store/dashboard',
        'SALES POINT STAFF': '/sales/dashboard',
        'ACCOUNTANT': '/accounts/dashboard'
      };
      return <Navigate to={roleRedirects[user.role] || '/'} replace />;
    }

    return children;
  } catch (error) {
    return <Navigate to="/" replace />;
  }
};

export default RoleBasedRoute;