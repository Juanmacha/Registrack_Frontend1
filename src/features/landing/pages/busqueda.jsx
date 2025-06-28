import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/Footer";
import authData from "../../auth/services/authData";

const BusquedaAntecedentes = () => {
  const navigate = useNavigate();
  const user = authData.getUser();

  const handleAdquirirServicio = () => {
    if (!user) {
      alert("Debes iniciar sesión para adquirir este servicio.");
      navigate("/login");
    } else {
      navigate("/formulario-busqueda"); // ✅ Asegúrate de tener esta ruta
    }
  };

  return (
    <div className="font-sans bg-white min-h-screen">
      <NavBarLanding />

      <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-8 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 px-4 md:px-10">
          <h4 className="text-gray-500 uppercase tracking-wide mb-2 text-sm font-semibold text-left">
            ¿Qué es la búsqueda de antecedentes?
          </h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight text-left">
            Verifica si tu marca ya existe antes de registrarla.
          </h2>
          <p className="text-gray-600 text-lg mb-6 text-left">
            La búsqueda de antecedentes permite saber si una marca, nombre comercial, logotipo o elemento distintivo ya está registrado o en trámite ante la Superintendencia de Industria y Comercio (SIC), evitando problemas legales.
          </p>
          <p className="text-gray-600 text-lg mb-6 text-left">
            En <span className="font-semibold">Registrack</span> realizamos este proceso de forma <span className="font-semibold">fácil, rápida y sin enredos legales</span> para que protejas tu marca con seguridad.
          </p>

          {/* LISTA DE BENEFICIOS */}
          <ul className="space-y-4 text-gray-700 text-base mb-8">
            {[
              "Evita registrar una marca que ya existe.",
              "Identifica similitudes que puedan generar conflictos.",
              "Asegura viabilidad antes de iniciar el registro.",
              "Análisis por clase o categoría según la SIC.",
              "Asesoría legal completa durante el proceso.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-lg" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* BOTÓN */}
          <div className="w-full text-left pt-2">
            <button
              onClick={handleAdquirirServicio}
              className="bg-blue-700 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-800 transition"
            >
              Adquirir Servicio
            </button>
          </div>
        </div>

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 px-4 mt-10 md:mt-0">
          <img
            src="/images/servicioBusqueda.jpg" // ✅ Asegúrate de tener esta imagen en /public/images/
            alt="Búsqueda de antecedentes de marca"
            className="w-full h-full object-contain animate-float max-h-[500px]"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusquedaAntecedentes;
