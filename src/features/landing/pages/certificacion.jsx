import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/footer";
import authData from "../../auth/services/authData";
import FormularioBaseModal from "../../../shared/layouts/FormularioBase";
import FormularioCertificacion from "../../../shared/components/formularioCertificacion"; // ✅ Asegúrate de que este componente exista
import { useScrollToTop } from "../../../utils/hooks/useScrollToTop";
import { crearVenta } from '../../dashboard/pages/gestionVentasServicios/services/ventasService';
import alertService from '../../../utils/alertService.js';

const Certificaciones = () => {
  const navigate = useNavigate();
  const user = authData.getUser();
  const [mostrarModal, setMostrarModal] = useState(false);
  
  // Forzar scroll al inicio de la página
  useScrollToTop();

  const handleAdquirirCertificacion = () => {
    if (!user) {
      alert("Debes iniciar sesión para poder adquirir un servicio.");
      navigate("/login");
    } else {
      setMostrarModal(true);
    }
  };

  return (
    <div className="font-sans bg-white pt-3 md:pt-28">
      <NavBarLanding />

      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-6 md:px-12 lg:px-24 py-10 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 md:pr-12">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            ¿Por qué certificar tu marca?
          </p>
          <h1 className="text-3xl md:text-4xl font-bold text-[#083874] mb-4 text-left">
            Protege lo que te hace único.
          </h1>
          <p className="text-base text-gray-700 mb-6 text-left">
            Certificar tu marca es asegurar legalmente tu identidad comercial y evitar que otros se beneficien de lo que tú construiste. Al hacerlo con nosotros, obtienes respaldo jurídico, asesoría profesional y más de 12 años de experiencia acompañando a emprendedores, empresas y visionarios en el registro nacional e internacional de sus marcas.
          </p>

          <ul className="space-y-3 text-base text-gray-700 mb-6">
            {[
              "Protección jurídica exclusiva sobre tu marca registrada.",
              "Asesoría experta con más de 12 años de experiencia.",
              "Trámite rápido, confiable y garantizado ante la Cámara de Comercio.",
              "Defensa legal ante oposiciones o conflictos por similitud.",
              "Mayor valor comercial y posicionamiento de tu marca en el mercado.",
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
              onClick={handleAdquirirCertificacion}
              className="bg-blue-700 text-white font-semibold px-6 py-3 rounded-md text-base hover:bg-blue-800 transition"
            >
              Adquirir mi certificación
            </button>
          </div>
        </div>

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 mt-10 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioCertificacion.jpg"
            alt="Certificación de marca"
            className="w-full max-w-md h-auto object-contain animate-float"
          />
        </div>
      </section>

      <Footer />

      {/* MODAL */}
      {mostrarModal && (
        <FormularioCertificacion 
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
              if (typeof alertService !== 'undefined') {
                await alertService.success(
                  "Solicitud creada",
                  "Tu solicitud ha sido creada exitosamente. Te contactaremos pronto."
                );
              } else {
                alert('Solicitud creada exitosamente.');
              }
            }
            setMostrarModal(false);
          }}
        />
      )}
    </div>
  );
};

export default Certificaciones;
