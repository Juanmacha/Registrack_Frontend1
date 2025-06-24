import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaRedo } from 'react-icons/fa';
import LandingNavbar from '../components/landingNavbar';
import authData from '../../auth/services/authData'; 

const RenovacionMarca = () => {
  const navigate = useNavigate();
  const user = authData.getUser();

  const handleAdquirirServicio = () => {
    if (!user) {
      alert("Debes estar logueado para adquirir este servicio");
      navigate("/login");
    } else {
      navigate("/checkout/renovacion"); // ajusta esta ruta según tu flujo real
    }
  };

  return (
    <section>
      <LandingNavbar />

      <div className="p-6 md:p-10 max-w-4xl mx-auto">
        <h2 className="text-5xl font-bold bg-gradient-to-r from-yellow-400 via-blue-500 to-gray-700 bg-clip-text text-transparent pb-3">
          Renovación de Marca
        </h2>

        <div className="bg-gray-100 border border-gray-300 rounded-md p-6 relative">
          <p className="text-gray-700 text-left font-medium mb-2">
            La renovación de marca es un proceso fundamental para mantener vigente tu propiedad intelectual. En <span className="font-semibold">Registrack</span>, te facilitamos este trámite para que tu marca no pierda su protección legal.
          </p>

          <p className="text-gray-700 text-left mb-2">
            Nuestro equipo se encarga de <span className="font-semibold">verificar los tiempos</span>, <span className="font-semibold">preparar la documentación</span> y <span className="font-semibold">presentar la renovación ante la SIC</span> sin complicaciones para ti.
          </p>

          <p className="text-gray-700 mb-4 text-left">
            No dejes que se te pase el tiempo. Una marca vencida puede ser solicitada por terceros.
            Protege lo que te pertenece con nuestro servicio de renovación.
          </p>

          <div className="mb-6">
            <h3 className="font-bold text-gray-800 text-lg mb-2 text-left">¿Qué incluye este servicio?</h3>
            <ul className="list-disc list-inside text-gray-700 space-y-1 text-left">
              <li>Asesoría sobre la fecha de vencimiento y requisitos</li>
              <li>Preparación y gestión de documentos</li>
              <li>Presentación ante la Superintendencia de Industria y Comercio</li>
              <li>Seguimiento y entrega de constancia</li>
            </ul>
          </div>

          <div className="flex justify-between items-center gap-3">
            <button
              onClick={handleAdquirirServicio}
              className="bg-yellow-500 hover:bg-yellow-600 text-white font-bold py-2 px-4 rounded"
            >
              Adquirir Servicio
            </button>
            <FaRedo className="text-5xl text-blue-700 ml-5" />
          </div>
        </div>
      </div>
    </section>
  );
};

export default RenovacionMarca;
