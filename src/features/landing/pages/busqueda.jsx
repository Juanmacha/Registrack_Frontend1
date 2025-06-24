import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRegFileArchive } from "react-icons/fa";
import LandingNavbar from '../components/landingNavbar';
import authData from '../../auth/services/authData'; // Importamos el servicio de autenticación

const busqueda = () => {
  const navigate = useNavigate();
  const user = authData.getUser(); // Usamos el mismo método que el navbar

  const handleAdquirirServicio = () => {
    if (!user) {
      alert("Debes estar logueado para adquirir un servicio");
      navigate("/login");
    } else {
      navigate("#"); // Cambia esta ruta por la correcta si es diferente
    }
  };

  return (
    <section>
      <LandingNavbar />

      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-blue-700 via-gray-500 to-yellow-400 bg-clip-text text-transparent pb-3">
          Cesión de marca
        </h2>

        <div className="bg-gray-100 border border-gray-300 rounded-md p-6 relative">
          <p className="text-gray-700 text-left font-medium mb-2">
            La cesión de marca es el proceso legal mediante el cual el titular transfiere los derechos de su marca a otra persona o empresa. En Nombre de tu empresa, gestionamos este trámite de manera segura y eficiente, asegurando que la transferencia se realice correctamente y sin complicaciones legales.
          </p>

          <p className="text-gray-700 text-left mb-2">
            En <span className="font-semibold">Registrack</span>, te ayudamos a registrar tu marca
            de forma <span className="font-semibold">fácil, rápida y sin enredos legales</span>,
            asegurando que tu propiedad intelectual esté segura.
          </p>

          <p className="text-gray-700 mb-4 text-left">
            Si tienes una gran idea o estás lanzando un nuevo negocio,
            <span className="font-semibold"> Certimarcas</span> es tu mejor aliado.
            Olvídate de los trámites confusos, nosotros nos encargamos de todo para que tú te enfoques en crecer.
          </p>

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 text-lg mb-2 text-left">¿Cómo funciona el proceso?</h3>
            <ol className="list-decimal list-inside text-gray-700 space-y-1 text-left">
              <li><span className="font-medium">Asesoría personalizada</span> – Te guiamos paso a paso para conocer si tu marca puede ser registrada.</li>
              <li><span className="font-medium">Gestión de documentos</span> – Preparamos toda la documentación requerida.</li>
              <li><span className="font-medium">Registro ante autoridades</span> – Inscribimos tu marca ante la <span className="italic">Superintendencia de Industria y Comercio</span>.</li>
            </ol>
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              onClick={handleAdquirirServicio}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            >
              Adquirir Servicio
            </button>
            <FaRegFileArchive className="text-5xl ml-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default busqueda;
