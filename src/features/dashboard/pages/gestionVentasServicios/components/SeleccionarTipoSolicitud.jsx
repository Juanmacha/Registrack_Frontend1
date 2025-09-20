import React from 'react';

const tipos = [
  { nombre: 'Búsqueda de Antecedentes', habilitado: true },
  { nombre: 'Certificación de Marca', habilitado: true },
  { nombre: 'Renovación de Marca', habilitado: true },
  { nombre: 'Presentación de Oposición', habilitado: true },
  { nombre: 'Cesión de Marca', habilitado: true },
  { nombre: 'Ampliación de Alcance', habilitado: true },
  { nombre: 'Respuesta a Oposición', habilitado: true },
];

const SeleccionarTipoSolicitud = ({ isOpen, onClose, onSeleccionar }) => {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-xs flex flex-col items-center"
        style={{ maxHeight: '80vh', overflowY: 'auto' }}
      >
        {/* Encabezado moderno */}
        <div className="w-full flex items-center bg-blue-50 rounded-t-2xl px-4 py-3 border-b border-blue-100">
          <div className="flex items-center gap-3">
            <div className="bg-blue-200 text-blue-700 rounded-full p-2 flex items-center justify-center">
              <i className="bi bi-ui-checks-grid text-2xl"></i>
            </div>
            <div>
              <h2 className="text-lg font-bold text-blue-900 leading-tight">Selecciona el tipo de servicio</h2>
              <p className="text-xs text-blue-700">Elige el trámite que deseas iniciar</p>
            </div>
          </div>
        </div>
        {/* Contenido scrollable */}
        <div className="flex flex-col gap-3 w-full px-5 py-5 items-center" style={{ maxHeight: 'calc(80vh - 64px)', overflowY: 'auto' }}>
          {tipos.map((tipo) => (
            <button
              key={tipo.nombre}
              disabled={!tipo.habilitado}
              onClick={() => tipo.habilitado && onSeleccionar(tipo.nombre)}
              className={`w-full py-2 text-base rounded-md font-semibold transition-all
                ${tipo.habilitado
                  ? 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                  : 'bg-gray-200 text-gray-400 cursor-not-allowed'}`}
            >
              {tipo.nombre}
            </button>
          ))}
          <button
            onClick={onClose}
            className="mt-2 text-gray-500 hover:text-red-600 text-sm"
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default SeleccionarTipoSolicitud; 