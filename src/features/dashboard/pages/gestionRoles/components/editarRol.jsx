import React from "react";
import { mostrarMensajeExito } from "../../../../../utils/alerts";
import { RoleService } from "../../../../../utils/mockDataService";

const EditarRolModal = ({ rolEditable, setRolEditable, roles, setRoles }) => {
  console.log("EditarRolModal - rolEditable:", rolEditable);  // Depuración

  if (!rolEditable) {
    return null;
  }

  const handleSubmit = (e) => {
    e.preventDefault();

    console.log("Guardando cambios para rol:", rolEditable);

    // Usar RoleService para actualizar el rol
    const rolActualizado = RoleService.update(rolEditable.id, rolEditable);
    if (rolActualizado) {
      setRoles(RoleService.getAll());
      setRolEditable(null);
      mostrarMensajeExito("¡Rol actualizado exitosamente!");
    } else {
      mostrarMensajeExito("Error al actualizar el rol.");
    }
  };

  const handleCheckboxChange = (recurso, accion) => {
    setRolEditable((prev) => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [recurso]: {
          ...prev.permisos[recurso],
          [accion]: !prev.permisos[recurso]?.[accion],
        },
      },
    }));
  };

  // Mapear los recursos del sistema centralizado
  const recursosSistema = [
    { key: 'usuarios', nombre: 'Usuarios' },
    { key: 'empleados', nombre: 'Empleados' },
    { key: 'clientes', nombre: 'Clientes' },
    { key: 'ventas', nombre: 'Ventas' },
    { key: 'pagos', nombre: 'Pagos' },
    { key: 'citas', nombre: 'Citas' },
    { key: 'roles', nombre: 'Roles' },
    { key: 'reportes', nombre: 'Reportes' },
    { key: 'configuracion', nombre: 'Configuración' }
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${rolEditable.nombre}`}
              alt={rolEditable.nombre}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">Editar Rol: {rolEditable.nombre}</h2>
              <p className="text-sm text-gray-600">Modifica los permisos del rol</p>
            </div>
          </div>
          {/* Botón de cerrar eliminado */}
        </div>

        {/* Content */}
        <div className="p-6">
          <form onSubmit={handleSubmit}>
            {/* Información básica */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Información Básica</h3>
              <div className="grid grid-cols-1 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Nombre del Rol
                  </label>
                  <input
                    type="text"
                    value={rolEditable.nombre}
                    onChange={(e) => setRolEditable({ ...rolEditable, nombre: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Permisos */}
            <div>
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Permisos del Sistema</h3>
              <div className="overflow-x-auto">
                <table className="w-full border rounded-lg">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700 border-b">Recurso</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Crear</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Leer</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Actualizar</th>
                      <th className="px-4 py-3 text-center text-sm font-semibold text-gray-700 border-b">Eliminar</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recursosSistema.map((recurso, index) => (
                      <tr key={recurso.key} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                        <td className="px-4 py-3 text-sm font-medium text-gray-800 border-b">
                          {recurso.nombre}
                        </td>
                        {['crear', 'leer', 'actualizar', 'eliminar'].map((accion) => (
                          <td key={accion} className="px-4 py-3 text-center border-b">
                            <input
                              type="checkbox"
                              checked={!!rolEditable.permisos?.[recurso.key]?.[accion]}
                              onChange={() => handleCheckboxChange(recurso.key, accion)}
                              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500"
                            />
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={() => setRolEditable(null)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cancelar
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 transition-colors"
          >
            Guardar Cambios
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditarRolModal;
