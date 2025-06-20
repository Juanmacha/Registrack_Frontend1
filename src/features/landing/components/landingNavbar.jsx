import React from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  return (
    <nav className="w-full bg-white shadow border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between relative">

        {/* Logo a la izquierda */}
        <div className="flex items-center">
          <img src="/images/logo.jpeg" alt="Logo" className="h-11" />
        </div>

        {/* Links centrados */}
        <div className="absolute left-1/2 transform -translate-x-1/2 hidden md:flex space-x-6 text-sm font-medium text-gray-800">
          <a href="#" className="hover:text-yellow-500">Servicios</a>
          <a href="#" className="hover:text-yellow-500">Sobre Nosotros</a>
          <a href="#" className="hover:text-yellow-500">Clientes</a>
          <a href="#" className="hover:text-yellow-500">Contáctanos</a>
        </div>

        {/* Botones a la derecha */}
        <div className="flex space-x-2">
          <button className="bg-[#1a4480] text-white px-4 py-1.5 rounded text-sm font-medium hover:opacity-90">
            Iniciar sesión
          </button>
          <button className="border border-[#1a4480] text-[#1a4480] px-4 py-1.5 rounded text-sm font-medium hover:bg-[#1a4480]/10">
            Registrarse
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
