import React, { useState, useEffect } from 'react';
import servicesData from '../services/servicesData';

const Services = () => {
  const [current, setCurrent] = useState(0);
  const visibleCards = 3;

  const nextSlide = () => {
    setCurrent((prev) => (prev + visibleCards) % servicesData.length);
  };

  const prevSlide = () => {
    setCurrent((prev) =>
      (prev - visibleCards + servicesData.length) % servicesData.length
    );
  };

  const getVisibleServices = () => {
    const start = current;
    const end = current + visibleCards;

    if (end > servicesData.length) {
      return [
        ...servicesData.slice(start),
        ...servicesData.slice(0, end % servicesData.length),
      ];
    }

    return servicesData.slice(start, end);
  };

  // ⏱️ Auto-avance cada 3 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="py-20 bg-white text-[#1a1a1a] relative">
      <h2 className="text-center text-3xl font-bold mb-12">Nuestros Servicios</h2>

      <div className="relative max-w-7xl mx-auto flex items-center justify-center px-4">

        {/* Flecha izquierda */}
        <button
          onClick={prevSlide}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-blue text-[#1a4480] p-3 rounded-full shadow-md hover:bg-[#1a4480] transition-all z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
        </button>

        {/* Cards */}
        <div className="flex gap-6 justify-center w-full transition-all duration-500 min-h-[320px]">
          {getVisibleServices().map((service, index) => (
            <div
              key={index}
              className="bg-white border border-gray-300 rounded-xl shadow-md p-6 text-center w-full max-w-sm min-h-[300px] flex flex-col justify-between transition-transform duration-300 hover:-translate-y-2"
            >
              <div>
                <h3 className="font-bold text-lg mb-2 border-b pb-1">{service.title}</h3>
                <p className="text-sm text-gray-700">{service.description}</p>
              </div>
              <button className="mt-6 bg-[#1a4480] text-white px-5 py-2 rounded font-semibold hover:bg-[#163366] transition-all">
                Adquirir Servicio
              </button>
            </div>
          ))}
        </div>

        {/* Flecha derecha */}
        <button
          onClick={nextSlide}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-blue text-[#1a4480] p-3 rounded-full shadow-md hover:bg-[#1a4480] transition-all z-10"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            strokeWidth={2} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
          </svg>
        </button>
      </div>
    </section>
  );
};

export default Services;

