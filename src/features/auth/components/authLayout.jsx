import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="min-h-screen w-full">
      <Outlet />
      
      {/* Prevenir scroll horizontal innecesario */}
      <style>{`body { overflow-x: hidden; }`}</style>
    </div>
  );
};

export default AuthLayout;
