import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../../shared/contexts/authContext";

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated()) {
    return <Navigate to="/login" replace />;
  }

  if (!user || user.role !== "Administrador") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default AdminRoute;
