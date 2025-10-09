import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../lib/store';
import type { UserRole } from '../types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: UserRole[];
}

export default function ProtectedRoute({ children, allowedRoles }: ProtectedRouteProps) {
  const { isAuthenticated, user } = useAuthStore();

  if (!isAuthenticated || !user) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user.rol)) {
    // Redirigir a la página principal del usuario según su rol
    if (user.rol === 'cliente') {
      return <Navigate to="/menu" replace />;
    } else if (user.rol === 'chef') {
      return <Navigate to="/chef/dashboard" replace />;
    } else if (user.rol === 'cajero') {
      return <Navigate to="/cajero" replace />;
    }
  }

  return <>{children}</>;
}
