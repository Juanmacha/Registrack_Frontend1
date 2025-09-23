import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../shared/contexts/authContext";

const EmployeeRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  console.log('🔍 [EmployeeRoute] Verificando acceso:', { 
    isAuthenticated: isAuthenticated(), 
    user: user,
    userRole: user?.rol || user?.role 
  });

  if (!isAuthenticated()) {
    console.log('❌ [EmployeeRoute] Usuario no autenticado, redirigiendo a login');
    return <Navigate to="/login" replace />;
  }

  // Extraer el nombre del rol si es un objeto
  let roleName = '';
  if (user?.rol) {
    if (typeof user.rol === 'object' && user.rol !== null) {
      roleName = user.rol.nombre || user.rol.name || user.rol.role || '';
    } else {
      roleName = user.rol || '';
    }
  } else if (user?.role) {
    if (typeof user.role === 'object' && user.role !== null) {
      roleName = user.role.nombre || user.role.name || user.role.role || '';
    } else {
      roleName = user.role || '';
    }
  }

  console.log('🎯 [EmployeeRoute] Rol extraído:', roleName);

  if (!user || (roleName !== "administrador" && roleName !== "Administrador" && roleName !== "empleado" && roleName !== "Empleado")) {
    console.log('❌ [EmployeeRoute] Usuario sin permisos, redirigiendo a landing');
    return <Navigate to="/" replace />;
  }

  console.log('✅ [EmployeeRoute] Acceso permitido');
  return children;
};

export default EmployeeRoute;