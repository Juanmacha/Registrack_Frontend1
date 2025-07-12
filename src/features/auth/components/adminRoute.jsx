import React from "react";
import { Navigate } from "react-router-dom";
import authData from "../services/authData";

const AdminRoute = ({ children }) => {
  if (!authData.isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  const user = authData.getUser();
  if (!user || user.role !== "Administrador") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
