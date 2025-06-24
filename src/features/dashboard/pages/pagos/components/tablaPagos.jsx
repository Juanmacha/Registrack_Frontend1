import React from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import pagos from "../services/dataPagos"; // mock de pagos
import getEstadoPagoBadge from "../services/getEstadoPagoBadge"; // asegúrate que sea .js y no .jsx

const Tablapagos = () => {
  return (
    <div className="w-full max-w-full">
      {/* Encabezado */}
      <div className="flex items-center justify-between px-4 mb-4 w-full">
        <input
          type="text"
          placeholder="Buscar..."
          className="form-control w-1/4 h-9 text-sm border border-gray-300 rounded-md"
        />

        <div className="flex gap-3">
          <button className="btn btn-success px-5 py-2 text-sm rounded-md whitespace-nowrap">
            <i className="bi bi-file-earmark-excel-fill"></i>
            Descargar Excel
          </button>
        </div>
      </div>

      {/* Tabla de pagos */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full divide-y divide-gray-100">
            <thead className="text-left text-sm text-gray-500 bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium text-center">ID</th>
                <th className="px-6 py-4 font-medium text-center">Cliente</th>
                <th className="px-6 py-4 font-medium text-center">Servicio</th>
                <th className="px-6 py-4 font-medium text-center">Monto</th>
                <th className="px-6 py-4 font-medium text-center">Fecha</th>
                <th className="px-6 py-4 font-medium text-center">Método</th>
                <th className="px-6 py-4 font-medium text-center">Estado</th>
                <th className="px-6 py-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {pagos.map((item) => {
                const { colorClass, label } = getEstadoPagoBadge(item.estado);

                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4 text-center">{item.id}</td>
                    <td className="px-6 py-4 text-center">{item.clienteId}</td>
                    <td className="px-6 py-4 text-center">{item.servicioId}</td>
                    <td className="px-6 py-4 text-center">
                      ${item.monto.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      {new Date(item.fecha).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">{item.metodoPago}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 ${colorClass} rounded-full text-xs font-semibold`}
                      >
                        {label}
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
                        {item.comprobante && (
                          <a
                            href={item.comprobante}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-secondary btn-sm"
                            title="Ver comprobante"
                          >
                            <i className="bi bi-file-earmark-text"></i>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Tablapagos;
