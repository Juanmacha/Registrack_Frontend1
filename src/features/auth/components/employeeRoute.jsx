import React from "react";
import { Navigate } from "react-router-dom";
import authData from "../services/authData";

const EmployeeRoute = ({ children }) => {
  if (!authData.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = authData.getUser();
  if (!user || (user.role !== "Administrador" && user.role !== "Empleado")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default EmployeeRoute; 