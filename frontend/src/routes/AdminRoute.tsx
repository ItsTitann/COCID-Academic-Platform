import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { ROUTES } from './routes.config';

interface AdminRouteProps {
  redirectPath?: string;
  children?: React.ReactNode;
}

export const AdminRoute: React.FC<AdminRouteProps> = ({
  redirectPath = ROUTES.DASHBOARD,
  children,
}) => {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-100">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-12 h-12 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-600 text-sm font-medium">Verificando permisos de administración...</p>
        </div>
      </div>
    );
  }

  if (user?.rol !== 'ADMIN') {
    return <Navigate to={redirectPath} replace />;
  }

  return children ? <>{children}</> : <Outlet />;
};
