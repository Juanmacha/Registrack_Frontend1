// LandingPage.jsx
import React, { useState, useEffect } from "react";
import { FaBalanceScale, FaMedal, FaRocket, FaCheck } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { getServicios, clearServicesCache } from "../../dashboard/pages/gestionVentasServicios/services/serviciosManagementService";
import authData from '../../auth/services/authData';

// Formularios y Modal
import FormularioBaseModal from "../../../shared/layouts/FormularioBase";
import FormularioBusqueda from "../../../shared/components/formularioBusqueda";
import FormularioCertificacion from "../../../shared/components/formularioCertificacion";
import FormularioRenovacion from "../../../shared/components/formularioCesiondeMarca";
import FormularioOposicion from "../../../shared/components/formularioOposicion";
import FormularioCesion from "../../../shared/components/formularioCesiondeMarca";
import FormularioAmpliacion from "../../../shared/components/formularioAmpliacion";

const Hero = () => {
  const navigate = useNavigate();
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modalAbierto, setModalAbierto] = useState(false);
  const [formularioActivo, setFormularioActivo] = useState(null);

  const formulariosPorServicio = {
    "Búsqueda de Antecedentes": FormularioBusqueda,
    "Certificación de Marca": FormularioCertificacion,
    "Renovación de Marca": FormularioRenovacion,
    "Presentación de Oposición": FormularioOposicion,
    "Cesión de Marca": FormularioCesion,
    "Ampliación de Alcance": FormularioAmpliacion
  };

  useEffect(() => {
    const cargar = () => {
      // Limpiar caché para asegurar rutas actualizadas
      clearServicesCache();
      const todos = getServicios();
      setServicios(todos.filter(s => s.visible_en_landing));
      setLoading(false);
    };
    cargar();
    window.addEventListener('focus', cargar);
    const onStorage = (e) => {
      if (e.key === 'servicios_management') cargar();
    };
    window.addEventListener('storage', onStorage);
    return () => {
      window.removeEventListener('focus', cargar);
      window.removeEventListener('storage', onStorage);
    };
  }, []);

  const handleAdquirir = (servicio) => {
    const user = authData.getUser && typeof authData.getUser === 'function'
      ? authData.getUser()
      : JSON.parse(localStorage.getItem('user'));

    const FormularioComponente = formulariosPorServicio[servicio.nombre];

    if (!FormularioComponente) {
      alert("Este servicio aún no tiene un formulario habilitado.");
      return;
    }

    if (!user) {
      localStorage.setItem('postLoginRedirect', window.location.pathname);
      navigate('/login');
      alert('Debes estar logueado para realizar esta opción');
    } else if (user.rol && user.rol.toLowerCase() === 'admin') {
      alert('Esta acción solo está disponible para clientes.');
    } else {
      setFormularioActivo(<FormularioComponente />);
      setModalAbierto(true);
    }
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-y-scroll no-scrollbar font-sans">
      {/* Hero Section */}
      <header className="pt-26 pb-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row items-center gap-16 md:gap-24">
          <div className="flex-1">
            <h1 className="text-6xl text-left font-bold bg-gradient-to-r mt-2 from-[#083874] to-[#F3D273] bg-clip-text text-transparent mb-6">
              Certimarcas
            </h1>
            <p className="text-lg text-gray-700 mb-6 text-left">
              ¿Tienes una gran idea? Nosotros la protegemos. En Registrack te
              ayudamos a registrar tu marca de forma fácil, rápida y sin
              enredos legales. ¡Haz que tu marca sea solo tuya, hoy!
            </p>
            <ul className="space-y-4 text-base text-gray-700 mb-6">
              <li className="flex items-start gap-3">
                <FaBalanceScale className="text-blue-600 mt-1" />
                <span>
                  <strong>Soporte legal completo:</strong> Contamos con abogados especializados en propiedad intelectual que te asesoran desde el inicio hasta la obtención del certificado.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FaMedal className="text-yellow-500 mt-1" />
                <span>
                  <strong>Más de 12 años de experiencia:</strong> Hemos ayudado a cientos de emprendedores y empresas en Colombia a proteger sus marcas con éxito.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FaRocket className="text-green-500 mt-1" />
                <span>
                  <strong>Trámites 100% en línea:</strong> Ahorra tiempo y evita desplazamientos. Todo el proceso es digital, ágil y con atención personalizada.
                </span>
              </li>
            </ul>
            <div className="w-full text-left pt-2">
              <a href="#nosotros">
                <button className="bg-blue-700 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-800 transition">
                  Conocer más
                </button>
              </a>
            </div>
          </div>
          <div className="flex-1 flex justify-center">
            <img
              src="/images/logoMejorado.jpg"
              alt="Logo Registrack"
              className="max-w-[350px] w-full h-auto object-contain animate-float"
            />
          </div>
        </div>
      </header>

      {/* ¿Quiénes somos? */}
      <section id="nosotros" className="bg-[#275FAA] py-20 px-6 md:px-12 lg:px-24">
        <div className="max-w-screen-xl mx-auto bg-white rounded-xl shadow-lg p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <p className="text-4xl font-bold  uppercase mb-2 text-left">
              ¿Quiénes somos?
            </p>
            <h2 className="text-4xl font-bold text-[#1a1a1a] mb-4 text-left">
              Protegiendo ideas, impulsando marcas.
            </h2>
            <p className="text-gray-700 text-base mb-6 text-left">
              Con más de 12 años de experiencia, en Registrack te acompañamos paso a paso para registrar, proteger y certificar tu marca, tanto a nivel nacional como internacional.
            </p>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <FaCheck className="text-blue-600 mt-1" />
                <span>Asesoría personalizada para cada proceso de registro de marca.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheck className="text-blue-600 mt-1" />
                <span>Trámite ágil, legal y garantizado ante la Cámara de Comercio.</span>
              </li>
              <li className="flex items-start gap-3">
                <FaCheck className="text-blue-600 mt-1" />
                <span>Precios accesibles y métodos de pago flexibles.</span>
              </li>
            </ul>
          </div>
          <img
            src="/images/trato.jpeg"
            alt="Asesoría personalizada"
            className="w-full h-full max-h-[500px] object-contain animate-float"
          />
        </div>
      </section>

      {/* Servicios */}
      <section id="servicios" className="py-20 px-6 md:px-12 lg:px-24 bg-white">
        <div className="max-w-screen-xl mx-auto">
          <h2 className="text-4xl font-bold text-center mb-12 text-[#275FAA]">
            Nuestros Servicios
          </h2>
          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {servicios.map((servicio) => (
                <div
                  key={servicio.id}
                  className="bg-gray-100 rounded-xl shadow-md transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-xl text-center overflow-hidden"
                >
                  <img
                    src={servicio.landing_data?.imagen || "/images/certificacion.jpg"}
                    alt={servicio.landing_data?.titulo || servicio.nombre}
                    className="w-full h-48 object-cover"
                    onError={e => { e.target.src = "/images/certificacion.jpg"; }}
                  />
                  <div className="p-6">
                    <h3 className="text-xl font-semibold text-[#275FAA] mb-2">
                      {servicio.landing_data?.titulo || servicio.nombre}
                    </h3>
                    <p className="text-gray-600 text-sm mb-4">{servicio.landing_data?.resumen || servicio.descripcion_corta}</p>
                    <div className="flex flex-row gap-2 justify-center mt-2">
                      <button
                        onClick={() => navigate(servicio.route_path)}
                        className="bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md font-medium shadow-sm hover:bg-[#163366] transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Saber más
                      </button>
                      <button
                        onClick={() => handleAdquirir(servicio)}
                        className={`px-3 py-1.5 text-sm rounded-md font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 ${formulariosPorServicio[servicio.nombre] ? 'bg-green-600 text-white hover:bg-green-700' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
                        disabled={!formulariosPorServicio[servicio.nombre]}
                      >
                        Adquirir Servicio
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* MODAL */}
      {modalAbierto && (
        <FormularioBaseModal onClose={() => setModalAbierto(false)}>
          {formularioActivo}
        </FormularioBaseModal>
      )}
    </div>
  );
};

export default Hero;
