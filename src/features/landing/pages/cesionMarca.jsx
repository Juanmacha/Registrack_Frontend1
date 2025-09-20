import React from "react";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/footer";

const CesionMarca = () => {

  return (
    <div className="font-sans bg-white pt-3 md:pt-28">
      <NavBarLanding />

      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-16 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 md:pr-16">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            ¿Qué es la cesión de marca?
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#083874] mb-4 text-left">
            Transfiere legalmente tu marca a otra persona o empresa.
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-3 text-left">
            La cesión de marca es el proceso legal mediante el cual el titular actual de una marca transfiere los derechos de propiedad a un tercero. Esta operación debe registrarse ante la Superintendencia de Industria y Comercio (SIC) para tener validez jurídica.
          </p>
          <p className="text-base md:text-lg text-gray-700 mb-4 text-left">
            En <span className="font-semibold">Registrack</span>, te acompañamos en todo el proceso de forma <span className="font-semibold">clara, segura y sin complicaciones</span>, asegurando que la cesión cumpla con todos los requisitos legales.
          </p>

          <ul className="space-y-3 text-sm text-gray-700 mb-4 pl-0">
            {[
              "Asesoría legal experta durante todo el proceso.",
              "Redacción y validación del contrato de cesión.",
              "Gestión del trámite ante la SIC.",
              "Evita errores que puedan invalidar la transferencia.",
              "Respaldo jurídico para ambas partes involucradas.",
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
            src="/images/servicioCesionMarca.jpeg"
            alt="Cesión de Marca"
            className="w-full max-w-xl h-auto object-contain animate-float rounded-lg shadow-lg"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CesionMarca;
