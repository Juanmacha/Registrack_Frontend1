import React from "react";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/footer";

const BusquedaAntecedentes = () => {

  return (
    <div className="font-sans bg-white pt-3 md:pt-28">
      <NavBarLanding />

      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-16 bg-white">
        <div className="w-full md:w-1/2 pr-0 md:pr-16">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            ¿Qué es la búsqueda de antecedentes?
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#083874] mb-4 text-left">
            Protege tu marca antes de registrarla
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-4 text-left">
            La búsqueda de antecedentes permite saber si una marca, nombre comercial, logotipo o elemento distintivo ya está registrado o en trámite ante la SIC.
          </p>

          <ul className="space-y-3 text-sm text-gray-700 mb-4 pl-0">
            {[
              "Evita registrar una marca que ya existe.",
              "Identifica similitudes que puedan generar conflictos.",
              "Asegura viabilidad antes de iniciar el registro.",
              "Análisis por clase o categoría según la SIC.",
              "Asesoría legal completa durante el proceso.",
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

        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioBusqueda.jpg"
            alt="Búsqueda de antecedentes"
            className="w-full max-w-xl h-auto object-contain animate-float rounded-lg shadow-lg"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusquedaAntecedentes;
