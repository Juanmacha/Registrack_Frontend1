import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/Footer";
import authData from "../../auth/services/authData";

const AmpliacionServicios = () => {
  const navigate = useNavigate();
  const user = authData.getUser();

  const handleAdquirirServicio = () => {
    if (!user) {
      alert("Debes iniciar sesión para adquirir este servicio.");
      navigate("/login");
    } else {
      navigate("/formulario-ampliacion"); // ✅ Cambia esta ruta a la correcta
    }
  };

  return (
    <div className="font-sans bg-white min-h-screen">
      <NavBarLanding />

      <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-8 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 px-4 md:px-10">
          <h4 className="text-gray-500 uppercase tracking-wide mb-2 text-sm font-semibold text-left">
            ¿Qué es la ampliación de servicios?
          </h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight text-left">
            Expande el alcance de tu marca registrada.
          </h2>
          <p className="text-gray-600 text-lg mb-6 text-left">
            La ampliación de servicios es un trámite ante la Superintendencia de Industria y Comercio (SIC) que permite incluir nuevas clases de productos o servicios en una marca ya registrada. Así, tu protección legal se extiende a más áreas de negocio.
          </p>
          <p className="text-gray-600 text-lg mb-6 text-left">
            Por ejemplo, si tu marca cubre ropa y ahora quieres vender perfumes, necesitas ampliar la cobertura para garantizar tu exclusividad comercial.
          </p>

          {/* LISTA DE BENEFICIOS */}
          <ul className="space-y-4 text-gray-700 text-base mb-8">
            {[
              "Evita conflictos legales al expandir tu marca.",
              "Protección en nuevas clases de productos o servicios.",
              "Asesoría personalizada para tu ampliación.",
              "Gestión completa ante la Superintendencia de Industria y Comercio (SIC).",
              "Acompañamiento legal durante todo el proceso.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-lg" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          {/* BOTÓN DE ACCIÓN */}
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
            src="/images/servicioAmpliacion.jpg" // ✅ Asegúrate de tener esta imagen en tu carpeta pública
            alt="Ampliación de servicios"
            className="w-full h-full object-contain animate-float max-h-[500px]"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default AmpliacionServicios;
