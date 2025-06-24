import React, { useState } from "react";
import { CgProfile } from "react-icons/cg";
import { useNavigate } from "react-router-dom";
import authData from "../../auth/services/authData"; // Asegúrate de tener esto si usas una función de logout

const NavBar = ({ titulo }) => {
  const [menuAbierto, setMenuAbierto] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setMenuAbierto(!menuAbierto);
  };

  const handleVerPerfil = () => {
    setMenuAbierto(false); // Cierra el menú
    navigate("/profile");
  };

  const handleCerrarSesion = () => {
    setMenuAbierto(false); // Cierra el menú
    authData.removeToken(); // Si manejas auth, realiza logout
    navigate("/login");
  };

  return (
    <div className="w-full bg-white flex justify-between items-center px-6 py-3 hover:shadow-2xl transition-shadow duration-300 z-40">
      {/* Título dinámico a la izquierda */}
      <h1 className="text-xl font-semibold text-gray-700">{titulo}</h1>

      {/* Icono de perfil como botón */}
      <div className="relative">
        <button
          onClick={toggleMenu}
          className="bg-gray-200 focus:outline-none rounded-full hover:bg-gray-300 p-2 transition duration-200"
        >
          <CgProfile className="w-7 h-7 text-gray-700" />
        </button>

        {/* Menú desplegable */}
        {menuAbierto && (
          <div className="absolute right-0 mt-2 w-44 bg-white border border-white-200 rounded-xl shadow-lg z-10 overflow-hidden">
            <button
              onClick={handleVerPerfil}
              className="block w-full text-left bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-blue-500 hover:text-white"
            >
              Ver perfil
            </button>
            <button
              onClick={handleCerrarSesion}
              className="block w-full text-left bg-gray-200 px-4 py-2 text-sm text-gray-700 hover:bg-red-500 hover:text-white"
            >
              Cerrar sesión
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NavBar;
