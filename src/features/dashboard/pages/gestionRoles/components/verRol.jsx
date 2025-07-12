import React from "react";
import { mostrarMensajeExito } from "../../../../../utils/alerts";

const DetalleRolModal = ({ rol, onClose, modelosDisponibles }) => {
  console.log("DetalleRolModal - rol:", rol);  // Depuración

  if (!rol) {
    return null;
  }

  // Mapear los recursos del sistema centralizado a los modelos de la interfaz
  const mapearRecursos = (permisos) => {
    if (!permisos) return [];
    
    const mapeo = {
      usuarios: "Usuarios",
      empleados: "Empleados", 
      clientes: "Clientes",
      ventas: "Ventas",
      pagos: "Pagos",
      citas: "Citas",
      roles: "Roles",
      reportes: "Reportes",
      configuracion: "Configuración"
    };

    return Object.entries(permisos).map(([recurso, permisosRecurso]) => ({
      modelo: mapeo[recurso] || recurso,
      permisos: permisosRecurso
    }));
  };

  const recursosMapeados = mapearRecursos(rol.permisos);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <img
              src={`https://api.dicebear.com/7.x/initials/svg?seed=${rol.nombre}`}
              alt={rol.nombre}
              className="w-12 h-12 rounded-full"
            />
            <div>
              <h2 className="text-xl font-bold text-gray-800">{rol.nombre}</h2>
              <p className="text-sm text-gray-600">{rol.descripcion}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <i className="bi bi-x-lg text-xl"></i>
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {/* Información del rol */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-800 mb-3">Información del Rol</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="text-sm font-medium text-gray-600">Estado:</span>
                <span className={`ml-2 px-2 py-1 text-xs font-semibold rounded-full ${
                  rol.estado === 'Activo' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                }`}>
                  {rol.estado}
                </span>
              </div>
              <div>
                <span className="text-sm font-medium text-gray-600">ID:</span>
                <span className="ml-2 text-sm text-gray-800">{rol.id}</span>
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
                  {recursosMapeados.map((recurso, index) => (
                    <tr key={index} className={index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                      <td className="px-4 py-3 text-sm font-medium text-gray-800 border-b">
                        {recurso.modelo}
                      </td>
                      {['crear', 'leer', 'actualizar', 'eliminar'].map((accion) => (
                        <td key={accion} className="px-4 py-3 text-center border-b">
                          <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-semibold ${
                            recurso.permisos[accion] 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {recurso.permisos[accion] ? '✓' : '✗'}
                          </span>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Resumen de permisos */}
          <div className="mt-6 p-4 bg-blue-50 rounded-lg">
            <h4 className="text-sm font-semibold text-blue-800 mb-2">Resumen de Permisos</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
              <div>
                <span className="text-blue-600 font-medium">Total de recursos:</span>
                <span className="ml-2 text-gray-800">{recursosMapeados.length}</span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Permisos activos:</span>
                <span className="ml-2 text-gray-800">
                  {recursosMapeados.reduce((total, recurso) => 
                    total + Object.values(recurso.permisos).filter(p => p).length, 0
                  )}
                </span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Permisos totales:</span>
                <span className="ml-2 text-gray-800">
                  {recursosMapeados.reduce((total, recurso) => 
                    total + Object.keys(recurso.permisos).length, 0
                  )}
                </span>
              </div>
              <div>
                <span className="text-blue-600 font-medium">Porcentaje:</span>
                <span className="ml-2 text-gray-800">
                  {recursosMapeados.length > 0 
                    ? Math.round((recursosMapeados.reduce((total, recurso) => 
                        total + Object.values(recurso.permisos).filter(p => p).length, 0
                      ) / recursosMapeados.reduce((total, recurso) => 
                        total + Object.keys(recurso.permisos).length, 0
                      )) * 100)
                    : 0}%
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetalleRolModal;
