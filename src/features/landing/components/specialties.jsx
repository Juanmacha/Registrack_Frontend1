import React from 'react';
import { Check } from 'lucide-react'; // O usa cualquier ícono

const Specialties = () => {
  return (
    <section id="specialties" className="bg-[#275FAA] py-20 px-6">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
        
        {/* Lado izquierdo - texto */}
        <div>
          <p className="text-left text-sm font-semibold text-gray-500 uppercase mb-2">¿Quiénes somos?</p>
          <h2 className="text-left text-3xl md:text-4xl font-bold text-[#1a1a1a] mb-4">
            Protegiendo ideas, <br /> impulsando marcas.
          </h2>
          <p className="text-left text-gray-700 text-base mb-6">
            Con más de 12 años de experiencia, en Registrack te acompañamos paso a paso para registrar, proteger y certificar tu marca, tanto a nivel nacional como internacional.
          </p>

          {/* Lista de beneficios */}
          <ul className="space-y-4">
            <li className="flex items-start gap-3">
              <Check className="text-[#275FAA]" size={20} />
              <span className="text-gray-700">Asesoría personalizada para cada proceso de registro de marca.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-[#275FAA]" size={20} />
              <span className="text-gray-700">Trámite ágil, legal y garantizado ante la Cámara de Comercio.</span>
            </li>
            <li className="flex items-start gap-3">
              <Check className="text-[#275FAA]" size={20} />
              <span className="text-gray-700">Precios accesibles y métodos de pago flexibles.</span>
            </li>
          </ul>
        </div>

        {/* Lado derecho - imagen */}
        <div className="flex justify-center">
          <img
            src="/images/certificateNo.PNG" // Reemplaza por tu imagen real
            alt="Certificados"
            className="max-w-full h-auto"
          />
        </div>
      </div>
    </section>
  );
};

export default Specialties;
