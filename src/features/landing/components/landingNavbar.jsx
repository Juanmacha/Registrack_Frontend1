import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Link as ScrollLink } from "react-scroll";
import { CgProfile } from "react-icons/cg";
import authData from "../../auth/services/authData";
import alertService from "../../../utils/alertService.js";

const ACTIVE_CLASSES = "text-blue-700 font-semibold border-b-2 border-blue-700 bg-transparent";
const INACTIVE_CLASSES = "text-gray-700 border-transparent hover:text-blue-700 bg-transparent";

const NavBarLanding = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [userMenuAbierto, setUserMenuAbierto] = useState(false);
  const userMenuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // Obtener usuario usando el servicio authData
  const user = authData.getUser();
  const isLanding = location.pathname === "/";

  const handleLogout = async () => {
    setUserMenuAbierto(false);
    const result = await alertService.logoutConfirm();
    if (result.isConfirmed) {
      authData.removeToken();
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

  // Helper para estado activo en Links
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="w-full bg-white fixed top-0 left-0 z-50">
      <div className="max-w-screen-xl mx-auto h-28 flex items-center px-6 relative">
        {/* Columna izquierda: Logo */}
        <div className="flex items-center flex-shrink-0">
          <Link to="/">
            <img
              src="/images/logoNombre.png"
              alt="Logo"
              className="h-20 w-auto object-contain cursor-pointer"
            />
          </Link>
        </div>

        {/* Columna central: Opciones centradas */}
        <div className="flex-1 flex justify-center">
          <div className="flex gap-10 text-lg">
            {!user ? (
              <>
                <ScrollLink
                  to="nosotros"
                  smooth={true}
                  duration={500}
                  offset={-110}
                  spy={true}
                  activeClass={ACTIVE_CLASSES}
                  className={`cursor-pointer text-lg no-underline px-2 py-1 border-b-2 transition ${INACTIVE_CLASSES}`}
                >
                  Nosotros
                </ScrollLink>
                <ScrollLink
                  to="servicios"
                  smooth={true}
                  duration={500}
                  offset={-110}
                  spy={true}
                  activeClass={ACTIVE_CLASSES}
                  className={`cursor-pointer text-lg no-underline px-2 py-1 border-b-2 transition ${INACTIVE_CLASSES}`}
                >
                  Servicios
                </ScrollLink>
                <ScrollLink
                  to="footer"
                  smooth={true}
                  duration={500}
                  offset={-110}
                  spy={true}
                  activeClass={ACTIVE_CLASSES}
                  className={`cursor-pointer text-lg no-underline px-2 py-1 border-b-2 transition ${INACTIVE_CLASSES}`}
                >
                  Contáctanos
                </ScrollLink>
                <Link
                  to="/ayuda"
                  className={`text-lg px-2 py-1 no-underline border-b-2 transition ${isActive("/ayuda") ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
                >
                  Ayuda
                </Link>
              </>
            ) : (
              <>
                {isLanding ? (
                  <ScrollLink
                    to="servicios"
                    smooth={true}
                    duration={500}
                    offset={-110}
                    spy={true}
                    activeClass={ACTIVE_CLASSES}
                    className={`cursor-pointer text-lg no-underline px-2 py-1 border-b-2 transition ${INACTIVE_CLASSES}`}
                  >
                    Servicios
                  </ScrollLink>
                ) : (
                  <Link
                    to="/#servicios"
                    className={`text-lg px-2 py-1 no-underline border-b-2 transition ${window.location.hash === '#servicios' ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
                  >
                    Servicios
                  </Link>
                )}
                <a
                  href="/#footer"
                  className={`text-lg px-2 py-1 no-underline border-b-2 transition ${window.location.hash === '#footer' ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
                >
                  Contáctanos
                </a>
                <Link
                  to="/misprocesos"
                  className={`text-lg px-2 py-1 no-underline border-b-2 transition ${isActive("/misprocesos") ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
                >
                  Mis procesos
                </Link>
                <Link
                  to="/ayuda"
                  className={`text-lg px-2 py-1 no-underline border-b-2 transition ${isActive("/ayuda") ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
                >
                  Ayuda
                </Link>
              </>
            )}
          </div>
        </div>

        {/* Columna derecha: Botones de sesión o perfil */}
        <div className="flex gap-4 flex-shrink-0">
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

        {/* Botón hamburguesa */}
        <div className="md:hidden ml-4">
          <button
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="text-gray-700 hover:text-blue-600 focus:outline-none"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
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
                  spy={true}
                  activeClass={ACTIVE_CLASSES}
                  className={`text-lg no-underline px-2 py-1 border-b-2 transition ${INACTIVE_CLASSES}`}
                >
                  Nosotros
                </ScrollLink>
                <ScrollLink
                  to="servicios"
                  smooth={true}
                  duration={500}
                  offset={-110}
                  onClick={() => setMenuAbierto(false)}
                  spy={true}
                  activeClass={ACTIVE_CLASSES}
                  className={`text-lg no-underline px-2 py-1 border-b-2 transition ${INACTIVE_CLASSES}`}
                >
                  Servicios
                </ScrollLink>
                <ScrollLink
                  to="footer"
                  smooth={true}
                  duration={500}
                  offset={-110}
                  onClick={() => setMenuAbierto(false)}
                  spy={true}
                  activeClass={ACTIVE_CLASSES}
                  className={`text-lg no-underline px-2 py-1 border-b-2 transition ${INACTIVE_CLASSES}`}
                >
                  Contáctanos
                </ScrollLink>
                <Link
                  to="/ayuda"
                  className={`text-lg px-2 py-1 no-underline border-b-2 transition ${isActive("/ayuda") ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
                  onClick={() => setMenuAbierto(false)}
                >
                  Ayuda
                </Link>
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
                  to="/"
                  className={`text-lg px-2 py-1 no-underline border-b-2 transition ${isActive("/") ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
                  onClick={() => setMenuAbierto(false)}
                >
                  Servicios
                </Link>
                {isLanding ? (
                  <ScrollLink
                    to="servicios"
                    smooth={true}
                    duration={500}
                    offset={-110}
                    onClick={() => setMenuAbierto(false)}
                    spy={true}
                    activeClass={ACTIVE_CLASSES}
                    className={`text-lg no-underline px-2 py-1 border-b-2 transition ${INACTIVE_CLASSES}`}
                  >
                    Servicios
                  </ScrollLink>
                ) : (
                  <Link
                    to="/#servicios"
                    className={`text-lg px-2 py-1 no-underline border-b-2 transition ${window.location.hash === '#servicios' ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
                    onClick={() => setMenuAbierto(false)}
                  >
                    Servicios
                  </Link>
                )}
                <a
                  href="/#footer"
                  className={`text-lg px-2 py-1 no-underline border-b-2 transition ${window.location.hash === '#footer' ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
                  onClick={() => setMenuAbierto(false)}
                >
                  Contáctanos
                </a>
                <Link
                  to="/misprocesos"
                  className={`text-lg px-2 py-1 no-underline border-b-2 transition ${isActive("/misprocesos") ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
                  onClick={() => setMenuAbierto(false)}
                >
                  Mis procesos
                </Link>
                <Link
                  to="/ayuda"
                  className={`text-lg px-2 py-1 no-underline border-b-2 transition ${isActive("/ayuda") ? ACTIVE_CLASSES : INACTIVE_CLASSES}`}
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