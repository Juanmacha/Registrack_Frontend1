// Hero.jsx
import React, { useState, useEffect } from "react";
import { FaBalanceScale, FaMedal, FaRocket, FaCheck } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { getServicios } from "../../dashboard/pages/gestionVentasServicios/services/serviciosManagementService";
import authData from '../../auth/services/authData';

// Formularios y Modal
import FormularioBaseModal from "../../../shared/layouts/FormularioBase";
import FormularioBusqueda from "../../../shared/components/formularioBusqueda";
import FormularioCertificacion from "../../../shared/components/formularioCertificacion";
import FormularioRenovacion from "../../../shared/components/formularioRenovacion";
import FormularioOposicion from "../../../shared/components/formularioOposicion";
import FormularioCesion from "../../../shared/components/formularioCesiondeMarca";
import FormularioAmpliacion from "../../../shared/components/formularioAmpliacion";
import FormularioRespuesta from "../../../shared/components/formularioRespuesta";

// Constantes
const FORMULARIOS_POR_SERVICIO = {
    "Búsqueda de Antecedentes": FormularioBusqueda,
    "Certificación de Marca": FormularioCertificacion,
    "Renovación de Marca": FormularioRenovacion,
    "Presentación de Oposición": FormularioOposicion,
    "Cesión de Marca": FormularioCesion,
    "Ampliación de Alcance": FormularioAmpliacion,
    "Respuesta a Oposición": FormularioRespuesta
  };

// Componente para las características del hero
const HeroFeatures = () => (
            <ul className="space-y-4 text-base text-gray-700 mb-6">
              <li className="flex items-start gap-3">
                <FaBalanceScale className="text-blue-600 mt-1" />
                <span>
                  <strong>Soporte legal completo:</strong> Contamos con abogados
                  especializados en propiedad intelectual que te asesoran desde
                  el inicio hasta la obtención del certificado.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FaMedal className="text-yellow-500 mt-1" />
                <span>
                  <strong>Más de 12 años de experiencia:</strong> Hemos ayudado
                  a cientos de emprendedores y empresas en Colombia a proteger
                  sus marcas con éxito.
                </span>
              </li>
              <li className="flex items-start gap-3">
                <FaRocket className="text-green-500 mt-1" />
                <span>
                  <strong>Trámites 100% en línea:</strong> Ahorra tiempo y evita
                  desplazamientos. Todo el proceso es digital, ágil y con
                  atención personalizada.
                </span>
              </li>
            </ul>
);

// Componente para el video del hero
const HeroVideo = () => (
          <div className="flex-1 flex justify-center items-center h-[400px] md:h-[500px]">
            <video
              src="/images/Whisk_cauajgm4ymzhyjjkltawzjetndazzc1hn2y3lwe.mp4"
              alt="Video Registrack"
      className="w-full h-full object-cover"
              autoPlay
              loop
              muted
              playsInline
            />
          </div>
);

// Componente para la sección "Quiénes somos"
const QuienesSomos = () => (
  <section
    id="nosotros"
    className="bg-[#275FAA] py-20 px-6 md:px-12 lg:px-24"
  >
        <div className="max-w-screen-xl mx-auto bg-white rounded-xl shadow-lg p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
        <h2 className="text-3xl md:text-4xl font-bold mb-4 text-left text-[#275FAA] tracking-tight">
              ¿Quiénes somos?
        </h2>
        <p className="text-base md:text-lg text-gray-700 mb-4 text-left leading-relaxed">
          En{" "}
          <span className="font-semibold text-[#275FAA]">Registrack</span>,
          somos el equipo que te brinda la tranquilidad y la certeza de
          tener tu marca protegida. Con más de 12 años de experiencia en
          Propiedad Industrial, nos dedicamos a ser tu aliado estratégico en
          Medellín y a nivel internacional.
        </p>
        <p className="text-base md:text-lg text-gray-700 mb-4 text-left leading-relaxed">
          Nos mueve tu éxito. Nos apasiona proteger la identidad de tu
          negocio y asegurar su crecimiento. Elegirnos significa contar con
          la experiencia, el rigor legal y el compromiso de un equipo que
          valora tu marca tanto como tú.
        </p>
        <blockquote className="border-l-4 border-[#275FAA] pl-4 italic text-gray-600 bg-gray-50 py-2">
          En Registrack, somos tu respaldo confiable.
        </blockquote>
          </div>
          <img
            src="/images/trato.jpeg"
            alt="Asesoría personalizada"
            className="w-full h-full max-h-[500px] object-contain animate-float"
          />
        </div>
      </section>
);

// Componente para la tarjeta de servicio
const ServicioCard = ({ servicio, onSaberMas, onAdquirir, formularioDisponible }) => (
  <div className="service-card bg-gray-100 rounded-xl shadow-md transition-transform duration-300 transform hover:-translate-y-2 hover:shadow-xl text-center overflow-hidden">
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
      <p className="text-gray-600 text-sm mb-4">
        {servicio.landing_data?.resumen || servicio.descripcion_corta}
      </p>
                    <div className="flex flex-row gap-2 justify-center mt-2">
                      <button
          onClick={() => onSaberMas(servicio)}
                        className="btn-responsive bg-blue-600 text-white px-3 py-1.5 text-sm rounded-md font-medium shadow-sm hover:bg-[#163366] transition-all focus:outline-none focus:ring-2 focus:ring-blue-400"
                      >
                        Saber más
                      </button>
                      <button
          onClick={() => onAdquirir(servicio)}
          className={`btn-responsive px-3 py-1.5 text-sm rounded-md font-medium shadow-sm transition-all focus:outline-none focus:ring-2 focus:ring-green-400 ${
            formularioDisponible 
              ? 'bg-green-600 text-white hover:bg-green-700' 
              : 'bg-gray-300 text-gray-500 cursor-not-allowed'
          }`}
          disabled={!formularioDisponible}
                      >
                        Adquirir Servicio
                      </button>
                    </div>
                  </div>
                </div>
);

// Componente para la sección de servicios
const ServiciosSection = ({ servicios, loading, onSaberMas, onAdquirir }) => (
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
        <div className="services-grid grid gap-10 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
          {servicios.map((servicio) => (
            <ServicioCard
              key={servicio.id}
              servicio={servicio}
              onSaberMas={onSaberMas}
              onAdquirir={onAdquirir}
              formularioDisponible={!!FORMULARIOS_POR_SERVICIO[servicio.nombre]}
            />
              ))}
            </div>
          )}
        </div>
      </section>
);

// Hook personalizado para manejar servicios
const useServicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cargar = () => {
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

  return { servicios, loading };
};

// Hook personalizado para manejar el modal
const useModal = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [tituloModal, setTituloModal] = useState("");

  const abrirModal = (servicio) => {
    const FormularioComponente = FORMULARIOS_POR_SERVICIO[servicio.nombre];
    
    if (!FormularioComponente) {
      alert("Este servicio aún no tiene un formulario habilitado.");
      return false;
    }

    setServicioSeleccionado(servicio);
    setTituloModal(`Solicitud de ${servicio.nombre}`);
    setModalAbierto(true);
    return true;
  };

  const cerrarModal = () => {
    setModalAbierto(false);
    setServicioSeleccionado(null);
    setTituloModal("");
  };

  return { modalAbierto, servicioSeleccionado, tituloModal, abrirModal, cerrarModal };
};

// Componente principal Hero
const Hero = () => {
  const navigate = useNavigate();
  const { servicios, loading } = useServicios();
  const { modalAbierto, servicioSeleccionado, tituloModal, abrirModal, cerrarModal } = useModal();

  const handleAdquirir = (servicio) => {
    const user = authData.getUser && typeof authData.getUser === 'function'
      ? authData.getUser()
      : JSON.parse(localStorage.getItem('user'));

    if (!user) {
      localStorage.setItem('postLoginRedirect', window.location.pathname);
      navigate('/login');
      alert('Debes estar logueado para realizar esta opción');
      return;
    }

    if (user.rol && user.rol.toLowerCase() === 'admin') {
      alert('Esta acción solo está disponible para clientes.');
      return;
    }

    abrirModal(servicio);
  };

  const handleSaberMas = (servicio) => {
    navigate(servicio.route_path);
    setTimeout(() => {
      window.scrollTo(0, 0);
    }, 100);
  };

  return (
    <div className="min-h-screen w-full bg-white overflow-y-scroll no-scrollbar font-sans pt-3 md:pt-28">
      {/* Hero Section */}
      <header className="hero-container bg-white">
        <div className="max-w-screen-xl mx-auto grid grid-cols-1 md:grid-cols-2 items-center gap-10 md:gap-16 min-h-[420px]">
          <div className="flex flex-col justify-center">
            <h1 className="hero-title text-6xl text-left font-bold mb-6">
              Certimarcas
            </h1>
            <p className="hero-subtitle text-lg text-gray-700 mb-6 text-left">
              ¿Tienes una gran idea? Nosotros la protegemos. En Registrack te
              ayudamos a registrar tu marca de forma fácil, rápida y sin enredos
              legales. ¡Haz que tu marca sea solo tuya, hoy!
            </p>
            <HeroFeatures />
            <div className="w-full text-left pt-2">
              <a href="#nosotros">
                <button className="bg-blue-700 text-white px-8 py-3 rounded-md text-lg hover:bg-blue-800 transition">
                  Conocer más
                </button>
              </a>
            </div>
          </div>
          <HeroVideo />
        </div>
      </header>

      {/* ¿Quiénes somos? */}
      <section
        id="nosotros"
        className="bg-[#275FAA] py-20 px-6 md:px-12 lg:px-24"
      >
        <div className="max-w-screen-xl mx-auto bg-white rounded-xl shadow-lg p-10 grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-left text-[#275FAA] tracking-tight">
              ¿Quiénes somos?
            </h2>
            <p className="text-base md:text-lg text-gray-700 mb-4 text-left leading-relaxed">
              En{" "}
              <span className="font-semibold text-[#275FAA]">Registrack</span>,
              somos el equipo que te brinda la tranquilidad y la certeza de
              tener tu marca protegida. Con más de 12 años de experiencia en
              Propiedad Industrial, nos dedicamos a ser tu aliado estratégico en
              Medellín y a nivel internacional.
            </p>
            <p className="text-base md:text-lg text-gray-700 mb-4 text-left leading-relaxed">
              Nos mueve tu éxito. Nos apasiona proteger la identidad de tu
              negocio y asegurar su crecimiento. Elegirnos significa contar con
              la experiencia, el rigor legal y el compromiso de un equipo que
              valora tu marca tanto como tú.
            </p>
            <blockquote className="border-l-4 border-[#275FAA] pl-4 italic text-gray-600 bg-gray-50 py-2">
              En Registrack, somos tu respaldo confiable.
            </blockquote>
          </div>
          <img
            src="/images/trato.jpeg"
            alt="Asesoría personalizada"
            className="w-full h-full max-h-[500px] object-contain animate-float"
          />
        </div>
      </section>

      <ServiciosSection
        servicios={servicios}
        loading={loading}
        onSaberMas={handleSaberMas}
        onAdquirir={handleAdquirir}
      />

      {/* Modal */}
      {modalAbierto && servicioSeleccionado && (
        (() => {
          const FormularioComponente = FORMULARIOS_POR_SERVICIO[servicioSeleccionado.nombre];
          return FormularioComponente ? (
            <FormularioComponente
              isOpen={modalAbierto}
              onClose={cerrarModal}
              onGuardar={cerrarModal}
            />
          ) : null;
        })()
      )}
    </div>
  );
};

export default Hero;
