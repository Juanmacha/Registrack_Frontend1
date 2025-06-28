import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import VerDetalleVenta from "./verDetalleVenta";
import Observaciones from "./observaciones";
import EditarVenta from "./editarVenta";
import { getVentasEnProceso } from "../services/ventasService";
import { editarVenta } from "../services/editarVentaService";
import { anularVenta } from "../services/eliminarVentaService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import getEstadoBadge from "../services/getEstadoBadge";

const TablaVentasProceso = () => {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const registrosPorPagina = 5;
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalObservacionOpen, setModalObservacionOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [datoSeleccionado, setDatoSeleccionado] = useState(null);

  useEffect(() => {
    const resultado = getVentasEnProceso(paginaActual, registrosPorPagina, busqueda);
    setDatos(resultado.datos);
    setTotalPaginas(resultado.totalPaginas);
    setTotalRegistros(resultado.total);
  }, [paginaActual, busqueda]);

  const handleEliminar = async (id) => {
    const confirm = window.confirm("¿Seguro que deseas anular esta solicitud?");
    if (!confirm) return;

    try {
      const resultado = anularVenta(id);
      if (resultado) {
        setDatos(getVentasEnProceso());
      }
    } catch (error) {
      console.error("Error anulando:", error);
      alert("Ocurrió un error al anular la solicitud.");
    }
  };

  const handleGuardarEdicion = (datosActualizados) => {
    try {
      const resultado = editarVenta(datosActualizados.id, datosActualizados);
      if (resultado) {
        setDatos(getVentasEnProceso());
      }
      setModalEditarOpen(false);
    } catch (error) {
      console.error("Error al guardar la edición:", error);
      alert("Ocurrió un error al guardar los cambios.");
    }
  };

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex items-center justify-between px-4 mb-4 w-full">
        <input
          type="text"
          placeholder="Buscar por titular, marca o tipo de solicitud"
          className="form-control w-50 h-9 text-sm border border-gray-300 rounded-md px-3"
          value={busqueda}
          onChange={handleBusquedaChange}
        />

        <div className="flex gap-3">
          <button className="btn btn-primary px-4 py-2 text-sm rounded-md whitespace-nowrap">
            <i className="bi bi-plus-square"></i> Crear Solicitud
          </button>
          <button className="btn btn-success px-4 py-2 text-sm rounded-md whitespace-nowrap">
            <i className="bi bi-file-earmark-excel-fill"></i> Descargar Excel
          </button>
        </div>
      </div>

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
              {datos.map((item) => {
                const { color, texto } = getEstadoBadge(item.estado);
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
                        <span className="text-xs italic text-gray-400">Sin citas</span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span style={{ color, fontWeight: 600, fontSize: "14px" }}>{texto}</span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button
                          className="btn btn-outline-primary rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                          style={{ width: "32px", height: "32px", borderColor: "#275FAA", color: "#275FAA" }}
                          onClick={() => {
                            setDatoSeleccionado(item);
                            setModalEditarOpen(true);
                          }}
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                          style={{ width: "32px", height: "32px", borderColor: "#6C757D", color: "#6C757D" }}
                          onClick={() => setModalObservacionOpen(true)}
                        >
                          <i className="bi bi-chat-left-text-fill"></i>
                        </button>
                        <button
                          className="btn btn-outline-dark rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                          style={{ width: "32px", height: "32px", borderColor: "#2C3E50", color: "#2C3E50" }}
                        >
                          <i className="bi bi-calendar-event-fill"></i>
                        </button>
                        <button
                          className="btn btn-outline-info rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                          style={{ width: "32px", height: "32px", borderColor: "#1E4A85", color: "#1E4A85" }}
                          onClick={() => {
                            setDatoSeleccionado(item);
                            setModalDetalleOpen(true);
                          }}
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        <button
                          className="btn btn-outline-danger rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                          style={{ width: "32px", height: "32px", borderColor: "#DC3545", color: "#DC3545" }}
                          onClick={() => handleEliminar(item.id)}
                        >
                          <i className="bi bi-dash-circle"></i>
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

      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="text-sm text-gray-700">
          Mostrando{" "}
          <span className="font-medium">{(paginaActual - 1) * registrosPorPagina + 1}</span> a{" "}
          <span className="font-medium">
            {Math.min(paginaActual * registrosPorPagina, totalRegistros)}
          </span>{" "}
          de <span className="font-medium">{totalRegistros}</span> resultados
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPaginaActual(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="p-2 rounded-full bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center h-8 w-8"
          >
            <FaChevronLeft className="text-sm" />
          </button>
          {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
            <button
              key={pagina}
              onClick={() => setPaginaActual(pagina)}
              className={`h-8 w-8 rounded-full flex items-center justify-center ${
                paginaActual === pagina
                  ? "bg-blue-600 text-white"
                  : "bg-white text-blue-600 border border-blue-200"
              }`}
            >
              {pagina}
            </button>
          ))}
          <button
            onClick={() => setPaginaActual(paginaActual + 1)}
            disabled={paginaActual === totalPaginas}
            className="p-2 rounded-full bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center h-8 w-8"
          >
            <FaChevronRight className="text-sm" />
          </button>
        </div>
      </div>

      <VerDetalleVenta
        datos={datoSeleccionado}
        isOpen={modalDetalleOpen}
        onClose={() => setModalDetalleOpen(false)}
      />
      <Observaciones
        isOpen={modalObservacionOpen}
        onClose={() => setModalObservacionOpen(false)}
        onGuardar={() => {}}
      />
      <EditarVenta
        datos={datoSeleccionado}
        isOpen={modalEditarOpen}
        onClose={() => setModalEditarOpen(false)}
        onGuardar={handleGuardarEdicion}
      />

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

export default TablaVentasProceso;
