import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { isAdminAuthenticated } from '../../utils/adminAuth';

export default function AdminProtectedRoute({ children }) {
  const location = useLocation();
  const authenticated = isAdminAuthenticated();

  if (!authenticated) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />;
  }

  return children;
}

