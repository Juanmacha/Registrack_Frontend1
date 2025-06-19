import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#1a4480] text-white py-10">
      <div className="max-w-6xl mx-auto px-4 text-center space-y-4">
        <h3 className="text-[#F3D259] text-xl font-bold">Registrack</h3>
        <p className="text-sm opacity-90">
          Plataforma inteligente para la gestión de asistencia.
        </p>

        <div className="flex justify-center gap-6 text-sm">
          <Link to="/" className="hover:underline">Clientes</Link>
          <Link to="/servicios" className="hover:underline">Servicios</Link>
          <Link to="/contacto" className="hover:underline">Contacto</Link>
        </div>

        <div className="pt-4 border-t border-[#275FAA] opacity-80 text-xs">
          © 2025 Registrack. Todos los derechos reservados.
        </div>
      </div>
    </footer>
  );
};

export default Footer;
