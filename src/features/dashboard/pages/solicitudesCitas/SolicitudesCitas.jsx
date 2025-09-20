import React, { useState, useEffect } from 'react';
import TablaSolicitudesCitas from './TablaSolicitudesCitas';
import { mockDataService } from '../../../../utils/mockDataService.js';
import "bootstrap-icons/font/bootstrap-icons.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";
import DownloadButton from "../../../../shared/components/DownloadButton";

const SolicitudesCitas = () => {
  const [solicitudes, setSolicitudes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [filterEstado, setFilterEstado] = useState('');
  const [filterTipo, setFilterTipo] = useState('');
  const [selectedSolicitud, setSelectedSolicitud] = useState(null);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [deshabilitarAcciones, setDeshabilitarAcciones] = useState(false);

  const solicitudesPorPagina = 5;

  useEffect(() => {
    cargarSolicitudes();
    
    // Suscribirse a cambios en las solicitudes
    const unsubscribe = mockDataService.DataChangeNotifier?.subscribe?.((dataType, action, data) => {
      if (dataType === 'solicitudCita') {
        cargarSolicitudes();
      }
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  const cargarSolicitudes = () => {
    try {
      const data = mockDataService.SolicitudCitaService.getAll();
      setSolicitudes(data);
    } catch (error) {
      console.error('Error al cargar solicitudes:', error);
    }
  };

  function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const solicitudesFiltradas = solicitudes.filter((s) => {
    const texto = `${s.nombre} ${s.email} ${s.numeroDocumento} ${s.tipoSolicitud} ${s.estado}`;
    const cumpleBusqueda = normalizarTexto(texto).includes(normalizarTexto(busqueda));
    const cumpleEstado = !filterEstado || s.estado === filterEstado;
    const cumpleTipo = !filterTipo || s.tipoSolicitud === filterTipo;
    
    return cumpleBusqueda && cumpleEstado && cumpleTipo;
  });

  const totalPaginas = Math.ceil(solicitudesFiltradas.length / solicitudesPorPagina);
  const indiceInicio = (paginaActual - 1) * solicitudesPorPagina;
  const indiceFin = indiceInicio + solicitudesPorPagina;
  const solicitudesPagina = solicitudesFiltradas.slice(indiceInicio, indiceFin);

  const irAPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPaginaActual(num);
  };

  const handleVer = (idx) => {
    setSelectedSolicitud(solicitudesPagina[idx]);
    setMostrarModalVer(true);
    setDeshabilitarAcciones(true);
  };

  const handleExportarExcel = () => {
    const encabezados = [
      "Nombre", "Email", "Teléfono", "Tipo Documento", "Número Documento", "Tipo Solicitud", "Estado", "Fecha", "Mensaje"
    ];
    const datosExcel = solicitudesFiltradas.map((s) => ({
      "Nombre": s.nombre,
      "Email": s.email,
      "Teléfono": s.telefono,
      "Tipo Documento": s.tipoDocumento,
      "Número Documento": s.numeroDocumento,
      "Tipo Solicitud": s.tipoSolicitud,
      "Estado": s.estado,
      "Fecha": new Date(s.fechaCreacion).toLocaleDateString(),
      "Mensaje": s.mensaje
    }));
    const worksheet = XLSX.utils.json_to_sheet(datosExcel, { header: encabezados });
    worksheet["!cols"] = [
      { wch: 20 }, { wch: 25 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 20 }, { wch: 12 }, { wch: 12 }, { wch: 30 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Solicitudes_Citas");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "solicitudes_citas.xlsx");
    AlertService.success("¡Éxito!", "Archivo Excel descargado exitosamente.");
  };

  const tiposSolicitud = [...new Set(solicitudes.map(s => s.tipoSolicitud))];

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full px-4">
        <div className="mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Gestión de Solicitudes de Citas</h1>
          <p className="text-gray-600 mt-2">
            Administra las solicitudes de citas enviadas desde el formulario del landing page
          </p>
        </div>

        <div className="flex items-center justify-between px-4 mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar"
            className="form-control w-50 h-9 text-sm border border-gray-300 rounded-md px-3"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />

          <div className="flex gap-3">
            <select
              value={filterEstado}
              onChange={(e) => {
                setFilterEstado(e.target.value);
                setPaginaActual(1);
              }}
              className="form-control h-9 text-sm border border-gray-300 rounded-md px-3"
            >
              <option value="">Todos los estados</option>
              <option value="Pendiente">Pendiente</option>
              <option value="Aprobada">Aprobada</option>
              <option value="Rechazada">Rechazada</option>
            </select>
            
            <select
              value={filterTipo}
              onChange={(e) => {
                setFilterTipo(e.target.value);
                setPaginaActual(1);
              }}
              className="form-control h-9 text-sm border border-gray-300 rounded-md px-3"
            >
              <option value="">Todos los tipos</option>
              {tiposSolicitud.map(tipo => (
                <option key={tipo} value={tipo}>{tipo}</option>
              ))}
            </select>

            <DownloadButton
              type="excel"
              onClick={handleExportarExcel}
              title="Descargar Excel"
            />
          </div>
        </div>

        <TablaSolicitudesCitas
          solicitudes={solicitudesPagina}
          onVer={handleVer}
          deshabilitarAcciones={deshabilitarAcciones}
          cargarSolicitudes={cargarSolicitudes}
        />

        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{solicitudesFiltradas.length === 0 ? 0 : indiceInicio + 1}</span> a {" "}
            <span className="font-medium">{Math.min(indiceFin, solicitudesFiltradas.length)}</span> de {" "}
            <span className="font-medium">{solicitudesFiltradas.length}</span> resultados
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => irAPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50 flex items-center justify-center h-9 w-9 border border-blue-200"
            >
              <i className="bi bi-chevron-left text-base"></i>
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <button
                key={pagina}
                onClick={() => irAPagina(pagina)}
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
              onClick={() => irAPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50 flex items-center justify-center h-9 w-9 border border-blue-200"
            >
              <i className="bi bi-chevron-right text-base"></i>
            </button>
          </div>
        </div>

        {/* Modal Ver Detalle */}
        {mostrarModalVer && selectedSolicitud && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl max-h-[75vh] overflow-hidden">
              {/* Header */}
              <div className="bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center space-x-3">
                <div className="flex items-center space-x-3">
                  <div className="bg-blue-100 p-2 rounded-full">
                    <i className="bi bi-calendar-check text-blue-600 text-lg"></i>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-800">Detalle de Solicitud de Cita</h2>
                    <p className="text-xs text-gray-500">ID: {selectedSolicitud.id || "No disponible"}</p>
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 overflow-y-auto max-h-[calc(75vh-120px)]">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                  {/* Información del Cliente */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Información del Cliente</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2">
                      <div className="flex items-center space-x-2">
                        <img
                          src={`https://api.dicebear.com/7.x/initials/svg?seed=${selectedSolicitud.nombre}`}
                          alt={selectedSolicitud.nombre}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-800 text-sm">{selectedSolicitud.nombre}</div>
                          <div className="text-xs text-gray-500">{selectedSolicitud.email}</div>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-gray-200 space-y-1 text-xs">
                        <div className="flex items-center space-x-2">
                          <i className="bi bi-card-text text-gray-400"></i>
                          <span className="text-gray-600">Documento:</span>
                          <span className="font-medium text-gray-800">{selectedSolicitud.tipoDocumento} - {selectedSolicitud.numeroDocumento}</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <i className="bi bi-telephone text-gray-400"></i>
                          <span className="text-gray-600">Teléfono:</span>
                          <span className="font-medium text-gray-800">{selectedSolicitud.telefono || "No disponible"}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Detalles de la Solicitud */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Detalles de la Solicitud</h3>
                    <div className="bg-gray-50 rounded-lg p-3 space-y-2 text-xs">
                      <div className="flex items-center justify-between">
                        <div className="text-gray-600">Estado:</div>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                          selectedSolicitud.estado === 'Pendiente' ? 'text-yellow-700 bg-yellow-100' :
                          selectedSolicitud.estado === 'Aprobada' ? 'text-green-700 bg-green-100' :
                          selectedSolicitud.estado === 'Rechazada' ? 'text-red-700 bg-red-100' :
                          'text-gray-700 bg-gray-100'
                        }`}>
                          {selectedSolicitud.estado}
                        </span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="bi bi-bookmark text-gray-400"></i>
                        <span className="text-gray-600">Tipo:</span>
                        <span className="font-medium text-gray-800">{selectedSolicitud.tipoSolicitud}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <i className="bi bi-calendar text-gray-400"></i>
                        <span className="text-gray-600">Fecha:</span>
                        <span className="font-medium text-gray-800">{new Date(selectedSolicitud.fechaCreacion).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Mensaje */}
                  <div className="space-y-3">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider">Mensaje del Cliente</h3>
                    <div className="bg-gray-50 rounded-lg p-3">
                      <p className="text-gray-700 text-xs leading-relaxed">
                        {selectedSolicitud.mensaje || "Sin mensaje"}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Observaciones o Motivo de Rechazo */}
                {(selectedSolicitud.observaciones || selectedSolicitud.motivoRechazo) && (
                  <div className="mt-4">
                    <h3 className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-2">
                      {selectedSolicitud.observaciones ? 'Observaciones' : 'Motivo de Rechazo'}
                    </h3>
                    <div className={`rounded-lg p-3 ${
                      selectedSolicitud.observaciones ? 'bg-blue-50' : 'bg-red-50'
                    }`}>
                      <p className={`text-xs leading-relaxed ${
                        selectedSolicitud.observaciones ? 'text-blue-700' : 'text-red-700'
                      }`}>
                        {selectedSolicitud.observaciones || selectedSolicitud.motivoRechazo}
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Footer */}
              <div className="bg-gray-50 px-6 py-3 border-t border-gray-200 flex justify-end">
                <button
                  onClick={() => {
                    setMostrarModalVer(false);
                    setDeshabilitarAcciones(false);
                  }}
                  className="px-4 py-2 text-xs font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cerrar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SolicitudesCitas;