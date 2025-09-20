import React from "react";
import { FaCheck } from "react-icons/fa";
import LandingNavbar from "../components/landingNavbar";
import Footer from "../components/footer";

const PresentacionOposicion = () => {

  return (
    <div className="font-sans bg-white pt-3 md:pt-28">
      <LandingNavbar />

      {/* Presentación de oposición */}
      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-16 bg-white border-b">
        <div className="w-full md:w-1/2 md:pr-16">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            Servicio legal
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#083874] mb-4 text-left">
            Presentación de Oposición
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-3 text-left">
            Si detectas que una marca en trámite es similar a la tuya, puedes presentar una oposición para evitar conflictos legales y proteger tu identidad comercial.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4 text-left">
            En <span className="font-semibold">Registrack</span>, nos encargamos del análisis, redacción legal y presentación ante la SIC para defender tu marca.
          </p>

          <ul className="space-y-3 text-sm text-gray-700 mb-4 pl-0">
            {[
              "Evaluación de riesgos y similitudes entre marcas.",
              "Fundamentación legal sólida y personalizada.",
              "Presentación ante la SIC y seguimiento del trámite.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-lg" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
            Adquirir Presentación
          </button>
        </div>

        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioOposicion.jpeg"
            alt="Presentación de Oposición"
            className="w-full max-w-xl h-auto object-contain animate-float rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Respuesta a oposición */}
      <section className="w-full flex flex-col md:flex-row-reverse items-center justify-between px-8 md:px-16 lg:px-32 py-16 bg-white">
        <div className="w-full md:w-1/2 md:pl-16">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            Defensa de marca
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#083874] mb-4 text-left">
            Respuesta a Oposición
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-3 text-left">
            Si tu solicitud de registro fue objetada por otra marca, tienes el derecho a responder para proteger tu propuesta.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4 text-left">
            Con <span className="font-semibold">Certimarcas</span>, redactamos tu defensa con argumentos sólidos y realizamos el trámite completo ante la SIC.
          </p>

          <ul className="space-y-3 text-sm text-gray-700 mb-4 pl-0">
            {[
              "Análisis legal detallado de la oposición recibida.",
              "Preparación del documento de respuesta formal.",
              "Presentación y seguimiento ante la SIC.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-lg" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
            Adquirir Respuesta
          </button>
        </div>

        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioRespuesta.jpeg"
            alt="Respuesta a Oposición"
            className="w-full max-w-xl h-auto object-contain animate-float rounded-lg shadow-lg"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PresentacionOposicion;
