import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { CgProfile } from "react-icons/cg";
import authData from "../../auth/services/authData";
import alertService from "../../../utils/alertService.js";

const NavBar = () => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setMenuAbierto(!menuAbierto);

  const handleVerPerfil = () => {
    setMenuAbierto(false);
    navigate("/profile");
  };

  const handleCerrarSesion = async () => {
    setMenuAbierto(false);
    
    const result = await alertService.logoutConfirm();
    
    if (result.isConfirmed) {
      // Limpiar token usando el servicio authData
      authData.removeToken();
      
      // Mostrar alerta de éxito
      await alertService.success("Sesión cerrada", "Has cerrado sesión correctamente.");
      
      navigate("/login");
    }
  };

  // Cierre del menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuAbierto(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Mapeo de rutas a títulos
  const titulosPorRuta = {
    "/admin/dashboard": "Dashboard",
    "/admin/gestionUsuarios": "Gestión de Usuarios",
    "/admin/empleados": "Gestión de Empleados",
    "/admin/ventasServiciosProceso": "Solicitudes en Proceso",
    "/admin/ventasServiciosFin": "Solicitudes Terminadas",
    "/admin/calendario": "Citas",
    "/admin/pagos": "Pagos",
    "/admin/gestionClientes": "Gestión de Clientes",
    "/admin/roles": "Configuración",
    "/admin/servicios": "Gestión de Servicios",
    "/profile": "Mi Perfil",
  };

  const titulo = titulosPorRuta[location.pathname] || "Panel de Administración";

  return (
    <header className="w-full bg-white flex justify-between items-center px-6 py-3 shadow-sm z-40">
      <h1 className="text-xl font-semibold text-gray-700 tracking-wide">
        {titulo}
      </h1>

      <div className="relative" ref={menuRef}>
        <button
          onClick={toggleMenu}
          aria-expanded={menuAbierto}
          className="bg-gray-200 rounded-full p-2 hover:bg-gray-300 transition duration-200"
        >
          <CgProfile className="w-7 h-7 text-gray-700" />
        </button>

        {menuAbierto && (
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
              onClick={handleCerrarSesion}
              className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-red-100 transition"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </header>
  );
};

export default NavBar;
