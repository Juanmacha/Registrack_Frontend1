import React from "react";
import { mostrarMensajeExito } from "../../../../../utils/alerts";

const EditarRolModal = ({ rolEditable, setRolEditable, roles, setRoles }) => {
  console.log("EditarRolModal - rolEditable:", rolEditable);  // Depuración

  if (!rolEditable) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Guardando cambios para rol:", rolEditable);

    const actualizados = roles.map((rol) => {
      if (rol.id === rolEditable.id) {
        return { ...rol, ...rolEditable };
      }
      return rol;
    });

    setRoles(actualizados);
    localStorage.setItem("roles", JSON.stringify(actualizados));

    setRolEditable(null);
    mostrarMensajeExito("¡Rol actualizado exitosamente!");
  };

  const handleCheckboxChange = (modelo, accion) => {
    setRolEditable((prev) => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [modelo]: {
          ...prev.permisos[modelo],
          [accion]: !prev.permisos[modelo]?.[accion],
        },
      },
    }));
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
        <h2 className="text-xl font-bold mb-4">Editar rol</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Nombre del rol</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2 text-sm"
              value={rolEditable.nombre || ""}
              onChange={(e) =>
                setRolEditable({
                  ...rolEditable,
                  nombre: e.target.value,
                })
              }
              required
            />
          </div>

          <div className="mb-2">
            <label className="block text-sm font-medium mb-1">Estado</label>
            <select
              className="w-full border rounded-md px-2 py-1 text-sm"
              value={rolEditable.estado || "activo"}
              onChange={(e) =>
                setRolEditable({
                  ...rolEditable,
                  estado: e.target.value,
                })
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
                {[
                  "Dashboard",
                  "Citas",
                  "Usuarios",
                  "Certificacion",
                  "Amplificacion de Servicios",
                  "Renovacion",
                  "Proceso de Oposicion",
                  "Roles",
                ].map((modelo) => (
                  <tr key={modelo}>
                    <td className="px-3 py-2 border">{modelo}</td>
                    {["crear", "editar", "eliminar", "ver", "estado"].map((accion) => (
                      <td key={accion} className="px-3 py-2 border text-center">
                        <input
                          type="checkbox"
                          checked={!!rolEditable.permisos?.[modelo]?.[accion]}
                          onChange={() => handleCheckboxChange(modelo, accion)}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={() => setRolEditable(null)}
            >
              Cancelar
            </button>
            <button type="submit" className="btn btn-primary">
              Guardar Cambios
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarRolModal;
