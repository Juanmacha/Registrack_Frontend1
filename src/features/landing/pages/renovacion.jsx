import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import LandingNavbar from "../components/landingNavbar";
import Footer from "../components/Footer";
import authData from "../../auth/services/authData";

const RenovacionMarca = () => {
  const navigate = useNavigate();
  const user = authData.getUser();

  const handleAdquirirServicio = () => {
    if (!user) {
      alert("Debes iniciar sesión para adquirir este servicio.");
      navigate("/login");
    } else {
      navigate("/checkout/renovacion"); // Ajusta esta ruta según tu flujo real
    }
  };

  return (
    <div className="font-sans bg-white min-h-screen">
      <LandingNavbar />

      <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-12 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 px-4 md:px-10">
          <h4 className="text-gray-500 uppercase tracking-wide mb-2 text-sm font-semibold text-left">
            Protección continua
          </h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight text-left">
            Renovación de Marca
          </h2>
          <p className="text-gray-600 text-lg mb-6 text-left">
            Renovar tu marca a tiempo garantiza que sigas disfrutando de su protección legal. En <span className="font-semibold">Registrack</span>, hacemos el proceso rápido y sin estrés.
          </p>
          <p className="text-gray-600 text-lg mb-6 text-left">
            Verificamos los tiempos, gestionamos la documentación y presentamos la solicitud ante la <span className="font-semibold">Superintendencia de Industria y Comercio</span> (SIC).
          </p>
          <p className="text-gray-600 text-lg mb-6 text-left">
            No dejes vencer tu registro. Una marca vencida puede ser reclamada por terceros.
          </p>

          <ul className="space-y-4 text-gray-700 text-base mb-8">
            {[
              "Asesoría sobre vencimientos y requisitos.",
              "Preparación y envío de la documentación.",
              "Presentación ante la SIC.",
              "Seguimiento del trámite y entrega de constancia.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-yellow-100 text-yellow-600 rounded-full mt-1">
                  <FaCheck className="text-lg" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <button
            onClick={handleAdquirirServicio}
            className="bg-yellow-500 hover:bg-yellow-600 text-white px-8 py-3 rounded-md text-lg transition"
          >
            Adquirir Servicio
          </button>
        </div>

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 px-4 mt-10 md:mt-0">
          <img
            src="/images/servicioRenovacion.jpeg" // Asegúrate de tener esta imagen en /public/images/
            alt="Renovación de Marca"
            className="w-full h-full object-contain animate-float max-h-[500px]"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RenovacionMarca;
