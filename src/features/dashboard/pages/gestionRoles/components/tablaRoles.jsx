import React from "react";
import eliminarRol from "./eliminarRol";
import { getEstadoBadge } from "../services/rolesG";
import { RoleService } from "../../../../../utils/mockDataService";

const TablaRoles = ({ roles, setRolEditable, setRolSeleccionado, setRoles }) => {
  // Cambiar estado del rol (Activo/Inactivo)
  const toggleEstado = (rol) => {
    const nuevoEstado = rol.estado === "Activo" ? "Inactivo" : "Activo";
    const rolActualizado = RoleService.update(rol.id, { estado: nuevoEstado });
    if (rolActualizado) {
      setRoles(RoleService.getAll());
    }
  };

  // Contar permisos activos
  const contarPermisosActivos = (permisos) => {
    if (!permisos) return 0;
    let total = 0;
    Object.values(permisos).forEach(recurso => {
      if (recurso && typeof recurso === 'object') {
        Object.values(recurso).forEach(permiso => {
          if (permiso === true) total++;
        });
      }
    });
    return total;
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 mt-4 w-full">
      <div className="overflow-x-auto w-full">
        <table className="table-auto w-full divide-y divide-gray-100">
          <thead className="text-left text-sm text-gray-500 bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-medium text-center">Rol</th>
              <th className="px-6 py-4 font-medium text-center">Descripción</th>
              <th className="px-6 py-4 font-medium text-center">Permisos</th>
              <th className="px-6 py-4 font-medium text-center">Estado</th>
              <th className="px-6 py-4 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {roles.map((rol, index) => {
              const { color, texto } = getEstadoBadge(rol.estado);
              const permisosActivos = contarPermisosActivos(rol.permisos);
              return (
                <tr key={rol.id || index}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-center">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${rol.nombre}`}
                        alt={rol.nombre}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="text-sm font-semibold text-gray-800">{rol.nombre}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="text-sm text-gray-600 max-w-xs truncate" title={rol.descripcion}>
                      {rol.descripcion || "Sin descripción"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {permisosActivos} permisos
                      </span>
                      <span className="text-xs text-gray-500">
                        {Object.keys(rol.permisos || {}).length} recursos
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2 relative">
                      <span style={{ color, fontWeight: 600, fontSize: "14px" }}>{texto}</span>
                      <label className="inline-flex relative items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          checked={rol.estado === "Activo"}
                          onChange={() => toggleEstado(rol)}
                        />
                        <div className="w-11 h-6 bg-gray-200 rounded-full peer peer-checked:bg-green-500 transition-all after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:after:translate-x-full peer-checked:after:border-white"></div>
                      </label>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        className="btn btn-outline-primary rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                        style={{ width: "32px", height: "32px", borderColor: "#275FAA", color: "#275FAA" }}
                        onClick={() => setRolEditable(rol)}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-info rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                        style={{ width: "32px", height: "32px", borderColor: "#1E4A85", color: "#1E4A85" }}
                        onClick={() => setRolSeleccionado(rol)}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                        style={{ width: "32px", height: "32px", borderColor: "#DC3545", color: "#DC3545" }}
                        onClick={() => eliminarRol(index, roles, setRoles)}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <style jsx>{`
        .custom-hover:hover {
          opacity: 0.8;
          transform: scale(1.05);
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TablaRoles;
