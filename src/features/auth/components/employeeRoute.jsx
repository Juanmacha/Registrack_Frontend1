import React from "react";
import { Navigate } from "react-router-dom";
import authData from "../services/authData";

const EmployeeRoute = ({ children }) => {
  const isAuthenticated = authData.isAuthenticated();
  const user = authData.getUser();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!user || (user.role !== "Administrador" && user.role !== "Empleado")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default EmployeeRoute;