import React from 'react';
import { Routes, Route } from 'react-router-dom';

import Landing from '../features/landing/landing';
import Login from '../features/auth/pages/login';
import Register from '../features/auth/pages/register';
import Profile from '../features/auth/pages/profile';
import ForgotPassword from '../features/auth/pages/forgotPassword';
import ResetPassword from '../features/auth/pages/resetPassword';
import Dashboard from '../features/dashboard/pages/dashAdmin/dashboard';

import AuthLayout from '../features/auth/components/authLayout';
import AdminRoute from '../features/auth/components/admnRoute';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/profile" element={<Profile />} />

      {/* Layout para auth (login/register/etc.) */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Route>

      {/* Ruta protegida solo para admin */}
      <Route
        path="/dashboard"
        element={
          <AdminRoute>
            <Dashboard />
          </AdminRoute>
        }
      />
    </Routes>
  );
};

export default AppRoutes;
