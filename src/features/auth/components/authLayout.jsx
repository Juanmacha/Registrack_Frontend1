import React from "react";
import { Outlet } from "react-router-dom";

const AuthLayout = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden bg-white">
      {/* Lado Izquierdo: Formulario */}
      <div className="w-full md:w-1/2 h-full flex items-center justify-center px-4 bg-white">
        <div className="w-full max-w-md">
          <Outlet />
        </div>
      </div>

{/* Lado Derecho: Branding */}
<div className="hidden md:flex w-1/2 h-full items-center justify-center">
  <div className="flex flex-col items-center text-center z-10">
    {/* Imagen centrada */}
    <img
      src="/images/logoNombre.png"
      alt="Logo de Registrack"
      className="w-50 h-24 mb-4 object-contain"
    />
    <p className="text-blue-700">
      Sistema de gestión de registros
    </p>
  </div>
</div>



      {/* Prevenir scroll horizontal innecesario */}
      <style>{`body { overflow-x: hidden; }`}</style>
    </div>
  );
};

export default AuthLayout;
