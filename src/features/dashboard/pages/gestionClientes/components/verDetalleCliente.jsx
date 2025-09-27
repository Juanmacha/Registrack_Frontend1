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
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl overflow-hidden max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-person-badge text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Detalle del Cliente</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="space-y-6">
            {/* Información Personal */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-blue-100 p-2 rounded-full">
                  <i className="bi bi-person text-blue-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Información Personal</h3>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 space-y-3">
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
                <div className="pt-2 border-t border-blue-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="bi bi-person-badge text-blue-500"></i>
                      <span className="text-gray-600">Tipo de Persona:</span>
                      <span className="font-medium text-gray-800">{cliente.tipoPersona || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="bi bi-card-text text-blue-500"></i>
                      <span className="text-gray-600">Tipo de Documento:</span>
                      <span className="font-medium text-gray-800">{cliente.tipoDocumento || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="bi bi-123 text-blue-500"></i>
                      <span className="text-gray-600">Número de Documento:</span>
                      <span className="font-medium text-gray-800">{cliente.documento || 'N/A'}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="bi bi-flag text-blue-500"></i>
                      <span className="text-gray-600">Estado:</span>
                      {getEstadoBadge(cliente.estado)}
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="bi bi-tag text-blue-500"></i>
                      <span className="text-gray-600">Origen:</span>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        cliente.origen === 'solicitud' 
                          ? 'bg-blue-100 text-blue-800' 
                          : cliente.origen === 'directo' 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-purple-100 text-purple-800'
                      }`}>
                        {cliente.origen === 'solicitud' ? 'Solicitud' : cliente.origen === 'directo' ? 'Directo' : 'Importado'}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Información de la Empresa */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-green-100 p-2 rounded-full">
                  <i className="bi bi-building text-green-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Información de la Empresa</h3>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-green-100 p-3 rounded-full">
                    <i className="bi bi-building text-green-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{cliente.nombreEmpresa || 'N/A'}</div>
                    <div className="text-sm text-gray-500">NIT: {cliente.nitEmpresa || 'N/A'}</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-green-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {cliente.direccionEmpresa && cliente.direccionEmpresa !== 'N/A' && (
                      <div className="flex items-start space-x-2 text-sm">
                        <i className="bi bi-geo-alt text-green-500 mt-0.5"></i>
                        <div>
                          <span className="text-gray-600">Dirección:</span>
                          <div className="font-medium text-gray-800">{cliente.direccionEmpresa}</div>
                        </div>
                      </div>
                    )}
                    {cliente.telefonoEmpresa && cliente.telefonoEmpresa !== 'N/A' && (
                      <div className="flex items-center space-x-2 text-sm">
                        <i className="bi bi-telephone text-green-500"></i>
                        <span className="text-gray-600">Teléfono:</span>
                        <span className="font-medium text-gray-800">{cliente.telefonoEmpresa}</span>
                      </div>
                    )}
                    {cliente.correoEmpresa && cliente.correoEmpresa !== 'N/A' && (
                      <div className="flex items-center space-x-2 text-sm">
                        <i className="bi bi-envelope text-green-500"></i>
                        <span className="text-gray-600">Correo:</span>
                        <span className="font-medium text-gray-800">{cliente.correoEmpresa}</span>
                      </div>
                    )}
                    {cliente.ciudadEmpresa && cliente.ciudadEmpresa !== 'N/A' && (
                      <div className="flex items-center space-x-2 text-sm">
                        <i className="bi bi-geo text-green-500"></i>
                        <span className="text-gray-600">Ciudad:</span>
                        <span className="font-medium text-gray-800">{cliente.ciudadEmpresa}</span>
                      </div>
                    )}
                    {cliente.paisEmpresa && cliente.paisEmpresa !== 'N/A' && (
                      <div className="flex items-center space-x-2 text-sm">
                        <i className="bi bi-globe text-green-500"></i>
                        <span className="text-gray-600">País:</span>
                        <span className="font-medium text-gray-800">{cliente.paisEmpresa}</span>
                      </div>
                    )}
                    {cliente.tipoEmpresa && cliente.tipoEmpresa !== 'N/A' && (
                      <div className="flex items-center space-x-2 text-sm">
                        <i className="bi bi-briefcase text-green-500"></i>
                        <span className="text-gray-600">Tipo de Empresa:</span>
                        <span className="font-medium text-gray-800">{cliente.tipoEmpresa}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Información del Cliente */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <div className="bg-purple-100 p-2 rounded-full">
                  <i className="bi bi-award text-purple-600 text-lg"></i>
                </div>
                <h3 className="text-lg font-semibold text-gray-800">Información del Cliente</h3>
              </div>
              <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-purple-100 p-3 rounded-full">
                    <i className="bi bi-award text-purple-600 text-xl"></i>
                  </div>
                  <div>
                    <div className="font-medium text-gray-800">{cliente.marca || 'N/A'}</div>
                    <div className="text-sm text-gray-500">Marca registrada</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-purple-200">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="bi bi-calendar text-purple-500"></i>
                      <span className="text-gray-600">Fecha de Creación:</span>
                      <span className="font-medium text-gray-800">
                        {cliente.fechaCreacion ? new Date(cliente.fechaCreacion).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 text-sm">
                      <i className="bi bi-clock text-purple-500"></i>
                      <span className="text-gray-600">Última Actualización:</span>
                      <span className="font-medium text-gray-800">
                        {cliente.fechaActualizacion ? new Date(cliente.fechaActualizacion).toLocaleDateString() : 'N/A'}
                      </span>
                    </div>
                  </div>
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
