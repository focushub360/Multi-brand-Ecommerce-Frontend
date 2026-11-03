import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { getStoredDealer, getStoredCustomer } from '../../utils/auth';

/**
 * Route protector for role-based access.
 * - Redirects unauthenticated users to /login preserving target URL and reason.
 * - Restricts access to allowed roles (dealer, customer).
 */
export default function ProtectedRoute({ allowedRole, children }) {
  const location = useLocation();

  if (allowedRole === 'dealer') {
    const dealer = getStoredDealer();
    if (!dealer || dealer.role !== 'dealer') {
      return (
        <Navigate
          to="/login"
          state={{
            message: 'Dealer credentials required to access the Dealer Portal.',
            from: location.pathname + location.search
          }}
          replace
        />
      );
    }
    return children;
  }

  if (allowedRole === 'customer') {
    const customer = getStoredCustomer();
    if (!customer || customer.role !== 'customer') {
      return (
        <Navigate
          to="/login"
          state={{
            message: 'Please log in to continue.',
            from: location.pathname + location.search
          }}
          replace
        />
      );
    }
    return children;
  }

  return children;
}
