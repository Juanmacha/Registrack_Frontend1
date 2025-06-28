import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom'; // <-- Asegúrate de importar Navigate

import Landing from '../features/landing/landing';
import Login from '../features/auth/pages/login';
import Register from '../features/auth/pages/register';
import Profile from '../features/auth/pages/profile';
import ForgotPassword from '../features/auth/pages/forgotPassword';
import ResetPassword from '../features/auth/pages/resetPassword';

import Dashboard from '../features/dashboard/pages/dashAdmin/dashboard';
import Pagos from '../features/dashboard/pages/pagos/pagos';
import Calendario from '../features/dashboard/pages/gestionCitas/calendario';
import GestionClientes from '../features/dashboard/pages/gestionClientes/gestionClientes';
import GestionUsuarios from '../features/dashboard/pages/gestionUsuarios/gestionUsuarios';
import GestionVentasServiciosProceso from '../features/dashboard/pages/gestionVentasServicios/ventasServiciosProceso';
import GestionVentasServiciosFin from '../features/dashboard/pages/gestionVentasServicios/ventasServiciosFin';
import Roles from '../features/dashboard/pages/gestionRoles/roles';
import Empleados from '../features/dashboard/pages/gestionEmpleados/empleados';

import AuthLayout from '../features/auth/components/authLayout';
import AdminRoute from '../features/auth/components/admnRoute';

// Layout general para admin
import AdminLayout from '../features/dashboard/layouts/adminLayouts';

// Nuevas páginas de servicios
import Busqueda from '../features/landing/pages/busqueda';
import Certificacion from '../features/landing/pages/certificacion';
import Renovacion from '../features/landing/pages/renovacion';
import Ampliacion from '../features/landing/pages/ampliacion';
import Cesion from '../features/landing/pages/cesionMarca';
import Oposicion from '../features/landing/pages/presentacionOposicion';

const AppRoutes = () => {
  return (
    <Routes>
      {/* Rutas públicas */}
      <Route path="/" element={<Landing />} />
      <Route path="/profile" element={<Profile />} />

      {/* Páginas individuales de servicios */}
      <Route path="/pages/cesionMarca" element={<Cesion />} />
      <Route path="/pages/presentacionOposicion" element={<Oposicion />} />
      <Route path="/pages/renovacion" element={<Renovacion />} />
      <Route path="/pages/busqueda" element={<Busqueda />} />
      <Route path="/pages/certificacion" element={<Certificacion />} />
      <Route path="/pages/ampliacion" element={<Ampliacion />} />

      {/* Layout para autenticación */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgotPassword" element={<ForgotPassword />} />
        <Route path="/resetPassword" element={<ResetPassword />} />
      </Route>

      {/* Rutas protegidas para admin con layout común */}
      <Route
        path="/admin"
        element={
          <AdminRoute>
            <AdminLayout />
          </AdminRoute>
        }
      >
        <Route path="dashboard" element={<Dashboard />} />
        <Route path="pagos" element={<Pagos />} />
        <Route path="ventasServiciosProceso" element={<GestionVentasServiciosProceso />} />
        <Route path="ventasServiciosFin" element={<GestionVentasServiciosFin />} />
        <Route path="calendario" element={<Calendario />} />
        <Route path="gestionClientes" element={<GestionClientes />} />
        <Route path="gestionUsuarios" element={<GestionUsuarios />} />
        <Route path="roles" element={<Roles />} />
        <Route path="empleados" element={<Empleados />} />
      </Route>

      {/* ✅ Redirección temporal por compatibilidad */}
      <Route path="/dashboard" element={<Navigate to="/admin/dashboard" replace />} />
    </Routes>
  );
};

export default AppRoutes;
