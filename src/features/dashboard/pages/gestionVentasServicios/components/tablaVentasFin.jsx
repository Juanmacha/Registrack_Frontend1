import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import VerDetalleVenta from "./verDetalleVenta";
import Observaciones from "./observaciones";
import EditarVenta from "./editarVenta";
import { getVentasFinalizadas, agregarComentario, getFromStorage } from "../services/ventasService";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import getEstadoBadge from "../services/getEstadoBadge"; // Usa el mismo servicio
import { getServicios } from '../services/serviciosManagementService';

const TablaVentasFin = () => {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const registrosPorPagina = 5;
  const [modalDetalleOpen, setModalDetalleOpen] = useState(false);
  const [modalObservacionOpen, setModalObservacionOpen] = useState(false);
  const [modalEditarOpen, setModalEditarOpen] = useState(false);
  const [datoSeleccionado, setDatoSeleccionado] = useState(null);
  const [servicioFiltro, setServicioFiltro] = useState('Todos');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);
  const [estadosDisponibles, setEstadosDisponibles] = useState([]);

  useEffect(() => {
    // Obtener servicios y estados únicos
    const servicios = getServicios().map(s => s.nombre);
    setServiciosDisponibles(['Todos', ...servicios]);
    // Obtener estados únicos de los datos
    const ventas = getFromStorage('ventasServiciosFin');
    const estados = Array.from(new Set(ventas.map(v => v.estado))).filter(Boolean);
    setEstadosDisponibles(['Todos', ...estados]);
  }, []);

  // Obtener todos los datos sin paginar, con protección robusta
  let allDatos = [];
  try {
    const raw = getFromStorage('ventasServiciosFin');
    if (Array.isArray(raw)) {
      allDatos = raw;
    } else {
      localStorage.setItem('ventasServiciosFin', '[]');
      allDatos = [];
    }
  } catch (e) {
    localStorage.setItem('ventasServiciosFin', '[]');
    allDatos = [];
  }

  // Filtrar por texto, servicio y estado
  const texto = busqueda.trim().toLowerCase();
  let datosFiltrados = allDatos.filter(item => {
    const coincideServicio = servicioFiltro === 'Todos' || item.tipoSolicitud === servicioFiltro;
    const coincideEstado = estadoFiltro === 'Todos' || item.estado === estadoFiltro;
    const coincideTexto =
      !texto ||
      (item.titular && item.titular.toLowerCase().includes(texto)) ||
      (item.marca && item.marca.toLowerCase().includes(texto));
    return coincideServicio && coincideEstado && coincideTexto;
  });
  // Eliminar duplicados por id (deja solo la primera ocurrencia)
  const idsVistos = new Set();
  datosFiltrados = datosFiltrados.filter(item => {
    if (!item.id || idsVistos.has(item.id)) return false;
    idsVistos.add(item.id);
    return true;
  });

  // Paginado manual
  const total = datosFiltrados.length;
  const totalPaginas = Math.max(1, Math.ceil(total / registrosPorPagina));
  useEffect(() => {
    if (paginaActual > totalPaginas) setPaginaActual(1);
    // eslint-disable-next-line
  }, [totalPaginas]);
  const inicio = (paginaActual - 1) * registrosPorPagina;
  const fin = inicio + registrosPorPagina;
  const datosPagina = datosFiltrados.slice(inicio, fin);

  // Refrescar datos
  const refrescar = () => {
    const resultado = getVentasFinalizadas(paginaActual, registrosPorPagina, busqueda);
    setDatos(resultado.datos);
    setTotalRegistros(resultado.total);
  };

  useEffect(() => {
    refrescar();
    // eslint-disable-next-line
  }, [paginaActual, busqueda]);

  const handleGuardarEdicion = () => {
    refrescar();
    setModalEditarOpen(false);
  };

  const handleGuardarComentario = (texto) => {
    if (datoSeleccionado && datoSeleccionado.id) {
      agregarComentario(datoSeleccionado.id, texto);
      refrescar();
    }
    setModalObservacionOpen(false);
  };

  return (
    <div className="w-full max-w-full">
      {/* Buscador y botones */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-4 mb-6 w-full">
        <div className="flex flex-col md:flex-row md:items-center gap-3 w-full">
          <div className="relative w-full md:w-80 flex-shrink-0">
            <span className="absolute left-3 top-2.5 text-gray-400"><i className="bi bi-search"></i></span>
            <input
              type="text"
              placeholder="Buscar por titular o marca"
              className="pl-9 pr-3 py-3 w-full text-base border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 bg-white shadow-md"
              value={busqueda}
              onChange={e => { setBusqueda(e.target.value); setPaginaActual(1); }}
            />
          </div>
          <div className="flex items-center gap-2 min-w-[180px]">
            <label className="text-sm text-gray-500" htmlFor="select-servicio">Servicio:</label>
            <select
              id="select-servicio"
              value={servicioFiltro}
              onChange={e => { setServicioFiltro(e.target.value); setPaginaActual(1); }}
              className="px-4 py-2 rounded-lg border border-blue-300 text-base font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              {serviciosDisponibles.map(servicio => (
                <option key={servicio} value={servicio}>{servicio}</option>
              ))}
            </select>
          </div>
          <div className="flex items-center gap-2 min-w-[180px]">
            <label className="text-sm text-gray-500" htmlFor="select-estado">Estado:</label>
            <select
              id="select-estado"
              value={estadoFiltro}
              onChange={e => { setEstadoFiltro(e.target.value); setPaginaActual(1); }}
              className="px-4 py-2 rounded-lg border border-blue-300 text-base font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
            >
              {estadosDisponibles.map(estado => (
                <option key={estado} value={estado}>{estado}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-3 ml-auto">
            <button className="bg-gradient-to-r from-blue-600 to-blue-400 text-white px-5 py-2 text-sm rounded-lg font-semibold shadow-md hover:from-blue-700 hover:to-blue-500 transition flex items-center gap-2">
              <i className="bi bi-file-earmark-excel-fill"></i> Descargar Excel
            </button>
          </div>
        </div>
      </div>
      {/* Tabla */}
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-lg hover:shadow-2xl transition-shadow duration-300 z-40">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full divide-y divide-gray-100">
            <thead className="text-left text-sm text-white bg-gradient-to-r from-blue-700 to-blue-500">
              <tr>
                <th className="px-6 py-4 font-semibold text-center">Titular</th>
                <th className="px-6 py-4 font-semibold text-center">Expediente</th>
                <th className="px-6 py-4 font-semibold text-center">Solicitud</th>
                <th className="px-6 py-4 font-semibold text-center">Marca</th>
                <th className="px-6 py-4 font-semibold text-center">Encargado</th>
                <th className="px-6 py-4 font-semibold text-center">Cita</th>
                <th className="px-6 py-4 font-semibold text-center">Estado</th>
                <th className="px-6 py-4 font-semibold text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {datosPagina.length === 0 ? (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400 text-lg">No se encontraron resultados.</td>
                </tr>
              ) : datosPagina.filter(item => item && typeof item === 'object').map((item, idx) => {
                try {
                  const { color, texto } = getEstadoBadge(item.estado);
                  const esAnulado = (item.estado || '').toLowerCase() === 'anulado';
                  return (
                    <tr key={item.id} className="hover:bg-blue-50 transition">
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${item.titular || 'N/A'}`}
                            alt={item.titular || 'N/A'}
                            className="w-10 h-10 rounded-full border-2 border-blue-200 shadow-sm"
                          />
                          <div>
                            <div className="font-semibold text-gray-800">{item.titular || 'Sin titular'}</div>
                            <div className="text-xs text-gray-500">{item.tipoPersona || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-center">{item.expediente || '-'}</td>
                      <td className="px-6 py-4 text-center">{item.tipoSolicitud || '-'}</td>
                      <td className="px-6 py-4 text-center">{item.marca || '-'}</td>
                      <td className="px-6 py-4 text-center">{item.encargado || '-'}</td>
                      <td className="px-6 py-4 text-center">
                        {item.proximaCita || (
                          <span className="text-xs italic text-gray-400">Sin citas</span>
                        )}
                      </td>
                      <td className="px-6 py-4 text-center">
                        <span style={{ color, fontWeight: 600, fontSize: "14px" }}>{texto || '-'}</span>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex gap-2 justify-center flex-wrap">
                          {!esAnulado && (
                            <>
                              <button
                                className="rounded-full p-0 flex items-center justify-center bg-white border border-blue-400 text-blue-600 hover:bg-blue-50 hover:shadow-md transition h-9 w-9"
                                onClick={() => {
                                  setDatoSeleccionado(item);
                                  setModalEditarOpen(true);
                                }}
                              >
                                <i className="bi bi-pencil"></i>
                              </button>
                              <button
                                className="rounded-full p-0 flex items-center justify-center bg-white border border-yellow-400 text-yellow-600 hover:bg-yellow-50 hover:shadow-md transition h-9 w-9"
                                onClick={() => {
                                  setDatoSeleccionado(item);
                                  setModalObservacionOpen(true);
                                }}
                              >
                                <i className="bi bi-chat-dots"></i>
                              </button>
                            </>
                          )}
                          <button
                            className="rounded-full p-0 flex items-center justify-center bg-white border border-blue-400 text-blue-600 hover:bg-blue-50 hover:shadow-md transition h-9 w-9"
                            onClick={() => {
                              setDatoSeleccionado(item);
                              setModalDetalleOpen(true);
                            }}
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                } catch (err) {
                  console.error('Error al renderizar fila de venta finalizada:', err, item);
                  return (
                    <tr key={item.id} className="bg-red-50">
                      <td colSpan={8} className="text-center text-red-600 py-4">Error al mostrar este registro. Revisa la consola para más detalles.</td>
                    </tr>
                  );
                }
              })}
            </tbody>
          </table>
        </div>
      </div>
      {/* Paginación */}
      <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
        <div className="text-sm text-gray-700">
          Mostrando{" "}
          <span className="font-medium">{(paginaActual - 1) * registrosPorPagina + 1}</span> a{" "}
          <span className="font-medium">
            {Math.min(paginaActual * registrosPorPagina, total)}
          </span>{" "}
          de <span className="font-medium">{total}</span> resultados
        </div>
        <div className="flex items-center justify-center gap-2">
          <button
            onClick={() => setPaginaActual(paginaActual - 1)}
            disabled={paginaActual === 1}
            className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50 flex items-center justify-center h-9 w-9 border border-blue-200"
          >
            <FaChevronLeft className="text-base" />
          </button>
          {Array.from({ length: Math.ceil(total / registrosPorPagina) }, (_, i) => i + 1).map((pagina) => (
            <button
              key={pagina}
              onClick={() => setPaginaActual(pagina)}
              className={`h-9 w-9 rounded-full flex items-center justify-center font-semibold transition border ${
                paginaActual === pagina
                  ? "bg-blue-600 text-white border-blue-600 shadow-md"
                  : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
              }`}
            >
              {pagina}
            </button>
          ))}
          <button
            onClick={() => setPaginaActual(paginaActual + 1)}
            disabled={paginaActual === Math.ceil(total / registrosPorPagina)}
            className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50 flex items-center justify-center h-9 w-9 border border-blue-200"
          >
            <FaChevronRight className="text-base" />
          </button>
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
        onGuardar={handleGuardarComentario}
      />
      <EditarVenta
        datos={datoSeleccionado}
        isOpen={modalEditarOpen}
        onClose={() => setModalEditarOpen(false)}
        onGuardar={handleGuardarEdicion}
      />
      {/* Estilo de botones */}
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

export default TablaVentasFin;
