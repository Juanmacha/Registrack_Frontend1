import React from "react";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/footer";

const AmpliacionServicios = () => {

  return (
    <div className="font-sans bg-white pt-3 md:pt-28">
      <NavBarLanding />

      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-16 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 pr-0 md:pr-16">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            ¿Qué es la ampliación de servicios?
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#083874] mb-4 text-left">
            Expande el alcance de tu marca registrada
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-3 text-left">
            La ampliación de servicios permite incluir nuevas clases de productos o servicios en una marca ya registrada, extendiendo tu protección legal a más áreas de negocio.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4 text-left">
            Por ejemplo, si tu marca cubre ropa y ahora quieres vender perfumes, necesitas ampliar la cobertura para garantizar tu exclusividad comercial.
          </p>

          <ul className="space-y-3 text-sm text-gray-700 mb-4 pl-0">
            {[
              "Evita conflictos legales al expandir tu marca.",
              "Protección en nuevas clases de productos o servicios.",
              "Asesoría personalizada para tu ampliación.",
              "Gestión completa ante la Superintendencia de Industria y Comercio (SIC).",
              "Acompañamiento legal durante todo el proceso.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-lg" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="text-left">
            <button className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
              Adquirir Servicio
            </button>
          </div>
        </div>

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioAmpliacion.jpg"
            alt="Ampliación de servicios"
            className="w-full max-w-xl h-auto object-contain animate-float rounded-lg shadow-lg"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AmpliacionServicios;
