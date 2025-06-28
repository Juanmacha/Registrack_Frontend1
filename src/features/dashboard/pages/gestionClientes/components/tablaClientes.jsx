import React from "react";

const TablaClientes = ({ clientes, onVer, onToggleEstado, deshabilitarAcciones }) => (
  <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 z-40">
    <div className="overflow-x-auto w-full">
      <table className="table-auto w-full divide-y divide-gray-100 text-sm text-gray-700">
        <thead className="text-left text-sm text-gray-500 bg-gray-50">
          <tr>
            <th className="px-6 py-4 text-center">#</th>
            <th className="px-6 py-4 text-center">Documento</th>
            <th className="px-6 py-4 text-center">Nombre</th>
            <th className="px-6 py-4 text-center">Apellido</th>
            <th className="px-6 py-4 text-center">Email</th>
            <th className="px-6 py-4 text-center">Teléfono</th>
            <th className="px-6 py-4 text-center">Nit Empresa</th>
            <th className="px-6 py-4 text-center">Nombre Empresa</th>
            <th className="px-6 py-4 text-center">Marca</th>
            <th className="px-6 py-4 text-center">T. Persona</th>
            <th className="px-6 py-4 text-center">Estado</th>
            <th className="px-6 py-4 text-center">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
          {clientes.length > 0 ? (
            clientes.map((c, idx) => (
              <tr key={idx}>
                <td className="px-6 py-4 text-center">{idx + 1}</td>
                <td className="px-6 py-4 text-center">{c.documento}</td>
                <td className="px-6 py-4 text-center">{c.nombre}</td>
                <td className="px-6 py-4 text-center">{c.apellido}</td>
                <td className="px-6 py-4 text-center">{c.email}</td>
                <td className="px-6 py-4 text-center">{c.telefono}</td>
                <td className="px-6 py-4 text-center">{c.nitEmpresa}</td>
                <td className="px-6 py-4 text-center">{c.nombreEmpresa}</td>
                <td className="px-6 py-4 text-center">{c.marca}</td>
                <td className="px-6 py-4 text-center">{c.tipoPersona}</td>
                <td className="px-6 py-4 text-center">
                  <button
                    className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                      c.estado === "Activo"
                        ? "text-green-800"
                        : "text-red-800"
                    }`}
                    onClick={() => onToggleEstado(idx)}
                    disabled={deshabilitarAcciones}
                  >
                    {c.estado || "Inactivo"}
                  </button>
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center">
                    <button
                      onClick={() => onVer(idx)}
                      title="Ver detalle"
                      className="btn btn-outline-info rounded-circle p-0 d-flex align-items-center justify-center custom-hover"
                      style={{
                        width: "32px",
                        height: "32px",
                        borderColor: "#1E4A85",
                        color: "#1E4A85",
                      }}
                      disabled={deshabilitarAcciones}
                    >
                      <i className="bi bi-eye-fill text-base"></i>
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" className="text-center py-4 text-sm text-gray-500">
                No hay clientes registrados.
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

export default TablaClientes;
