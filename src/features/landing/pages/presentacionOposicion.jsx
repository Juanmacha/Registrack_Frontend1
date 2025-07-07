import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import LandingNavbar from "../components/landingNavbar";
import Footer from "../components/footer";
import authData from "../../auth/services/authData";
import FormularioBaseModal from "../../../shared/layouts/FormularioBase";
import FormularioPresentacionOposicion from "../../../shared/components/formularioOposicion";
import FormularioRespuestaOposicion from "../../../shared/components/formularioRespuesta";

const PresentacionOposicion = () => {
  const navigate = useNavigate();
  const user = authData.getUser();

  const [modalPresentacion, setModalPresentacion] = useState(false);
  const [modalRespuesta, setModalRespuesta] = useState(false);

  const handleAdquirirPresentacion = () => {
    if (!user) {
      alert("Debes iniciar sesión para adquirir este servicio.");
      navigate("/login");
    } else {
      setModalPresentacion(true);
    }
  };

  const handleAdquirirRespuesta = () => {
    if (!user) {
      alert("Debes iniciar sesión para adquirir este servicio.");
      navigate("/login");
    } else {
      setModalRespuesta(true);
    }
  };

  return (
    <div className="font-sans bg-white pt-28">
      <LandingNavbar />

      {/* Presentación de oposición */}
      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-24 py-10 bg-white border-b">
        <div className="w-full md:w-1/2 md:pr-12">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            Servicio legal
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#083874] mb-4 text-left">
            Presentación de Oposición
          </h1>
          <p className="text-base text-gray-700 mb-4 text-left">
            Si detectas que una marca en trámite es similar a la tuya, puedes presentar una oposición para evitar conflictos legales y proteger tu identidad comercial.
          </p>
          <p className="text-base text-gray-700 mb-6 text-left">
            En <span className="font-semibold">Registrack</span>, nos encargamos del análisis, redacción legal y presentación ante la SIC para defender tu marca.
          </p>

          <ul className="space-y-3 text-base text-gray-700 mb-6">
            {[
              "Evaluación de riesgos y similitudes entre marcas.",
              "Fundamentación legal sólida y personalizada.",
              "Presentación ante la SIC y seguimiento del trámite.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-sm" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleAdquirirPresentacion}
            className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-base hover:bg-blue-800 transition"
          >
            Adquirir Presentación
          </button>
        </div>

        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioOposicion.jpeg"
            alt="Presentación de Oposición"
            className="w-full max-w-md h-auto object-contain animate-float"
          />
        </div>
      </section>

      {/* Respuesta a oposición */}
      <section className="w-full flex flex-col md:flex-row-reverse items-center justify-between px-6 md:px-12 lg:px-24 py-10 bg-white">
        <div className="w-full md:w-1/2 md:pl-12">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            Defensa de marca
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#083874] mb-4 text-left">
            Respuesta a Oposición
          </h1>
          <p className="text-base text-gray-700 mb-4 text-left">
            Si tu solicitud de registro fue objetada por otra marca, tienes el derecho a responder para proteger tu propuesta.
          </p>
          <p className="text-base text-gray-700 mb-6 text-left">
            Con <span className="font-semibold">Certimarcas</span>, redactamos tu defensa con argumentos sólidos y realizamos el trámite completo ante la SIC.
          </p>

          <ul className="space-y-3 text-base text-gray-700 mb-6">
            {[
              "Análisis legal detallado de la oposición recibida.",
              "Preparación del documento de respuesta formal.",
              "Presentación y seguimiento ante la SIC.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-sm" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleAdquirirRespuesta}
            className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-base hover:bg-blue-800 transition"
          >
            Adquirir Respuesta
          </button>
        </div>

        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioRespuesta.jpeg"
            alt="Respuesta a Oposición"
            className="w-full max-w-md h-auto object-contain animate-float"
          />
        </div>
      </section>

      <Footer />

      {/* MODALES */}
      {modalPresentacion && (
        <FormularioBaseModal onClose={() => setModalPresentacion(false)}>
          <FormularioPresentacionOposicion />
        </FormularioBaseModal>
      )}

      {modalRespuesta && (
        <FormularioBaseModal onClose={() => setModalRespuesta(false)}>
          <FormularioRespuestaOposicion />
        </FormularioBaseModal>
      )}
    </div>
  );
};

export default PresentacionOposicion;
