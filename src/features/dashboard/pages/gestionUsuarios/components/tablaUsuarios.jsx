import React, { useState, useEffect } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "bootstrap-icons/font/bootstrap-icons.css";

const TablaUsuarios = ({
  usuarios = [],
  handleDelete,
  onVer,
  onEditar,
  onToggleEstado,
  deshabilitarAcciones = false,
  registrosPorPagina = 5
}) => {
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [usuariosFiltrados, setUsuariosFiltrados] = useState([]);

  useEffect(() => {
    const filtrados = usuarios.filter((u) => {
      const nombreCompleto = `${u.firstName} ${u.lastName}`;
      const texto = `${u.documentType} ${u.documentNumber} ${nombreCompleto} ${u.email} ${u.role}`.toLowerCase();
      return texto.includes(busqueda.toLowerCase());
    });
    setUsuariosFiltrados(filtrados);
    setPaginaActual(1); // Reiniciar a la primera página si se busca
  }, [busqueda, usuarios]);

  const totalPaginas = Math.ceil(usuariosFiltrados.length / registrosPorPagina);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const usuariosPaginados = usuariosFiltrados.slice(inicio, fin);

  return (
    <div className="w-full max-w-full">

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 z-40">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full divide-y divide-gray-100">
            <thead className="text-left text-sm text-gray-500 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-center">#</th>
                <th className="px-6 py-4 text-center">Tipo Doc</th>
                <th className="px-6 py-4 text-center">Documento</th>
                <th className="px-6 py-4 text-center">Nombre Completo</th>
                <th className="px-6 py-4 text-center">Email</th>
                <th className="px-6 py-4 text-center">Rol</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {usuariosPaginados.map((u, idx) => (
                <tr key={idx}>
                  <td className="px-6 py-4 text-center">{inicio + idx + 1}</td>
                  <td className="px-6 py-4 text-center">{u.documentType}</td>
                  <td className="px-6 py-4 text-center">{u.documentNumber}</td>
                  <td className="px-6 py-4 text-center">{u.firstName} {u.lastName}</td>
                  <td className="px-6 py-4 text-center">{u.email}</td>
                  <td className="px-6 py-4 text-center">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        u.role === "administrador"
                          ? "text-blue-600 text-blue-800"
                          : "text-green-600 text-green-800"
                      }`}
                    >
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <button
                      className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${
                        u.estado?.toLowerCase() === "activo"
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                      onClick={() => onToggleEstado(u)}
                      disabled={deshabilitarAcciones}
                    >
                      {u.estado || "Inactivo"}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex gap-2 justify-center flex-wrap">
                      <button
                        className="btn btn-outline-info rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                        style={{ width: "32px", height: "32px", borderColor: "#1E4A85", color: "#1E4A85" }}
                        title="Ver detalle"
                        onClick={() => onVer(u)}
                        disabled={deshabilitarAcciones}
                      >
                        <i className="bi bi-eye-fill"></i>
                      </button>
                      <button
                        className="btn btn-outline-primary rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                        style={{ width: "32px", height: "32px", borderColor: "#275FAA", color: "#275FAA" }}
                        title="Editar"
                        onClick={() => onEditar(u, inicio + idx)}
                        disabled={deshabilitarAcciones}
                      >
                        <i className="bi bi-pencil"></i>
                      </button>
                      <button
                        className="btn btn-outline-danger rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                        style={{ width: "32px", height: "32px", borderColor: "#DC3545", color: "#DC3545" }}
                        title="Eliminar"
                        onClick={() => handleDelete(u)}
                        disabled={deshabilitarAcciones}
                      >
                        <i className="bi bi-trash-fill"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {usuariosFiltrados.length === 0 && (
                <tr>
                  <td colSpan="8" className="px-6 py-4 text-center text-gray-400">
                    No hay usuarios registrados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Hover animado */}
      <style>{`
        .custom-hover:hover {
          opacity: 0.8;
          transform: scale(1.05);
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default TablaUsuarios;
