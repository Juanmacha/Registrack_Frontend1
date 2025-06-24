import React, { useEffect, useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import SideBarGeneral from "../../components/sideBarGeneral";
import NavBar from "../../components/navBarGeneral";
import dataUsuarios from "./services/dataUsuarios";

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("usuarios")) || [];
    if (stored.length === 0) {
      localStorage.setItem("usuarios", JSON.stringify(dataUsuarios));
      setUsuarios(dataUsuarios);
    } else {
      setUsuarios(stored);
    }
  }, []);

  const handleDelete = (index) => {
    const confirmed = confirm("¿Estás seguro de que deseas eliminar este usuario?");
    if (confirmed) {
      const updated = usuarios.filter((_, i) => i !== index);
      setUsuarios(updated);
      localStorage.setItem("usuarios", JSON.stringify(updated));
      alert("Usuario eliminado correctamente.");
    }
  };

  return (
    <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
      <SideBarGeneral />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <NavBar titulo="Gestión de Usuarios" />

        <div className="w-full max-w-full p-6">
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Buscar usuario..."
              className="form-control w-1/4 h-9 text-sm border border-gray-300 rounded-md"
            />
            <button className="btn btn-primary px-5 py-2 text-sm rounded-md">
              <i className="bi bi-person-plus-fill"></i> Registrar Usuario
            </button>
          </div>

          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300">
            <div className="overflow-x-auto w-full">
              <table className="table-auto w-full divide-y divide-gray-100">
                <thead className="text-left text-sm text-gray-500 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-center">#</th>
                    <th className="px-6 py-4 font-medium text-center">Tipo Doc</th>
                    <th className="px-6 py-4 font-medium text-center">Documento</th>
                    <th className="px-6 py-4 font-medium text-center">Nombre</th>
                    <th className="px-6 py-4 font-medium text-center">Apellido</th>
                    <th className="px-6 py-4 font-medium text-center">Email</th>
                    <th className="px-6 py-4 font-medium text-center">Rol</th>
                    <th className="px-6 py-4 font-medium text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                  {usuarios.map((u, idx) => (
                    <tr key={idx}>
                      <td className="px-6 py-4 text-center">{idx + 1}</td>
                      <td className="px-6 py-4 text-center">{u.documentType}</td>
                      <td className="px-6 py-4 text-center">{u.documentNumber}</td>
                      <td className="px-6 py-4 text-center">{u.firstName}</td>
                      <td className="px-6 py-4 text-center">{u.lastName}</td>
                      <td className="px-6 py-4 text-center">{u.email}</td>
                      <td className="px-6 py-4 text-center">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            u.role === "administrador"
                              ? "bg-blue-100 text-blue-800"
                              : "bg-green-100 text-green-800"
                          }`}
                        >
                          {u.role}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center flex-wrap">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            title="Ver detalle"
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                          <button
                            className="btn btn-outline-warning btn-sm"
                            title="Editar"
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>
                          <button
                            onClick={() => handleDelete(idx)}
                            className="btn btn-outline-danger btn-sm"
                            title="Eliminar"
                          >
                            <i className="bi bi-trash-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {usuarios.length === 0 && (
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
        </div>
      </div>
    </div>
  );
};

export default GestionUsuarios;
