import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, ROLE_ROUTES } from '../contexts/AuthContext';

interface PublicRouteProps {
  children: ReactNode;
}

export default function PublicRoute({ children }: PublicRouteProps) {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    const redirect = user?.roleId ? ROLE_ROUTES[user.roleId] : '/dashboard';
    return <Navigate to={redirect} replace />;
  }

  return <>{children}</>;
}
