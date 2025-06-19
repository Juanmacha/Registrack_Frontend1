import React from 'react';
import { Link } from 'react-router-dom';

const LandingNavbar = () => {
  return (
    <nav className="w-full bg-[#275FAA] px-9 py-3">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        
        {/* Logo a la izquierda */}
        <div className="flex items-center space-x-2">
          <span className="text-white font-mono font-bold text-2xl text-yellowCustom">Certimarcas</span>
        </div>

        {/* Links centrados */}
        <div className="hidden md:flex space-x-6 text-white font-medium">
          <a href="#" className="hover:text-yellowCustom">Servicios</a>
          <a href="#" className="hover:text-yellowCustom">Sobre Nosostros</a>
          <a href="#" className="hover:text-yellowCustom">Clientes</a>
          <a href="#" className="hover:text-yellowCustom">Contactanos</a>
        </div>

        {/* Botones a la derecha */}
        <div className="flex space-x-3">
          <button className="text-white no-underline py-2 px-5 rounded-full 
             border border-white/30 transition duration-300 ease-in-out 
             hover:bg-white/10 hover:border-yellowCustom">
            Iniciar sesión
          </button>
          <button className="bg-gradient-to-r from-[#F3D259] to-[#f7e084] text-[#1a4480] no-underline px-6 py-2.5 rounded-full font-bold transition-all duration-300 shadow-[0_4px_15px_rgba(243,210,89,0.3)] hover:-translate-y-0.5 hover:shadow-[0_6px_20px_rgba(243,210,89,0.4)]">
            Registrarse
          </button>
        </div>
      </div>
    </nav>
  );
};

export default LandingNavbar;
