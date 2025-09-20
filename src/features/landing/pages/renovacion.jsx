import React from "react";
import { FaCheck } from "react-icons/fa";
import LandingNavbar from "../components/landingNavbar";
import Footer from "../components/footer";

const RenovacionMarca = () => {

  return (
    <div className="font-sans bg-white pt-3 md:pt-28">
      <LandingNavbar />

      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-16 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 md:pr-16">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            Protección continua
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#083874] mb-4 text-left">
            Renovación de Marca
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-3 text-left">
            Renovar tu marca a tiempo garantiza que sigas disfrutando de su protección legal. En{" "}
            <span className="font-semibold">Registrack</span>, hacemos el proceso rápido y sin estrés.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-3 text-left">
            Verificamos los tiempos, gestionamos la documentación y presentamos la solicitud ante la{" "}
            <span className="font-semibold">Superintendencia de Industria y Comercio</span> (SIC).
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4 text-left">
            No dejes vencer tu registro. Una marca vencida puede ser reclamada por terceros.
          </p>

          {/* LISTA DE BENEFICIOS */}
          <ul className="space-y-3 text-sm text-gray-700 mb-4 pl-0">
            {[
              "Asesoría sobre vencimientos y requisitos.",
              "Preparación y envío de la documentación.",
              "Presentación ante la SIC.",
              "Seguimiento del trámite y entrega de constancia.",
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
            Adquirir Servicio
          </button>
        </div>

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioRenovacion.jpeg"
            alt="Renovación de Marca"
            className="w-full max-w-xl h-auto object-contain animate-float rounded-lg shadow-lg"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RenovacionMarca;
