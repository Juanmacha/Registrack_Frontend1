import React from "react";

const VerRol = ({ rol, onClose, modelosDisponibles }) => {
  if (!rol) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-2xl overflow-hidden max-h-[90vh] overflow-y-auto p-6 relative">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center -mx-6 -mt-6 mb-4 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-person-gear text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">Detalles del Rol</h2>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6 flex flex-col items-center justify-center min-h-[300px]">
          <h3 className="text-sm font-semibold mb-3 text-gray-700 self-start">Permisos y Privilegios</h3>
          <div className="w-full flex justify-center">
            <table className="table-auto w-auto border rounded-lg text-center text-sm">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-2">Modelo</th>
                  <th className="px-4 py-2">Crear</th>
                  <th className="px-4 py-2">Editar</th>
                  <th className="px-4 py-2">Eliminar</th>
                  <th className="px-4 py-2">Ver Detalles</th>
                  <th className="px-4 py-2">Cambiar Estado</th>
                </tr>
              </thead>
              <tbody>
                {modelosDisponibles.map((modelo) => (
                  <tr key={modelo}>
                    <td className="px-4 py-2 font-medium">{modelo}</td>
                    {["crear", "editar", "eliminar", "ver", "estado"].map((accion) => {
                      const permisoActivo = rol.permisos?.[modelo]?.[accion];
                      return (
                        <td key={accion} className="px-4 py-2 text-center">
                          <span
                            className={`inline-block w-3 h-3 rounded-full ${
                              permisoActivo ? "bg-green-500" : "bg-red-500"
                            }`}
                          ></span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Footer */}
        <div className="bg-gray-50 px-6 py-4 border-t border-gray-200 flex justify-end -mx-6 -mb-6 mt-6 rounded-b-xl">
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

export default VerRol;
