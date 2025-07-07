import React from "react";
import { Navigate } from "react-router-dom";
import authData from "../services/authData";

const EmployeeRoute = ({ children }) => {
  if (!authData.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = authData.getUser();
  if (!user || (user.role !== "admin" && user.role !== "empleado")) {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default EmployeeRoute; 