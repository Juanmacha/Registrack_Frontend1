import React, { useEffect, useState } from "react";
import SideBarGeneral from "../../components/sideBarGeneral";
import NavBar from "../../components/navBarGeneral";
import dataClientes from "./services/dataClientes";
import "bootstrap-icons/font/bootstrap-icons.css";

const GestionClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [selectedCliente, setSelectedCliente] = useState(null);

  useEffect(() => {
    const stored = JSON.parse(localStorage.getItem("clientes")) || [];
    if (stored.length === 0) {
      localStorage.setItem("clientes", JSON.stringify(dataClientes));
      setClientes(dataClientes);
    } else {
      setClientes(stored);
    }
  }, []);

  const openView = (index) => {
    setSelectedCliente(clientes[index]);
  };

  return (
    <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
      <SideBarGeneral />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <NavBar titulo="Gestión de Clientes" />

        <div className="w-full max-w-full p-4">
          {/* Encabezado */}
          <div className="flex items-center justify-between mb-4">
            <input
              type="text"
              placeholder="Buscar cliente..."
              className="form-control w-1/4 h-9 text-sm border border-gray-300 rounded-md"
            />

            <div className="flex gap-3">
              <button className="btn btn-success px-5 py-2 text-sm rounded-md whitespace-nowrap">
                <i className="bi bi-file-earmark-excel-fill mr-2"></i>
                Exportar Excel
              </button>
            </div>
          </div>

          {/* Tabla */}
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300">
            <div className="overflow-x-auto w-full">
              <table className="table-auto w-full divide-y divide-gray-100">
                <thead className="text-left text-sm text-gray-500 bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 font-medium text-center">#</th>
                    <th className="px-6 py-4 font-medium text-center">Documento</th>
                    <th className="px-6 py-4 font-medium text-center">Nombre</th>
                    <th className="px-6 py-4 font-medium text-center">Apellido</th>
                    <th className="px-6 py-4 font-medium text-center">Email</th>
                    <th className="px-6 py-4 font-medium text-center">Teléfono</th>
                    <th className="px-6 py-4 font-medium text-center">Acciones</th>
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
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => openView(idx)}
                            className="btn btn-outline-secondary btn-sm"
                            title="Ver detalle"
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="7" className="text-center py-4">
                        No hay clientes registrados.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Detalle */}
          {selectedCliente && (
            <div className="mt-6 p-6 bg-white rounded-lg shadow-md border border-gray-200">
              <h4 className="text-lg font-semibold mb-4 text-blue-800">Detalles del Cliente</h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                <div>
                  <p><strong>Nombre:</strong> {selectedCliente.nombre}</p>
                  <p><strong>Apellido:</strong> {selectedCliente.apellido}</p>
                  <p><strong>Documento:</strong> {selectedCliente.documento}</p>
                </div>
                <div>
                  <p><strong>Email:</strong> {selectedCliente.email}</p>
                  <p><strong>Teléfono:</strong> {selectedCliente.telefono}</p>
                </div>
              </div>
              <button
                className="btn btn-secondary mt-4"
                onClick={() => setSelectedCliente(null)}
              >
                Cerrar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GestionClientes;
