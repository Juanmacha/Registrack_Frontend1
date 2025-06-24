import React from 'react';
import { Routes, Route } from 'react-router-dom';

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

      <Route
        path="/ventasServiciosProceso"
        element={
          <AdminRoute>
            <GestionVentasServiciosProceso />
          </AdminRoute>
        }
      />

      <Route
        path="/ventasServiciosFin"
        element={
          <AdminRoute>
            <GestionVentasServiciosFin />
          </AdminRoute>
        }
      />

      {/* Ruta Pago */}
      <Route
        path="/pagos"
        element={
          <AdminRoute>
            <Pagos />
          </AdminRoute>
        }
      />

      <Route
        path="/calendario"
        element={
          <AdminRoute>
            <Calendario />
          </AdminRoute>
        } />

      <Route
        path="/gestionClientes"
        element={
          <AdminRoute>
            <GestionClientes />
          </AdminRoute>
        } />

      <Route
        path="/gestionUsuarios"
        element={
          <AdminRoute>
            <GestionUsuarios />
          </AdminRoute>
        } />

      <Route
        path="/roles"
        element={
          <AdminRoute>
            <Roles />
          </AdminRoute>
        } />

      <Route
        path="/empleados"
        element={
          <AdminRoute>
            <Empleados />
          </AdminRoute>
        } />

    </Routes>
  );
};

export default AppRoutes;
