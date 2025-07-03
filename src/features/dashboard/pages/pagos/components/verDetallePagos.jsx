import React from "react";

const VerDetallePago = ({ datos, isOpen, onClose }) => {
  if (!isOpen || !datos) return null;

  const getEstadoBadge = (estado) => {
    if (estado === true) {
      return (
        <span className="px-3 py-1 text-green-700 bg-green-100 rounded-full text-xs font-semibold">
          Completado
        </span>
      );
    }
    if (estado === false) {
      return (
        <span className="px-3 py-1 text-red-700 bg-red-100 rounded-full text-xs font-semibold">
          Fallido
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-gray-700 bg-gray-100 rounded-full text-xs font-semibold">
        Desconocido
      </span>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-green-100 p-2 rounded-full">
              <i className="bi bi-cash-coin text-green-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Detalle del Pago</h2>
              <p className="text-sm text-gray-500">ID de Pago: {datos.id_pago}</p>
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
            {/* Información del pago */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Información del Pago</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Monto:</span>
                  <span className="font-medium text-gray-800">${datos.monto.toLocaleString()}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Fecha del Pago:</span>
                  <span className="font-medium text-gray-800">
                    {new Date(datos.fecha_pago).toLocaleDateString()}
                  </span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Método de Pago:</span>
                  <span className="font-medium text-gray-800">{datos.metodo_pago}</span>
                </div>
              </div>
            </div>

            {/* Orden y Estado */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Orden y Estado</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">ID Orden Servicio:</span>
                  <span className="font-medium text-gray-800">{datos.id_orden_servicio}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600">Estado:</span>
                  {getEstadoBadge(datos.estado)}
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

export default VerDetallePago;
