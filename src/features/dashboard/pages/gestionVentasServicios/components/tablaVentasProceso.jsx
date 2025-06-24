import React, { useState } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import datosMock from "../services/tablaVentasProcesosData";
import getEstadoBadge from "../services/getEstadoBadge";
import VerDetalleVenta from "../components/verDetalleVenta";
import Observaciones from "../components/observaciones";
import { Link } from "react-router-dom";

const TablaVentasProceso = () => {
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalObservacionOpen, setModalObservacionOpen] = useState(false);
  const [datoSeleccionado, setDatoSeleccionado] = useState(null);

  const abrirDetalle = (item) => {
    setDatoSeleccionado(item);
    setModalDetalleOpen(true);
  };

  const abrirObservacion = (item) => {
    setDatoSeleccionado(item);
    setModalObservacionOpen(true);
  };

  return (
    <div className="w-full max-w-full">
      {/* Encabezado con título, buscador y botón */}
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

      {/* Tabla */}
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 z-40">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full divide-y divide-gray-100">
            <thead className="text-left text-sm text-gray-500 bg-gray-50">
              <tr>
                <th className="px-6 py-4 font-medium text-center">Titular</th>
                <th className="px-6 py-4 font-medium text-center">Expediente</th>
                <th className="px-6 py-4 font-medium text-center">Solicitud</th>
                <th className="px-6 py-4 font-medium text-center">Marca</th>
                <th className="px-6 py-4 font-medium text-center">Encargado</th>
                <th className="px-6 py-4 font-medium text-center">Cita</th>
                <th className="px-6 py-4 font-medium text-center">Estado</th>
                <th className="px-6 py-4 font-medium text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {datosMock.map((item) => {
                const { label, colorClass } = getEstadoBadge(item.estado);

                return (
                  <tr key={item.id}>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.titular}`}
                          alt={item.titular}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-gray-800">{item.titular}</div>
                          <div className="text-xs text-gray-500">{item.tipoPersona}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{item.expediente}</td>
                    <td className="px-6 py-4 text-center">{item.tipoSolicitud}</td>
                    <td className="px-6 py-4 text-center">{item.marca}</td>
                    <td className="px-6 py-4 text-center">{item.encargado}</td>
                    <td className="px-6 py-4 text-center">
                      {item.proximaCita || (
                        <span className="text-xs italic text-gray-400">Sin fecha</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${colorClass}`}
                      >
                        {label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button className="btn btn-outline-secondary btn-sm">
                          <i className="bi bi-pencil-fill"></i>
                        </button>
                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => abrirObservacion(item)}
                        >
                          <i className="bi bi-chat-left-text-fill"></i>
                        </button>
                        <Link to="/calendario" className="btn btn-outline-secondary btn-sm">
                          <i className="bi bi-calendar-event-fill"></i>
                        </Link>

                        <button
                          className="btn btn-outline-secondary btn-sm"
                          onClick={() => abrirDetalle(item)}
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        <button className="btn btn-outline-danger btn-sm">
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
      </div>

      {/* Modales */}
      <VerDetalleVenta
        datos={datoSeleccionado}
        isOpen={modalDetalleOpen}
        onClose={() => setModalDetalleOpen(false)}
      />
      <Observaciones
        isOpen={modalObservacionOpen}
        onClose={() => setModalObservacionOpen(false)}
        onGuardar={() => { }}
      />
    </div>
  );
};

export default TablaVentasProceso;
