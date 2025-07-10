import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/footer";
import authData from "../../auth/services/authData";
import FormularioBaseModal from "../../../shared/layouts/FormularioBase";
import FormularioAmpliacion from "../../../shared/components/formularioAmpliacion"; // ✅ Asegúrate de que este componente exista
import { useScrollToTop } from "../../../utils/hooks/useScrollToTop";
import { crearVenta } from '../../dashboard/pages/gestionVentasServicios/services/ventasService';

const AmpliacionServicios = () => {
  const navigate = useNavigate();
  const user = authData.getUser();
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Forzar scroll al inicio de la página
  useScrollToTop();

  const handleAdquirirServicio = () => {
    if (!user) {
      alert("Debes iniciar sesión para adquirir este servicio.");
      navigate("/login");
    } else {
      setMostrarModal(true);
    }
  };

  return (
    <div className="font-sans bg-white pt-20">
      <NavBarLanding />

      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-24 py-10 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 pr-0 md:pr-12">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            ¿Qué es la ampliación de servicios?
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#083874] mb-4 text-left">
            Expande el alcance de tu marca registrada
          </h1>
          <p className="text-base text-gray-700 mb-4 text-left">
            La ampliación de servicios permite incluir nuevas clases de productos o servicios en una marca ya registrada, extendiendo tu protección legal a más áreas de negocio.
          </p>
          <p className="text-base text-gray-700 mb-4 text-left">
            Por ejemplo, si tu marca cubre ropa y ahora quieres vender perfumes, necesitas ampliar la cobertura para garantizar tu exclusividad comercial.
          </p>

          <ul className="space-y-3 text-base text-gray-700 mb-6">
            {[
              "Evita conflictos legales al expandir tu marca.",
              "Protección en nuevas clases de productos o servicios.",
              "Asesoría personalizada para tu ampliación.",
              "Gestión completa ante la Superintendencia de Industria y Comercio (SIC).",
              "Acompañamiento legal durante todo el proceso.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-6 h-6 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-sm" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="text-left">
            <button
              onClick={handleAdquirirServicio}
              className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-base hover:bg-blue-800 transition"
            >
              Adquirir Servicio
            </button>
          </div>
        </div>

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioAmpliacion.jpg"
            alt="Ampliación de servicios"
            className="w-full max-w-md h-auto object-contain animate-float"
          />
        </div>
      </section>

      <Footer />

      {/* MODAL */}
      {mostrarModal && (
        <FormularioAmpliacion 
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onGuardar={async (form) => {
            const user = authData.getUser();
            if (user && user.email) {
              await crearVenta({ ...form, email: user.email });
            }
            setMostrarModal(false);
          }}
        />
      )}
    </div>
  );
};

export default AmpliacionServicios;
