import React from "react";
import eliminarRol from "./eliminarRol";
// import { getEstadoBadge } from "../services/rolesG"; // Removed this import
import { RoleService } from "../../../../../utils/mockDataService";

const CustomCheckbox = ({ isChecked, onChange }) => {
  return (
    <label className="flex items-center justify-center cursor-pointer">
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={isChecked} onChange={onChange} />
        <div className={`block w-10 h-6 rounded-full ${isChecked ? 'bg-green-500' : 'bg-gray-300'}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isChecked ? 'transform translate-x-full' : ''}`}></div>
      </div>
    </label>
  );
};

const TablaRoles = ({ roles, setRolEditable, setRolSeleccionado, setRoles, onToggleEstado }) => {
  // Removed local toggleEstado function

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
              <th className="px-6 py-4 font-medium text-left">Rol</th>
              <th className="px-6 py-4 font-medium text-center">Permisos</th>
              <th className="px-6 py-4 font-medium text-center">Estado</th>
              <th className="px-6 py-4 font-medium text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {roles.map((rol, index) => {
              const permisosActivos = contarPermisosActivos(rol.permisos);
              return (
                <tr key={rol.id || index}>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3 justify-start">
                      <img
                        src={`https://api.dicebear.com/7.x/initials/svg?seed=${rol.nombre}`}
                        alt={rol.nombre}
                        className="w-10 h-10 rounded-full"
                      />
                      <div className="text-sm font-semibold text-gray-800">{rol.nombre}</div>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex flex-col items-center">
                      <span className="text-sm font-semibold text-blue-600">
                        {permisosActivos} permisos
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <CustomCheckbox
                      isChecked={rol.estado.toLowerCase() === 'activo'}
                      onChange={() => onToggleEstado(rol)}
                    />
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