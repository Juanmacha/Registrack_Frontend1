import React from 'react';

const Hero = () => {
  return (
    <section className="w-full bg-white py-20 px-6">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">

        {/* Lado izquierdo */}
        <div className="flex-1 text-left">
          <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-gray-500 to-yellow-400 bg-clip-text text-transparent pb-3">
            Certimarcas
          </h2>
          <p className="text-blue-600 leading-relaxed text-lg mb-4">
            ¿Tienes una gran idea? Nosotros la protegemos. En Registrack te ayudamos a registrar tu marca de forma fácil, rápida y sin enredos legales. Olvídate de trámites confusos: nos encargamos de todo por ti para que tú te enfoques en hacer crecer tu negocio. ¡Haz que tu marca sea solo tuya, hoy!
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-md text-base font-semibold hover:bg-[#163366] transition-all">
            Conocer más
          </button>
        </div>

        {/* Lado derecho */}
        <div className="flex-1 flex justify-center items-center">
          <img 
            src="/images/logo.png" 
            alt="Certimarcas Ilustración" 
            className="max-w-[300px] w-full h-auto object-contain"
          />
        </div>
      </div>
    </section>
  );
};

export default Hero;

