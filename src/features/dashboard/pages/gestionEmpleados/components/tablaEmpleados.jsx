import React from "react";

const TablaEmpleados = ({ empleados, onVer, onEditar, onEliminar }) => {
  const getEstadoBadge = (estado) => {
    const color =
      {
        Activo: "text-green-800",
        Inactivo: "text-red-800",
        Eliminado: "text-yellow-800",
      }[estado] || "text-gray-700";

    return (
      <span className={`px-3 py-1 text-xs font-semibold rounded-full ${color}`}>
        {estado}
      </span>
    );
  };

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 z-40">
      <div className="overflow-x-auto w-full">
        <table className="table-auto w-full divide-y divide-gray-100 text-sm text-gray-700">
          <thead className="text-left text-sm text-gray-500 bg-gray-50">
            <tr>
              <th className="px-6 py-4 text-center">#</th>
              <th className="px-6 py-4 text-center">Tipo de Documento</th>
              <th className="px-6 py-4 text-center">Documento</th>
              <th className="px-6 py-4 text-center">Nombre</th>
              <th className="px-6 py-4 text-center">Apellidos</th>
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
                  <td className="px-6 py-4 text-center">{item.nombre}</td>
                  <td className="px-6 py-4 text-center">{item.apellidos}</td>
                  <td className="px-6 py-4 text-center">{item.email}</td>
                  <td className="px-6 py-4 text-center">{item.rol}</td>
                  <td className="px-6 py-4 text-center">
                    {getEstadoBadge(item.estado)}
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2 flex-wrap">
                      <button
                        title="Editar"
                        onClick={() => onEditar(item)}
                        className="btn btn-outline-secondary btn-sm custom-hover rounded-circle p-0 d-flex align-items-center justify-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="bi bi-pencil-fill"></i>
                      </button>
                      <button
                        title="Ver"
                        onClick={() => onVer(item)}
                        className="btn btn-outline-info btn-sm custom-hover rounded-circle p-0 d-flex align-items-center justify-center"
                        style={{ width: "32px", height: "32px", borderColor: "#1E4A85", color: "#1E4A85" }}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                      <button
                        title="Eliminar"
                        onClick={() => onEliminar(item)}
                        className="btn btn-outline-danger btn-sm custom-hover rounded-circle p-0 d-flex align-items-center justify-center"
                        style={{ width: "32px", height: "32px" }}
                      >
                        <i className="bi bi-trash-fill"></i>
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
