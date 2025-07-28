import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/footer";
import FormularioBaseModal from "../../../shared/layouts/FormularioBase";
import FormularioBusqueda from "../../../shared/components/formularioBusqueda";
import DemoPasarelaPagoModal from '../components/DemoPasarelaPagoModal';
import authData from "../../auth/services/authData";
import { useScrollToTop } from "../../../utils/hooks/useScrollToTop";
import { crearVenta } from '../../dashboard/pages/gestionVentasServicios/services/ventasService';
import alertService from '../../../utils/alertService.js';
import ScrollToTopButton from '../components/ScrollToTopButton';

const BusquedaAntecedentes = () => {
  const navigate = useNavigate();
  const user = authData.getUser();
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarDemoPago, setMostrarDemoPago] = useState(false);
  const [formParaPago, setFormParaPago] = useState(null);
  
  // Forzar scroll al inicio de la página
  useScrollToTop();

  const handleAdquirirServicio = async () => {
    if (!user) {
      localStorage.setItem('postLoginRedirect', window.location.pathname);
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
      <NavBarLanding />

      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-24 py-10 bg-white">
        <div className="w-full md:w-1/2 pr-0 md:pr-12">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            ¿Qué es la búsqueda de antecedentes?
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#083874] mb-4 text-left">
            Protege tu marca antes de registrarla
          </h1>
          <p className="text-base text-gray-700 mb-4 text-left">
            La búsqueda de antecedentes permite saber si una marca, nombre comercial, logotipo o elemento distintivo ya está registrado o en trámite ante la SIC.
          </p>

          <ul className="space-y-3 text-base text-gray-700 mb-6">
            {[
              "Evita registrar una marca que ya existe.",
              "Identifica similitudes que puedan generar conflictos.",
              "Asegura viabilidad antes de iniciar el registro.",
              "Análisis por clase o categoría según la SIC.",
              "Asesoría legal completa durante el proceso.",
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

        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioBusqueda.jpg"
            alt="Búsqueda de antecedentes"
            className="w-full max-w-md h-auto object-contain animate-float"
          />
        </div>
      </section>

      <Footer />
      <ScrollToTopButton />

      {/* MODAL */}
      {mostrarModal && (
        <FormularioBusqueda 
          isOpen={mostrarModal}
          onClose={() => setMostrarModal(false)}
          onGuardar={async (form) => {
            setFormParaPago(form);
            setMostrarDemoPago(true);
          }}
        />
      )}
      {/* DEMO PAGO */}
      {mostrarDemoPago && (
        <DemoPasarelaPagoModal
          isOpen={mostrarDemoPago}
          onClose={() => {
            setMostrarDemoPago(false);
            setFormParaPago(null);
            setMostrarModal(false);
          }}
          monto={1848000}
          datosPago={formParaPago}
          onPagoExitoso={async (datos) => {
            const user = authData.getUser();
            const fileToBase64 = file => new Promise((resolve, reject) => {
              if (!file) return resolve(null);
              const reader = new FileReader();
              reader.onload = () => resolve(reader.result);
              reader.onerror = reject;
              reader.readAsDataURL(file);
            });
            if (user && user.email) {
              const formToSave = { ...formParaPago };
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
            }
            setMostrarDemoPago(false);
            setFormParaPago(null);
            setMostrarModal(false);
          }}
        />
      )}
    </div>
  );
};

export default BusquedaAntecedentes;
