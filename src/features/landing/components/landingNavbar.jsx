import React from "react";
import { Link, useNavigate } from "react-router-dom";
import authData from "../../auth/services/authData";

const LandingNavbar = () => {
  const navigate = useNavigate();
  const user = authData.getUser(); // Obtenemos el usuario logueado

  const handleLogout = () => {
    authData.removeToken();
    navigate("/");
  };

  return (
    <nav className="w-full bg-white shadow border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between relative">

        {/* Logo a la izquierda */}
        <div className="flex items-center">
          <Link to="/">
            <img src="/images/logoNombre.png" alt="Logo" className="h-11 cursor-pointer" />
          </Link>
        </div>

        {/* Links centrados (condicionales) */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-6 text-sm font-medium text-gray-800">
          {!user ? (
            <>
              <a href="#specialties" className="hover:text-yellow-500 no-underline">Nosotros</a>
              <a href="#services" className="hover:text-yellow-500 no-underline">Servicios</a>
              <a href="#footer" className="hover:text-yellow-500 no-underline">Contáctanos</a>
            </>
          ) : (
            <>
              <Link to="/dashboard" className="hover:text-yellow-500 no-underline">Servicios</Link>
              <Link to="/mis-marcas" className="hover:text-yellow-500 no-underline">Mis procesos</Link>
              <Link to="/configuracion" className="hover:text-yellow-500 no-underline">Historial de servicios</Link>
              <Link to="/ayuda" className="hover:text-yellow-500 no-underline">Ayuda</Link>
            </>
          )}
        </div>

        {/* Botones a la derecha */}
        <div className="flex space-x-2">
          {!user ? (
            <>
              <Link
                to="/login"
                className="bg-[#1a4480] text-white px-4 py-1.5 rounded text-sm font-medium hover:opacity-90 no-underline"
              >
                Iniciar sesión
              </Link>
              <Link
                to="/register"
                className="border border-[#1a4480] text-[#1a4480] px-4 py-1.5 rounded text-sm font-medium hover:bg-[#1a4480]/10 no-underline"
              >
                Registrarse
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="border border-[#1a4480] text-[#1a4480] px-4 py-1.5 rounded text-sm font-medium hover:bg-[#1a4480]/10 no-underline"
              >
                Ver perfil
              </Link>
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-1.5 rounded text-sm font-medium hover:bg-red-600"
              >
                Cerrar sesión
              </button>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
