import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/Footer";
import authData from "../../auth/services/authData";

const CesionMarca = () => {
  const navigate = useNavigate();
  const user = authData.getUser();

  const handleAdquirirServicio = () => {
    if (!user) {
      alert("Debes iniciar sesión para adquirir este servicio.");
      navigate("/login");
    } else {
      navigate("/formulario-cesion"); // ✅ Asegúrate de tener esta ruta en tu app
    }
  };

  return (
    <div className="font-sans bg-white min-h-screen">
      <NavBarLanding />

      <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-8 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 px-4 md:px-10">
          <h4 className="text-gray-500 uppercase tracking-wide mb-2 text-sm font-semibold text-left">
            ¿Qué es la cesión de marca?
          </h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight text-left">
            Transfiere legalmente tu marca a otra persona o empresa.
          </h2>
          <p className="text-gray-600 text-lg mb-6 text-left">
            La cesión de marca es el proceso legal mediante el cual el titular actual de una marca transfiere los derechos de propiedad a un tercero. Esta operación debe registrarse ante la Superintendencia de Industria y Comercio (SIC) para tener validez jurídica.
          </p>
          <p className="text-gray-600 text-lg mb-6 text-left">
            En <span className="font-semibold">Registrack</span>, te acompañamos en todo el proceso de forma <span className="font-semibold">clara, segura y sin complicaciones</span>, asegurando que la cesión cumpla con todos los requisitos legales.
          </p>

          {/* LISTA DE BENEFICIOS */}
          <ul className="space-y-4 text-gray-700 text-base mb-8">
            {[
              "Asesoría legal experta durante todo el proceso.",
              "Redacción y validación del contrato de cesión.",
              "Gestión del trámite ante la SIC.",
              "Evita errores que puedan invalidar la transferencia.",
              "Respaldo jurídico para ambas partes involucradas.",
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
            src="/images/servicioCesionMarca.jpeg" // ✅ Asegúrate de tener esta imagen
            alt="Cesión de Marca"
            className="w-full h-full object-contain animate-float max-h-[500px]"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default CesionMarca;
