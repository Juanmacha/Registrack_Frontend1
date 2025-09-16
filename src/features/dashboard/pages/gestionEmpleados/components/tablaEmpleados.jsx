import React from "react";

const CustomCheckbox = ({ isChecked, onChange, disabled }) => {
  return (
    <label className={`flex items-center justify-center ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
      <div className="relative">
        <input type="checkbox" className="sr-only" checked={isChecked} onChange={onChange} disabled={disabled} />
        <div className={`block w-10 h-6 rounded-full ${isChecked ? 'bg-green-500' : (disabled ? 'bg-gray-200' : 'bg-gray-300')}`}></div>
        <div className={`dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition-transform ${isChecked ? 'transform translate-x-full' : ''}`}></div>
      </div>
    </label>
  );
};

const TablaEmpleados = ({ empleados, onVer, onEditar, onEliminar, onToggleEstado, deshabilitarAcciones = false }) => {

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 z-40">
      {/* Eliminar overflow-x-auto para evitar scroll horizontal */}
      <div className="w-full">
        <table className="table-auto w-full divide-y divide-gray-100 text-sm text-gray-700">
          <thead className="text-left text-sm text-gray-500 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-center">#</th>
              <th className="px-6 py-4 text-center">Tipo de Documento</th>
              <th className="px-6 py-4 text-center">Documento</th>
              <th className="px-6 py-4 text-center">Nombre Completo</th>
              <th className="px-6 py-4 text-center">Email</th>
              <th className="px-6 py-4 text-center">Rol</th>
              <th className="px-6 py-4 text-center">Estado</th>
              <th className="px-6 py-4 text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
            {empleados.length > 0 ? (
              empleados.map((item, idx) => (
                <tr key={item.id}>
                  <td className="px-6 py-4 text-center">{idx + 1}</td>
                  <td className="px-6 py-4 text-center">{item.tipoDocumento}</td>
                  <td className="px-6 py-4 text-center">{item.documento}</td>
                  <td className="px-6 py-4 text-center">{item.nombre} {item.apellidos}</td>
                  <td className="px-6 py-4 text-center">{item.email}</td>
                  <td className="px-6 py-4 text-center">{item.rol}</td>
                  <td className="px-6 py-4 text-center">
                    <CustomCheckbox
                      isChecked={item.estado.toLowerCase() === 'activo'}
                      onChange={() => onToggleEstado(item)}
                      disabled={deshabilitarAcciones}
                    />
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-1 flex-nowrap">
                      <button
                        title="Editar"
                        onClick={() => onEditar(item)}
                        className="btn btn-outline-secondary btn-sm custom-hover rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        title="Ver"
                        onClick={() => onVer(item)}
                        className="btn btn-outline-info btn-sm custom-hover rounded-circle p-0 d-flex align-items-center justify-content-center"
                        style={{ width: "32px", height: "32px", borderColor: "#1E4A85", color: "#1E4A85" }}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center py-6 text-gray-500 italic">
                  No hay empleados registrados.
                </td>
              </tr>
            )}
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

export default TablaEmpleados;
