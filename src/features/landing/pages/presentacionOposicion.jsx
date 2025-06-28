import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import LandingNavbar from "../components/landingNavbar";
import Footer from "../components/Footer";
import authData from "../../auth/services/authData";

const PresentacionOposicion = () => {
  const navigate = useNavigate();
  const user = authData.getUser();

  const handleAdquirirPresentacion = () => {
    if (!user) {
      alert("Debes iniciar sesión para adquirir este servicio.");
      navigate("/login");
    } else {
      navigate("/formulario-oposicion"); // ✅ Reemplaza con tu ruta real
    }
  };

  const handleAdquirirRespuesta = () => {
    if (!user) {
      alert("Debes iniciar sesión para adquirir este servicio.");
      navigate("/login");
    } else {
      navigate("/formulario-respuesta-oposicion"); // ✅ Reemplaza con tu ruta real
    }
  };

  return (
    <div className="font-sans bg-white min-h-screen">
      <LandingNavbar />

      {/* Presentación de oposición */}
      <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-12 bg-white border-b">
        <div className="w-full md:w-1/2 px-4 md:px-10">
          <h4 className="text-gray-500 uppercase tracking-wide mb-2 text-sm font-semibold text-left">
            Servicio legal
          </h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight text-left">
            Presentación de Oposición
          </h2>
          <p className="text-gray-600 text-lg mb-6 text-left">
            Si detectas que una marca en trámite es similar a la tuya, puedes presentar una oposición para evitar conflictos legales y proteger tu identidad comercial.
          </p>
          <p className="text-gray-600 text-lg mb-6 text-left">
            En <span className="font-semibold">Registrack</span>, nos encargamos del análisis, redacción legal y presentación ante la SIC para defender tu marca.
          </p>

          <ul className="space-y-4 text-gray-700 text-base mb-8">
            {[
              "Evaluación de riesgos y similitudes entre marcas.",
              "Fundamentación legal sólida y personalizada.",
              "Presentación ante la SIC y seguimiento del trámite.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-lg" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleAdquirirPresentacion}
            className="bg-blue-700 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-800 transition"
          >
            Adquirir Presentación
          </button>
        </div>

        <div className="w-full md:w-1/2 px-4 mt-10 md:mt-0">
          <img
            src="/images/servicioOposicion.jpeg" // ✅ Cambia por tu imagen real
            alt="Presentación de Oposición"
            className="w-full h-full object-contain animate-float max-h-[500px]"
          />
        </div>
      </section>

      {/* Respuesta a oposición */}
      <section className="w-full flex flex-col md:flex-row-reverse items-center justify-between px-6 py-12 bg-white">
        <div className="w-full md:w-1/2 px-4 md:px-10">
          <h4 className="text-gray-500 uppercase tracking-wide mb-2 text-sm font-semibold text-left">
            Defensa de marca
          </h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight text-left">
            Respuesta a Oposición
          </h2>
          <p className="text-gray-600 text-lg mb-6 text-left">
            Si tu solicitud de registro fue objetada por otra marca, tienes el derecho a responder para proteger tu propuesta.
          </p>
          <p className="text-gray-600 text-lg mb-6 text-left">
            Con <span className="font-semibold">Certimarcas</span>, redactamos tu defensa con argumentos sólidos y realizamos el trámite completo ante la SIC.
          </p>

          <ul className="space-y-4 text-gray-700 text-base mb-8">
            {[
              "Análisis legal detallado de la oposición recibida.",
              "Preparación del documento de respuesta formal.",
              "Presentación y seguimiento ante la SIC.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-lg" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleAdquirirRespuesta}
            className="bg-blue-700 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-800 transition"
          >
            Adquirir Respuesta
          </button>
        </div>

        <div className="w-full md:w-1/2 px-4 mt-10 md:mt-0">
          <img
            src="/images/servicioRespuesta.jpeg" // ✅ Cambia por tu imagen real
            alt="Respuesta a Oposición"
            className="w-full h-full object-contain animate-float max-h-[500px]"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default PresentacionOposicion;
