import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import LandingNavbar from "../components/landingNavbar";
import Footer from "../components/footer";
import authData from "../../auth/services/authData";
import FormularioBaseModal from "../../../shared/layouts/FormularioBase";
import FormularioRenovacion from "../../../shared/components/formularioRenovacion";
import { useScrollToTop } from "../../../utils/hooks/useScrollToTop";
import { crearVenta } from '../../dashboard/pages/gestionVentasServicios/services/ventasService';
import alertService from '../../../utils/alertService.js';

const RenovacionMarca = () => {
  const navigate = useNavigate();
  const user = authData.getUser();
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Forzar scroll al inicio de la página
  useScrollToTop();

  const handleAdquirirServicio = async () => {
    if (!user) {
      await alertService.warning(
        "¡Atención!",
        "Debes iniciar sesión para adquirir este servicio.",
        { confirmButtonText: "Entiendo", showCancelButton: false }
      );
      navigate("/login");
    } else {
      setMostrarModal(true);
    }
  };

  return (
    <div className="font-sans bg-white pt-3 md:pt-28">
      <LandingNavbar />

      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-24 py-10 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 md:pr-12">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            Protección continua
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#083874] mb-4 text-left">
            Renovación de Marca
          </h1>
          <p className="text-base text-gray-700 mb-4 text-left">
            Renovar tu marca a tiempo garantiza que sigas disfrutando de su protección legal. En{" "}
            <span className="font-semibold">Registrack</span>, hacemos el proceso rápido y sin estrés.
          </p>
          <p className="text-base text-gray-700 mb-4 text-left">
            Verificamos los tiempos, gestionamos la documentación y presentamos la solicitud ante la{" "}
            <span className="font-semibold">Superintendencia de Industria y Comercio</span> (SIC).
          </p>
          <p className="text-base text-gray-700 mb-6 text-left">
            No dejes vencer tu registro. Una marca vencida puede ser reclamada por terceros.
          </p>

          {/* LISTA DE BENEFICIOS */}
          <ul className="space-y-3 text-base text-gray-700 mb-6">
            {[
              "Asesoría sobre vencimientos y requisitos.",
              "Preparación y envío de la documentación.",
              "Presentación ante la SIC.",
              "Seguimiento del trámite y entrega de constancia.",
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
            onClick={handleAdquirirServicio}
            className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-base hover:bg-blue-800 transition"
          >
            Adquirir Servicio
          </button>
        </div>

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioRenovacion.jpeg"
            alt="Renovación de Marca"
            className="w-full max-w-md h-auto object-contain animate-float"
          />
        </div>
      </section>

      <Footer />

      {/* MODAL */}
      {mostrarModal && (
        <FormularioRenovacion 
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onGuardar={async (form) => {
            const user = authData.getUser();
            const fileToBase64 = file => new Promise((resolve, reject) => {
              if (!file) return resolve(null);
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            if (user && user.email) {
              const formToSave = { ...form };
              const fileFields = [
                'certificadoCamara',
                'logotipoMarca',
                'poderRepresentante',
                'poderAutorizacion',
              ];
              for (const field of fileFields) {
                if (formToSave[field] instanceof File) {
                  formToSave[field] = await fileToBase64(formToSave[field]);
                }
              }
              await crearVenta({ ...formToSave, email: user.email });
              // Eliminada la alerta de éxito aquí
            }
            setMostrarModal(false);
          }}
        />
      )}
    </div>
  );
};

export default RenovacionMarca;
