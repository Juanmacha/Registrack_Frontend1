import React from "react";

const VerDetalleUsuario = ({ usuario, isOpen, onClose }) => {
  if (!isOpen || !usuario) return null;

  const getRolBadge = (rol) => {
    const rolLower = rol.toLowerCase();
    if (rolLower === "administrador") {
      return (
        <span className="px-3 py-1 text-blue-700 bg-blue-100 rounded-full text-xs font-semibold">
          Administrador
        </span>
      );
    }
    if (rolLower === "empleado") {
      return (
        <span className="px-3 py-1 text-green-700 bg-green-100 rounded-full text-xs font-semibold">
          Empleado
        </span>
      );
    }
    if (rolLower === "cliente") {
      return (
        <span className="px-3 py-1 text-purple-700 bg-purple-100 rounded-full text-xs font-semibold">
          Cliente
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-gray-700 bg-gray-100 rounded-full text-xs font-semibold">
        {rol}
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
              <i className="bi bi-person text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Detalle del Usuario</h2>
            </div>
          </div>
          {/* Botón de cerrar eliminado */}
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
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${usuario.firstName} ${usuario.lastName}`}
                    alt={`${usuario.firstName} ${usuario.lastName}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{usuario.firstName} {usuario.lastName}</div>
                    <div className="text-sm text-gray-500">{usuario.email}</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200">
                  <div className="flex items-center space-x-2 text-sm">
                    <i className="bi bi-person-badge text-gray-400"></i>
                    <span className="text-gray-600">Rol:</span>
                    {getRolBadge(usuario.role)}
                  </div>
                </div>
              </div>
            </div>

            {/* Información de Documento */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Información de Documento</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-file-text text-gray-400"></i>
                  <span className="text-gray-600">Tipo de Documento:</span>
                  <span className="font-medium text-gray-800">{usuario.documentType}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-123 text-gray-400"></i>
                  <span className="text-gray-600">Número de Documento:</span>
                  <span className="font-medium text-gray-800">{usuario.documentNumber}</span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-calendar-event text-gray-400"></i>
                  <span className="text-gray-600">Fecha de Registro:</span>
                  <span className="font-medium text-gray-800">
                    {usuario.createdAt ? new Date(usuario.createdAt).toLocaleDateString('es-ES') : (
                      <span className="italic text-gray-400">No disponible</span>
                    )}
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-sm">
                  <i className="bi bi-clock text-gray-400"></i>
                  <span className="text-gray-600">Última Actualización:</span>
                  <span className="font-medium text-gray-800">
                    {usuario.updatedAt ? new Date(usuario.updatedAt).toLocaleDateString('es-ES') : (
                      <span className="italic text-gray-400">No disponible</span>
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

export default VerDetalleUsuario;
