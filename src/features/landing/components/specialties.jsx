import React from 'react';

const Specialties = () => {
  return (
    <section className="bg-[#275FAA] py-20 px-6">
      <div className="max-w-7xl mx-auto">

        {/* Título */}
        <h2 className="text-3xl md:text-4xl font-bold text-center text-white mb-12">
          Especialidades
        </h2>

        {/* Contenedor de tarjetas */}
        <div className="grid gap-8 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">

          {/* Card 1 */}
          <div className="relative bg-white p-6 rounded-xl text-center border border-[#275faa1a] shadow-[0_10px_40px_rgba(39,95,170,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(39,95,170,0.15)] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#275FAA] to-[#F3D259]"></div>
            <h3 className="font-bold text-[#1a1a1a] mb-2">¿Quiénes somos?</h3>
            <p className="text-gray-700 text-sm">
              En Certimarcas, somos especialistas en la certificación de marcas. Actuamos como intermediarios ante la Cámara de Industria y Comercio, asegurando que el proceso de registro, renovación y protección de tu marca sea ágil, seguro y sin complicaciones.
            </p>
          </div>

          {/* Card 2 */}
          <div className="relative bg-white p-6 rounded-xl text-center border border-[#275faa1a] shadow-[0_10px_40px_rgba(39,95,170,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(39,95,170,0.15)] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#275FAA] to-[#F3D259]"></div>
            <h3 className="font-bold text-[#1a1a1a] mb-2">Nuestra misión</h3>
            <p className="text-gray-700 text-sm">
              Nuestro objetivo es proteger la identidad comercial de emprendedores y empresas, ofreciendo un servicio transparente, eficiente y con acompañamiento en cada etapa del proceso.
            </p>
          </div>

          {/* Card 3 */}
          <div className="relative bg-white p-6 rounded-xl text-center border border-[#275faa1a] shadow-[0_10px_40px_rgba(39,95,170,0.1)] transition-all duration-300 hover:-translate-y-2.5 hover:shadow-[0_20px_60px_rgba(39,95,170,0.15)] overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#275FAA] to-[#F3D259]"></div>
            <h3 className="font-bold text-[#1a1a1a] mb-2">¿Por qué elegirnos?</h3>
            <p className="text-gray-700 text-sm">Contamos con experiencia y conocimiento en certificación de marcas.</p>
            <p className="text-gray-700 text-sm mt-2">Nos encargamos de todo el trámite legal, sin estrés para ti.</p>
            <p className="text-gray-700 text-sm mt-2">Brindamos protección legal garantizada para tu marca.</p>
            <p className="text-gray-700 text-sm mt-2">Ofrecemos atención personalizada en cada paso del proceso.</p>
          </div>

        </div>
      </div>
    </section>
  );
};

export default Specialties;
