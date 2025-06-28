import React from "react";

const verRol = ({ rol, onClose, modelosDisponibles }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative">
        <h2 className="text-xl font-bold mb-4">Detalles del rol</h2>
        <p>
          <strong>Nombre:</strong> {rol.nombre}
        </p>
        <p>
          <strong>Estado:</strong> {rol.estado}
        </p>

        <div className="mt-6">
          <h3 className="text-sm font-semibold mb-3 text-gray-700">
            Permisos y Privilegios
          </h3>
          <div className="overflow-x-auto border rounded-lg shadow-sm">
            <table className="min-w-full divide-y divide-gray-200 text-sm">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2 text-left">Modelo</th>
                  <th className="px-4 py-2 text-center">Crear</th>
                  <th className="px-4 py-2 text-center">Editar</th>
                  <th className="px-4 py-2 text-center">Eliminar</th>
                  <th className="px-4 py-2 text-center">Ver Detalles</th>
                  <th className="px-4 py-2 text-center">Cambiar Estado</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
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

        <div className="flex justify-end mt-4">
          <button className="btn btn-secondary" onClick={onClose}>
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default verRol;
