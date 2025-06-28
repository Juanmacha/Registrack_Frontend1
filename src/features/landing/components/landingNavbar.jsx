// NavBarLanding.jsx
import React from "react";
import { Link, useNavigate } from "react-router-dom";
import authData from "../../auth/services/authData";

const NavBarLanding = () => {
  const navigate = useNavigate();
  const user = authData.getUser();

  const handleLogout = () => {
    authData.removeToken();
    navigate("/");
  };

  return (
    <nav className="w-full bg-white fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl mx-auto h-28 flex items-center justify-between px-10">
        {/* LOGO */}
        <div className="flex items-center">
          <Link to="/">
            <img
              src="/images/logoNombre.png"
              alt="Logo"
              className="h-20 w-auto object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* ENLACES DE NAVEGACIÓN */}
        <div className="hidden md:flex gap-8 text-lg text-gray-700">
          {!user ? (
            <>
              <a
                href="#nosotros"
                className="text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Nosotros
              </a>
              <a
                href="#servicios"
                className="text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Servicios
              </a>
              <a
                href="#footer"
                className="text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Contáctanos
              </a>
            </>
          ) : (
            <>
              <Link
                to="/#"
                className="text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Servicios
              </Link>
              <Link
                to="/mis-marcas"
                className="text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Mis procesos
              </Link>
              <Link
                to="/configuracion"
                className="text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Historial
              </Link>
              <Link
                to="/ayuda"
                className="text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Ayuda
              </Link>
            </>
          )}
        </div>

        <div className="flex gap-4">
          {!user ? (
            <>
              <Link
                to="/login"
                className="no-underline px-6 py-2 text-sm bg-white text-blue-600 border border-blue-700 rounded transition hover:bg-blue-100"
              >
                Iniciar Sesión
              </Link>
              <Link
                to="/register"
                className="no-underline px-6 py-2 text-sm bg-blue-700 text-white rounded transition hover:bg-blue-800"
              >
                Regístrate
              </Link>
            </>
          ) : (
            <>
              <Link
                to="/profile"
                className="no-underline px-6 py-2 text-sm border border-blue-700 text-blue-700 rounded transition hover:bg-blue-100"
              >
                Perfil
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-2 text-sm bg-red-500 text-white rounded transition hover:bg-red-600"
              >
                Cerrar Sesión
              </button>
            </>
          )}
        </div>

      </div>
    </nav>
  );
};

export default NavBarLanding;
