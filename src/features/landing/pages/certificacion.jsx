import React from "react";
import { FaCheck } from "react-icons/fa";
import NavBarLanding from "../components/landingNavbar";
import Footer from "../components/footer";

const Certificaciones = () => {

  return (
    <div className="font-sans bg-white pt-3 md:pt-28">
      <NavBarLanding />

      <section className="w-full min-h-[calc(100vh-112px)] flex flex-col md:flex-row items-center justify-between px-8 md:px-16 lg:px-32 py-16 bg-white">
        {/* TEXTO */}
        <div className="w-full md:w-1/2 md:pr-16">
          <p className="text-sm md:text-base text-[#275FAA] uppercase font-semibold tracking-wide mb-2 text-left">
            ¿Por qué certificar tu marca?
          </p>
          <h1 className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#083874] mb-4 text-left">
            Protege lo que te hace único.
          </h1>
          <p className="text-base md:text-lg text-gray-700 mb-4 text-left">
            Certificar tu marca es asegurar legalmente tu identidad comercial y evitar que otros se beneficien de lo que tú construiste. Al hacerlo con nosotros, obtienes respaldo jurídico, asesoría profesional y más de 12 años de experiencia acompañando a emprendedores, empresas y visionarios en el registro nacional e internacional de sus marcas.
          </p>

          <ul className="space-y-3 text-sm text-gray-700 mb-4 pl-0">
            {[
              "Protección jurídica exclusiva sobre tu marca registrada.",
              "Asesoría experta con más de 12 años de experiencia.",
              "Trámite rápido, confiable y garantizado ante la Cámara de Comercio.",
              "Defensa legal ante oposiciones o conflictos por similitud.",
              "Mayor valor comercial y posicionamiento de tu marca en el mercado.",
            ].map((item, index) => (
              <li key={index} className="flex items-start gap-4">
                <div className="w-8 h-8 flex items-center justify-center bg-blue-100 text-blue-600 rounded-full mt-1">
                  <FaCheck className="text-lg" />
                </div>
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="text-left">
            <button className="bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg text-sm hover:bg-blue-800 transition">
              Adquirir mi certificación
            </button>
          </div>
        </div>

        {/* IMAGEN */}
        <div className="w-full md:w-1/2 mt-12 md:mt-0 flex justify-center items-center">
          <img
            src="/images/servicioCertificacion.jpg"
            alt="Certificación de marca"
            className="w-full max-w-xl h-auto object-contain animate-float rounded-lg shadow-lg"
          />
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Certificaciones;
