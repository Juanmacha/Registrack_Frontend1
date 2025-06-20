import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-[#f8fafc] text-[#1a1a1a] py-10 border-t border-gray-200">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-10 items-center">

        {/* Logo y descripción */}
        <div>
          <h3 className="text-2xl text-left font-bold mb-2">Certimarcas</h3>
          <p className="text-sm text-left text-gray-700">
            Vivamus congue nibh nisl, a vestibulum lectus vehicula id. Nulla vitae mi sed odio tristique mollis. Aliquam et dio in massa ultricies, vel sagittis urna congue.
          </p>
        </div>

        {/* Información de contacto */}
        <div className="text-sm text-gray-700 space-y-1">
          <h4 className="font-semibold italic mb-2">Información de contacto</h4>
          <p>📍 Dirección: Calle 123 #45-67, Bogotá</p>
          <p>📞 Teléfono: +57 300 123 4567</p>
          <p>📧 Email: contacto@registrack.com</p>
          <p>⏰ Horario: Lun - Vie: 8am - 6pm</p>
          <p>🌐 Sitio web: www.registrack.com</p>
        </div>

        {/* Mapa de Google */}
        <div className="w-full h-40 md:h-48 rounded overflow-hidden shadow">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3976.998137202161!2d-74.08083398523832!3d4.598055843615393!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e3f99a8cc405b65%3A0x87605ebfd4f3e0c2!2sPlaza%20de%20Bol%C3%ADvar!5e0!3m2!1ses!2sco!4v1683833298826!5m2!1ses!2sco"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

      </div>

      {/* Línea inferior */}
      <div className="text-center text-xs text-gray-500 mt-8 pt-4 border-t border-gray-300">
        © 2025 Certimarcas. Todos los derechos reservados.
      </div>
    </footer>
  );
};

export default Footer;
