import React from 'react';
import { useNavigate } from 'react-router-dom';
import servicesData from '../services/servicesData';

const Services = () => {
  const navigate = useNavigate(); // 👈 Hook de navegación

  return (
    <section id="services" className="py-20 bg-white text-[#1a1a1a]">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-center text-3xl font-bold text-[#1a4480] mb-12">Nuestros Servicios</h2>

        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {servicesData.map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden flex flex-col transition-transform duration-300 hover:-translate-y-2"
            >
              <img
                src={service.image}
                alt={service.title}
                className="w-full h-44 object-cover"
              />

              <div className="p-6 flex flex-col justify-between flex-grow">
                <h3 className="font-bold text-[#1a4480] text-lg mb-2">{service.title}</h3>
                <p className="text-sm text-gray-700 flex-grow">{service.description}</p>
                
                {/* Botón redirige a la ruta específica */}
                <button
                  onClick={() => navigate(service.path)}
                  className="mt-6 bg-blue-600 text-white px-5 py-2 rounded font-semibold hover:bg-[#163366] transition-all"
                >
                  Saber más
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Services;
