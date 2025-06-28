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
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
        <h2 className="text-xl font-bold mb-4">Crear nuevo rol</h2>
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

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setShowModal(false)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CrearRolModal;
