import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { ROUTES } from './routes.config';
import { MainLayout } from '../layouts/MainLayout';
import { AuthLayout } from '../layouts/AuthLayout';
import { ProtectedRoute } from './ProtectedRoute';
import { AdminRoute } from './AdminRoute';
import { LoginPage } from '../pages/auth/LoginPage';
import { DashboardPage } from '../pages/dashboard/DashboardPage';
import { ProfilePage } from '../pages/profile/ProfilePage';
import { UsersPage } from '../pages/users/UsersPage';
import { SimilarityPage } from '../pages/similarity/SimilarityPage';
import { LsmPage } from '../pages/lsm/LsmPage';
import { ScholarshipsPage } from '../pages/scholarships/ScholarshipsPage';
import { NotFoundPage } from '../pages/NotFoundPage';

export const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public Auth Routes */}
      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
      </Route>

      {/* Protected Institutional Routes */}
      <Route element={<ProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path={ROUTES.HOME} element={<Navigate to={ROUTES.DASHBOARD} replace />} />
          <Route path={ROUTES.DASHBOARD} element={<DashboardPage />} />
          
          {/* Perfil Institucional de Usuario (ADMIN, TEACHER, STUDENT) */}
          <Route path={ROUTES.PROFILE} element={<ProfilePage />} />

          {/* Módulo Administrativo: Solo para ADMIN */}
          <Route
            path={ROUTES.USERS}
            element={
              <AdminRoute>
                <UsersPage />
              </AdminRoute>
            }
          />

          {/* Módulos de IA */}
          <Route path={ROUTES.SIMILARITY.ROOT} element={<SimilarityPage />} />
          <Route path={ROUTES.LSM.ROOT} element={<LsmPage />} />
          <Route path={ROUTES.SCHOLARSHIPS.ROOT} element={<ScholarshipsPage />} />
        </Route>
      </Route>

      {/* 404 Fallback */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};
