import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../shared/contexts/authContext";

const EmployeeRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!user || (user.role !== "Administrador" && user.role !== "Empleado")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default EmployeeRoute;