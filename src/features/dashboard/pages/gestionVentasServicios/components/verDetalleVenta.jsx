import React from "react";

const VerDetalleVenta = ({ datos, isOpen, onClose }) => {
  if (!isOpen || !datos) return null;

  const getEstadoBadge = (estado) => {
    const estadoLower = estado.toLowerCase();
    if (estadoLower === "finalizado") {
      return (
        <span className="px-3 py-1 text-blue-700 bg-blue-100 rounded-full text-xs font-semibold">
          Finalizado
        </span>
      );
    }
    if (estadoLower === "anulado") {
      return (
        <span className="px-3 py-1 text-red-700 bg-red-100 rounded-full text-xs font-semibold">
          Anulado
        </span>
      );
    }
    if (estadoLower.includes("revisión") || estadoLower.includes("activo")) {
      return (
        <span className="px-3 py-1 text-green-700 bg-green-100 rounded-full text-xs font-semibold">
          {estado}
        </span>
      );
    }
    if (estadoLower.includes("pendiente")) {
      return (
        <span className="px-3 py-1 text-yellow-800 bg-yellow-100 rounded-full text-xs font-semibold">
          {estado}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-gray-700 bg-gray-100 rounded-full text-xs font-semibold">
        {estado}
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-eye text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Detalle del Servicio</h2>
              <p className="text-sm text-gray-500">Expediente: {datos.expediente}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-900 hover:text-red-700 bg-gray-50"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del Cliente */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Información del Cliente</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${datos.titular}`}
                    alt={datos.titular}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{datos.titular}</div>
                    <div className="text-sm text-gray-500">{datos.tipoPersona}</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm">
                    <i className="bi bi-building text-gray-400"></i>
                    <span className="text-gray-600">Marca:</span>
                    <span className="font-medium text-gray-800">{datos.marca}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles de la Solicitud */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Detalles de la Solicitud</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-600">Estado:</div>
                  {getEstadoBadge(datos.estado)}
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-file-text text-gray-400"></i>
                  <span className="text-gray-600">Tipo:</span>
                  <span className="font-medium text-gray-800">{datos.tipoSolicitud}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-person text-gray-400"></i>
                  <span className="text-gray-600">Encargado:</span>
                  <span className="font-medium text-gray-800">{datos.encargado}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-calendar-event text-gray-400"></i>
                  <span className="text-gray-600">Próxima Cita:</span>
                  <span className="font-medium text-gray-800">
                    {datos.proximaCita || (
                      <span className="italic text-gray-400">Sin citas asignadas</span>
                    )}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerDetalleVenta;
