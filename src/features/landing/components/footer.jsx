import React from "react";

const Footer = () => {
  return (
    <footer id="footer" className="bg-[#275FAA] mt-20 py-12 px-6 flex justify-center">
      <div className="w-full max-w-screen-xl bg-white rounded-xl shadow-md hover:shadow-xl transition flex flex-col md:flex-row overflow-hidden">
        {/* Columna izquierda */}
        <div className="w-full md:w-1/2 px-8 py-6 space-y-4">
          <img
            src="/images/logoNombre.png"
            alt="Logo Certimarcas"
            className="h-20 w-auto object-contain"
          />
          <p className="text-gray-700 text-sm text-left">
            Somos una empresa con más de 12 años de experiencia en propiedad industrial. Asesoramos y gestionamos el registro, certificación y protección de marcas a nivel nacional e internacional.
          </p>
          <div className="text-sm text-gray-600 space-y-1 text-left">
            <p><strong>Dirección:</strong> Edificio La Ceiba, Local 329, Medellín, Colombia</p>
            <p><strong>Teléfono:</strong> +57 300 123 4567</p>
            <p><strong>Correo:</strong> contacto@certimarcas.com</p>
            <p><strong>Horario:</strong> Lunes a Viernes, 8:00am - 6:00pm</p>
          </div>
        </div>

        {/* Columna derecha: Mapa */}
        <div className="w-full md:w-1/2 h-[350px] md:h-auto">
          <iframe
            title="Ubicación de Certimarcas"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3966.105743060737!2d-75.56839422459778!3d6.249795093738652!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x8e4428f88b4de16d%3A0x45f359438a277bf0!2sEdificio%20La%20Ceiba!5e0!3m2!1ses!2sco!4v1750586091044!5m2!1ses!2sco"
            className="w-full h-full border-0"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
