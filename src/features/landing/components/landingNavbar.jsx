import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { CgProfile } from "react-icons/cg";
import authData from "../../auth/services/authData";
import alertService from "../../../utils/alertService.js";

const NavBarLanding = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [userMenuAbierto, setUserMenuAbierto] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  
  // Obtener usuario usando el servicio authData
  const user = authData.getUser();

  const handleLogout = async () => {
    setUserMenuAbierto(false);
    
    const result = await alertService.logoutConfirm();
    
    if (result.isConfirmed) {
      // Limpiar token usando el servicio authData
      authData.removeToken();
      
      // Mostrar alerta de éxito
      await alertService.success("Sesión cerrada", "Has cerrado sesión correctamente.");
      
      navigate("/login");
    }
  };

  const handleVerPerfil = () => {
    setUserMenuAbierto(false);
    navigate("/profile");
  };

  // Cierre del menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setUserMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="w-full bg-white fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl mx-auto h-28 flex items-center justify-between px-6 relative">
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

        {/* Botón hamburguesa */}
        <div className="md:hidden">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
        </div>

        {/* Navegación para escritorio */}
        <div className="hidden md:flex gap-8 text-lg text-gray-700">
          {!user ? (
            <>
              <ScrollLink
                to="nosotros"
                smooth={true}
                duration={500}
                offset={-110}
                className="cursor-pointer text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Nosotros
              </ScrollLink>
              <ScrollLink
                to="servicios"
                smooth={true}
                duration={500}
                offset={-110}
                className="cursor-pointer text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Servicios
              </ScrollLink>
              <ScrollLink
                to="footer"
                smooth={true}
                duration={500}
                offset={-110}
                className="cursor-pointer text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Contáctanos
              </ScrollLink>
              <ScrollLink
                to="footer"
                smooth={true}
                duration={500}
                offset={-110}
                className="cursor-pointer text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Ayuda
              </ScrollLink>
            </>
          ) : (
            <>
              <Link
                to="/#"
                className="text-lg text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Servicios
              </Link>
              <Link
                to="/misprocesos"
                className="text-lg text-lg text-gray-700 hover:text-blue-600 transition no-underline"
              >
                Mis procesos
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

        {/* Botones de sesión */}
        <div className="hidden md:flex gap-4">
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
            <div className="relative" ref={userMenuRef}>
              <button
                onClick={() => setUserMenuAbierto(!userMenuAbierto)}
                aria-expanded={userMenuAbierto}
                className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition duration-200"
              >
                <CgProfile className="w-7 h-7 text-gray-700" />
              </button>

              {userMenuAbierto && (
                <div
                  className="absolute right-0 mt-2 w-44 bg-white border border-gray-200 rounded-xl shadow-xl z-10 overflow-hidden"
                  role="menu"
                >
                  <button
                    onClick={handleVerPerfil}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-blue-100 transition"
                  >
                    Ver perfil
                  </button>
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100 transition"
                  >
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Menú desplegable para móviles */}
        {menuAbierto && (
          <div className="md:hidden absolute top-28 left-0 w-full bg-white shadow-md flex flex-col items-center gap-4 py-4 z-40">
            {!user ? (
              <>
                <ScrollLink
                  to="nosotros"
                  smooth={true}
                  duration={500}
                  offset={-110}
                  onClick={() => setMenuAbierto(false)}
                  className="text-gray-700 hover:text-blue-600 cursor-pointer"
                >
                  Nosotros
                </ScrollLink>
                <ScrollLink
                  to="servicios"
                  smooth={true}
                  duration={500}
                  offset={-110}
                  onClick={() => setMenuAbierto(false)}
                  className="text-gray-700 hover:text-blue-600 cursor-pointer"
                >
                  Servicios
                </ScrollLink>
                <ScrollLink
                  to="footer"
                  smooth={true}
                  duration={500}
                  offset={-110}
                  onClick={() => setMenuAbierto(false)}
                  className="text-gray-700 hover:text-blue-600 cursor-pointer"
                >
                  Contáctanos
                </ScrollLink>
                <ScrollLink
                  to="footer"
                  smooth={true}
                  duration={500}
                  offset={-110}
                  onClick={() => setMenuAbierto(false)}
                  className="text-gray-700 hover:text-blue-600 cursor-pointer"
                >
                  Ayuda
                </ScrollLink>
                <Link
                  to="/login"
                  className="text-blue-700 font-semibold"
                  onClick={() => setMenuAbierto(false)}
                >
                  Iniciar Sesión
                </Link>
                <Link
                  to="/register"
                  className="bg-blue-700 text-white px-4 py-2 rounded hover:bg-blue-800"
                  onClick={() => setMenuAbierto(false)}
                >
                  Regístrate
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/#"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setMenuAbierto(false)}
                >
                  Servicios
                </Link>
                <Link
                  to="/mis-marcas"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setMenuAbierto(false)}
                >
                  Mis procesos
                </Link>
                <Link
                  to="/configuracion"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setMenuAbierto(false)}
                >
                  Historial
                </Link>
                <Link
                  to="/ayuda"
                  className="text-gray-700 hover:text-blue-600"
                  onClick={() => setMenuAbierto(false)}
                >
                  Ayuda
                </Link>
                <Link
                  to="/profile"
                  className="text-blue-700"
                  onClick={() => setMenuAbierto(false)}
                >
                  Perfil
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setMenuAbierto(false);
                  }}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cerrar Sesión
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </nav>
  );
};

export default NavBarLanding;