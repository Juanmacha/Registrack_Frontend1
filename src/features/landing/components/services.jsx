import React, { useState } from 'react';
import servicesData from "../services/servicesData";


const Services = () => {
  const [current, setCurrent] = useState(0);

  const nextSlide = () => setCurrent((prev) => (prev + 1) % servicesData.length);
  const prevSlide = () => setCurrent((prev) => (prev - 1 + servicesData.length) % servicesData.length);

  return (
    <div className="py-20 bg-gradient-to-br from-[#275FAA] to-[#1a4480] text-white">
      <h2 className="text-center text-3xl font-bold text-[#F3D259] mb-12">Nuestros Servicios</h2>

      <div className="relative max-w-xl mx-auto">
        <div className="bg-white/10 p-8 rounded-xl backdrop-blur-md border border-white/20 shadow-md text-center transition-all duration-500">
          <h3 className="text-[#F3D259] text-xl font-semibold mb-4">
            {servicesData[current].title}
          </h3>
          <p className="text-white/90">{servicesData[current].description}</p>
          <button className="mt-6 bg-gradient-to-r from-[#F3D259] to-[#f7e084] text-[#1a4480] px-6 py-2 rounded-full font-bold hover:scale-105 transition-transform">
            Adquirir Servicio
          </button>
        </div>

        <div className="flex justify-between mt-6 px-4">
          <button onClick={prevSlide} className="text-[#F3D259] text-2xl font-bold">←</button>
          <button onClick={nextSlide} className="text-[#F3D259] text-2xl font-bold">→</button>
        </div>
      </div>
    </div>
  );
};

export default Services;
