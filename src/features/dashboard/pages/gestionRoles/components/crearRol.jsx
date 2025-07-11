import React from "react";

const CrearRolModal = ({
  showModal,
  setShowModal,
  nuevoRol,
  setNuevoRol,
  handleSubmit,
  handleCheckboxChange,
  modelosDisponibles,
}) => {
  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center -mx-6 -mt-6 mb-4 rounded-t-xl">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-person-gear text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Crear nuevo rol</h2>
            </div>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Nombre del rol
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={nuevoRol.nombre}
              onChange={(e) =>
                setNuevoRol({ ...nuevoRol, nombre: e.target.value })
              }
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              className="w-full border rounded-md px-2 py-1 text-sm"
              value={nuevoRol.estado}
              onChange={(e) =>
                setNuevoRol({ ...nuevoRol, estado: e.target.value })
              }
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>

          <div>
            <h3 className="text-sm font-semibold mb-3">Permisos por modelo:</h3>
            <table className="w-full text-sm border rounded-md">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-3 py-2 border">Modelos</th>
                  <th className="px-3 py-2 border text-center">Crear</th>
                  <th className="px-3 py-2 border text-center">Editar</th>
                  <th className="px-3 py-2 border text-center">Eliminar</th>
                  <th className="px-3 py-2 border text-center">Ver Detalles</th>
                  <th className="px-3 py-2 border text-center">Cambiar Estado</th>
                </tr>
              </thead>
              <tbody>
                {modelosDisponibles.map((modelo) => (
                  <tr key={modelo}>
                    <td className="px-3 py-2 border">{modelo}</td>
                    {["crear", "editar", "eliminar", "ver", "estado"].map(
                      (accion) => (
                        <td
                          key={accion}
                          className="px-3 py-2 border text-center"
                        >
                          <input
                            type="checkbox"
                            checked={!!nuevoRol.permisos?.[modelo]?.[accion]}
                            onChange={() =>
                              handleCheckboxChange(modelo, accion)
                            }
                          />
                        </td>
                      )
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 flex items-center">
              <i className="bi bi-exclamation-circle text-gray-400 mr-2"></i>
              * Todos los campos son obligatorios
            </p>
            <div className="flex space-x-3">
            <button
              type="button"
              onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancelar
            </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                Crear Rol
            </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearRolModal;
