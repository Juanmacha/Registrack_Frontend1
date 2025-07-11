import React from "react";

const ModalDetalleServicio = ({ abierto, cerrar, datos }) => {
  if (!abierto || !datos) return null;

  const getEstadoBadge = (estado) => {
    const estadoLower = (estado || "").toLowerCase();
    if (estadoLower.includes("proceso")) {
      return (
        <span className="px-3 py-1 text-blue-700 bg-blue-100 rounded-full text-xs font-semibold">
          {estado}
        </span>
      );
    }
    if (estadoLower.includes("estudio")) {
      return (
        <span className="px-3 py-1 text-yellow-700 bg-yellow-100 rounded-full text-xs font-semibold">
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
    <div className="modal-responsive">
      <div className="modal-content-responsive">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-info-circle text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Detalle del Servicio</h2>
              <p className="text-sm text-gray-500">Servicio con inactividad prolongada</p>
            </div>
          </div>
          <button 
            onClick={cerrar}
            className="text-gray-900 hover:text-red-700 bg-gray-50"
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Información del Servicio */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Información del Servicio</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 w-12 h-12 rounded-full flex items-center justify-center text-2xl font-bold text-blue-700">
                    <i className="bi bi-briefcase"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{datos.servicio}</div>
                    <div className="text-sm text-gray-500">Cliente: {datos.cliente}</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Estado:</span>
                    {getEstadoBadge(datos.estado)}
                  </div>
                </div>
              </div>
            </div>

            {/* Detalles Adicionales */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Detalles Adicionales</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-person-badge text-gray-400"></i>
                  <span className="text-gray-600">Empleado Asignado:</span>
                  <span className="font-medium text-gray-800">{datos.empleado}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-clock-history text-gray-400"></i>
                  <span className="text-gray-600">Tiempo de Inactividad:</span>
                  <span className="font-medium text-gray-800">{datos.inactividad}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-exclamation-triangle text-yellow-400"></i>
                  <span className="text-gray-600">Alerta:</span>
                  <span className="font-medium text-yellow-700">Inactividad Prolongada</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={cerrar}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ModalDetalleServicio; 