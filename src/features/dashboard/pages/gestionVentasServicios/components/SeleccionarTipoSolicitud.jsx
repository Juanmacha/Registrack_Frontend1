import React from 'react';

const tipos = [
  { nombre: 'Búsqueda de Antecedentes', habilitado: false },
  { nombre: 'Certificación de Marca', habilitado: true },
  { nombre: 'Renovación de Marca', habilitado: false },
  { nombre: 'Oposición', habilitado: false },
  { nombre: 'Cesión de Marca', habilitado: false },
  { nombre: 'Ampliamiento de Alcance', habilitado: false },
];

const SeleccionarTipoSolicitud = ({ isOpen, onClose, onSeleccionar }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-8 flex flex-col items-center">
        <h2 className="text-2xl font-bold mb-6 text-center">Selecciona el tipo de servicio</h2>
        <div className="flex flex-col gap-4 w-full">
          {tipos.map((tipo) => (
            <button
              key={tipo.nombre}
              disabled={!tipo.habilitado}
              onClick={() => tipo.habilitado && onSeleccionar(tipo.nombre)}
              className={`w-full py-4 text-lg rounded-lg font-semibold transition-all
                ${tipo.habilitado
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {tipo.nombre}
            </button>
          ))}
        </div>
        <button
          onClick={onClose}
          className="mt-8 text-gray-500 hover:text-red-600 text-sm"
        >
          Cancelar
        </button>
      </div>
    </div>
  );
};

export default SeleccionarTipoSolicitud; 