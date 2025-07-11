import React from "react";

const VerEmpleadoModal = ({ showModal, setShowModal, empleado }) => {
  if (!showModal || !empleado) return null;

  const getEstadoBadge = (estado) => {
    const estadoLower = estado.toLowerCase();
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
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center space-x-3">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-person text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Detalle del Empleado</h2>
              <p className="text-sm text-gray-500">ID: {empleado.id || "No disponible"}</p>
            </div>
          </div>
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
                    src={`https://api.dicebear.com/7.x/initials/svg?seed=${empleado.nombre} ${empleado.apellidos}`}
                    alt={`${empleado.nombre} ${empleado.apellidos}`}
                    className="w-12 h-12 rounded-full"
                  />
                  <div>
                    <div className="font-medium text-gray-800">{empleado.nombre} {empleado.apellidos}</div>
                    <div className="text-sm text-gray-500">{empleado.rol}</div>
                  </div>
                </div>
                <div className="pt-2 border-t border-gray-200 space-y-2 text-sm">
                  <div className="flex items-center space-x-2">
                    <i className="bi bi-card-text text-gray-400"></i>
                    <span className="text-gray-600">Documento:</span>
                    <span className="font-medium text-gray-800">{empleado.documento}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <i className="bi bi-envelope text-gray-400"></i>
                    <span className="text-gray-600">Correo:</span>
                    <span className="font-medium text-gray-800">{empleado.email || "No disponible"}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Estado y Rol */}
            <div className="space-y-4">
              <h3 className="text-sm font-medium text-gray-500 uppercase tracking-wider">Detalles del Empleado</h3>
              <div className="bg-gray-50 rounded-lg p-4 space-y-3 text-sm">
                <div className="flex items-center justify-between">
                  <div className="text-gray-600">Estado:</div>
                  {getEstadoBadge(empleado.estado)}
                </div>
                <div className="flex items-center space-x-2">
                  <i className="bi bi-person-circle text-gray-400"></i>
                  <span className="text-gray-600">Rol:</span>
                  <span className="font-medium text-gray-800">{empleado.rol}</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end">
          <button
            onClick={() => setShowModal(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerEmpleadoModal;
