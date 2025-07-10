import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/footer";
import authData from "../../auth/services/authData";
import FormularioBaseModal from "../../../shared/layouts/FormularioBase";
import FormularioCesionMarca from "../../../shared/components/formularioCesiondeMarca"; // ✅ Asegúrate de que este componente exista
import { useScrollToTop } from "../../../utils/hooks/useScrollToTop";
import { crearVenta } from '../../dashboard/pages/gestionVentasServicios/services/ventasService';

const CesionMarca = () => {
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
        <div className="w-full md:w-1/2 md:pr-12">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            ¿Qué es la cesión de marca?
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#083874] mb-4 text-left">
            Transfiere legalmente tu marca a otra persona o empresa.
          </h1>
          <p className="text-base text-gray-700 mb-4 text-left">
            La cesión de marca es el proceso legal mediante el cual el titular actual de una marca transfiere los derechos de propiedad a un tercero. Esta operación debe registrarse ante la Superintendencia de Industria y Comercio (SIC) para tener validez jurídica.
          </p>
          <p className="text-base text-gray-700 mb-6 text-left">
            En <span className="font-semibold">Registrack</span>, te acompañamos en todo el proceso de forma <span className="font-semibold">clara, segura y sin complicaciones</span>, asegurando que la cesión cumpla con todos los requisitos legales.
          </p>

          <ul className="space-y-3 text-base text-gray-700 mb-6">
            {[
              "Asesoría legal experta durante todo el proceso.",
              "Redacción y validación del contrato de cesión.",
              "Gestión del trámite ante la SIC.",
              "Evita errores que puedan invalidar la transferencia.",
              "Respaldo jurídico para ambas partes involucradas.",
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
            src="/images/servicioCesionMarca.jpeg"
            alt="Cesión de Marca"
            className="w-full max-w-md h-auto object-contain animate-float"
          />
        </div>
      </section>

      <Footer />

      {/* MODAL */}
      {mostrarModal && (
        <FormularioCesionMarca 
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

export default CesionMarca;
