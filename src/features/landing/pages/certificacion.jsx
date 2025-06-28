import React from "react";
import { useNavigate } from "react-router-dom";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/Footer";
import authData from "../../auth/services/authData"; // ✅ Importación para verificar login

const Certificaciones = () => {
  const navigate = useNavigate();
  const user = authData.getUser(); // ✅ Obtenemos el usuario actual

  const handleAdquirirCertificacion = () => {
    if (!user) {
      alert("Debes iniciar sesión para poder adquirir un servicio.");
      navigate("/login");
    } else {
      // Cambia esta ruta a donde quieras redirigir después del login
      navigate("/formulario-certificacion");
    }
  };

  return (
    <div className="font-sans bg-white min-h-screen">
      <NavBarLanding />

      <section className="w-full flex flex-col md:flex-row items-center justify-between px-6 py-8 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 px-4 md:px-10">
          <h4 className="text-gray-500 uppercase tracking-wide mb-2 text-sm font-semibold text-left">
            ¿Por qué certificar tu marca?
          </h4>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-6 leading-tight text-left">
            Protege lo que te hace único.
          </h2>
          <p className="text-gray-600 text-lg mb-6 text-left">
            Certificar tu marca es asegurar legalmente tu identidad comercial y evitar que otros se beneficien de lo que tú construiste. Al hacerlo con nosotros, obtienes respaldo jurídico, asesoría profesional y más de 12 años de experiencia acompañando a emprendedores, empresas y visionarios en el registro nacional e internacional de sus marcas.
          </p>

          {/* LISTA CON CHULOS DE REACT ICONS */}
          <ul className="space-y-4 text-gray-700 text-base mb-8">
            {[
              "Protección jurídica exclusiva sobre tu marca registrada.",
              "Asesoría experta con más de 12 años de experiencia.",
              "Trámite rápido, confiable y garantizado ante la Cámara de Comercio.",
              "Defensa legal ante oposiciones o conflictos por similitud.",
              "Mayor valor comercial y posicionamiento de tu marca en el mercado.",
            ].map((text, index) => (
              <li key={index} className="flex items-start gap-3">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-lg" />
                </div>
                <span>{text}</span>
              </li>
            ))}
          </ul>

          {/* BOTÓN con verificación de login */}
          <div className="w-full text-left pt-2">
            <button
              onClick={handleAdquirirCertificacion}
              className="bg-blue-700 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-800 transition"
            >
              Adquirir mi certificación
            </button>
          </div>
        </div>

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 px-4 mt-10 md:mt-0">
          <img
            src="/images/servicioCertificacion.jpg"
            alt="Asesoría personalizada"
            className="w-full h-full object-contain animate-float max-h-[500px]"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Certificaciones;
