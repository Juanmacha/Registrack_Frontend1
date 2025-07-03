import React from "react";

const VerDetalleCliente = ({ cliente, isOpen, onClose }) => {
  if (!isOpen || !cliente) return null;

  const getEstadoBadge = (estado) => {
    const estadoLower = (estado || "").toLowerCase();
    if (estadoLower === "activo") {
      return (
        <span className="px-3 py-1 text-green-700 bg-green-100 rounded-full text-xs font-semibold">
          Activo
        </span>
      );
    }
    if (estadoLower === "inactivo") {
      return (
        <span className="px-3 py-1 text-red-700 bg-red-100 rounded-full text-xs font-semibold">
          Inactivo
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
              <i className="bi bi-person-badge text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Detalle del Cliente</h2>
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
            {/* Información Personal */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Información Personal</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <img
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${cliente.nombre} ${cliente.apellido}`}
                    alt={`${cliente.nombre} ${cliente.apellido}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{cliente.nombre} {cliente.apellido}</div>
                    <div className="text-sm text-gray-500">{cliente.email}</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm">
                    <i className="bi bi-telephone text-gray-400"></i>
                    <span className="text-gray-600">Teléfono:</span>
                    <span className="font-medium text-gray-800">{cliente.telefono}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-2">
                    <i className="bi bi-person-badge text-gray-400"></i>
                    <span className="text-gray-600">Tipo de Persona:</span>
                    <span className="font-medium text-gray-800">{cliente.tipoPersona}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm mt-2">
                    <i className="bi bi-flag text-gray-400"></i>
                    <span className="text-gray-600">Estado:</span>
                    {getEstadoBadge(cliente.estado)}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Documento y Empresa */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Información de Documento y Empresa</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-card-text text-gray-400"></i>
                  <span className="text-gray-600">Documento:</span>
                  <span className="font-medium text-gray-800">{cliente.documento}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-building text-gray-400"></i>
                  <span className="text-gray-600">NIT Empresa:</span>
                  <span className="font-medium text-gray-800">{cliente.nitEmpresa}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-building text-gray-400"></i>
                  <span className="text-gray-600">Nombre Empresa:</span>
                  <span className="font-medium text-gray-800">{cliente.nombreEmpresa}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-award text-gray-400"></i>
                  <span className="text-gray-600">Marca:</span>
                  <span className="font-medium text-gray-800">{cliente.marca}</span>
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

export default VerDetalleCliente;
