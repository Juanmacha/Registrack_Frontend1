import React, { useState } from 'react';
import { obtenerFechaCreacion, obtenerFechaFin, calcularDuracion } from '../services/procesosService.js';
import { PAISES } from '../../../../../shared/utils/paises.js';
import { usePayments } from '../../../../../shared/contexts/PaymentContext';
import { generarComprobantePDF } from '../../../../../shared/utils/generarComprobantePDF';

const DetalleProcesoModal = ({ proceso, onClose }) => {
  if (!proceso) return null;
  const paisObj = PAISES.find(p => p.nombre === proceso.pais);
  const { pagos } = usePayments();
  // Buscar pago simulado asociado por nombreMarca, tipoDocumento y numeroDocumento
  const pagoAsociado = pagos.find(p =>
    p.nombreMarca === proceso.nombreMarca &&
    p.tipoDocumento === proceso.tipoDocumento &&
    p.numeroDocumento === proceso.numeroDocumento
  );
  const handleDescargarComprobante = () => {
    if (pagoAsociado) {
      generarComprobantePDF({
        servicioOposicion: pagoAsociado.servicioOposicion,
        nombreMarca: pagoAsociado.nombreMarca,
        nombreRepresentante: pagoAsociado.nombreRepresentante,
        tipoDocumento: pagoAsociado.tipoDocumento,
        numeroDocumento: pagoAsociado.numeroDocumento,
        fechaPago: pagoAsociado.fechaPago,
        valorTotal: pagoAsociado.valorTotal,
        gastoLegal: pagoAsociado.gastoLegal,
        honorarios: pagoAsociado.honorarios,
        numeroTransaccion: pagoAsociado.numeroTransaccion,
      });
    }
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-60 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl max-w-2xl w-full p-8 relative border border-blue-200">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-700 hover:text-red-600 text-2xl focus:outline-none bg-white border border-gray-300 rounded-full shadow" aria-label="Cerrar"><i className="bi bi-x-lg"></i></button>
        <h2 className="text-2xl font-bold mb-4 text-blue-800">Detalle del Proceso</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          <div><span className="font-semibold">Marca:</span> {proceso.nombreMarca || '-'}</div>
          <div><span className="font-semibold">Expediente:</span> {proceso.expediente || '-'}</div>
          <div><span className="font-semibold">Tipo de Solicitud:</span> {proceso.tipoSolicitud || '-'}</div>
          <div><span className="font-semibold">Estado:</span> {proceso.estado || '-'}</div>
          <div><span className="font-semibold">Motivo:</span> {proceso.motivoAnulacion || '-'}</div>
          <div><span className="font-semibold">Fecha creación:</span> {obtenerFechaCreacion(proceso)}</div>
          <div><span className="font-semibold">Fecha fin:</span> {obtenerFechaFin(proceso)}</div>
          <div><span className="font-semibold">Duración:</span> {calcularDuracion(proceso)}</div>
          <div className="flex items-center gap-2"><span className="font-semibold">País:</span> {proceso.pais || '-'} {paisObj && <img src={paisObj.bandera} alt={paisObj.nombre} title={paisObj.nombre} className="w-7 h-5 rounded shadow border border-gray-300" />}</div>
          <div><span className="font-semibold">Representante:</span> {proceso.nombreCompleto || proceso.titular || '-'}</div>
        </div>
        <div className="mb-2"><span className="font-semibold">Comentarios:</span></div>
        <div className="bg-gray-50 rounded p-3 mb-4 min-h-[40px] text-sm">
          {Array.isArray(proceso.comentarios) && proceso.comentarios.length > 0 ? (
            proceso.comentarios.map((c, i) => (
              <div key={i} className="mb-1"><span className="font-semibold">{c.autor || 'Sistema'}:</span> {c.texto} <span className="text-xs text-gray-500">({c.fecha})</span></div>
            ))
          ) : (
            <span className="text-gray-400 italic">Sin comentarios</span>
          )}
        </div>
        <div className="mb-2"><span className="font-semibold">Archivos:</span></div>
        <div className="bg-gray-50 rounded p-3 min-h-[40px] text-sm">
          {proceso.certificadoCamara && <div>Certificado Cámara: <span className="text-blue-700">{typeof proceso.certificadoCamara === 'string' ? proceso.certificadoCamara : proceso.certificadoCamara?.name}</span></div>}
          {proceso.logotipoMarca && <div>Logotipo Marca: <span className="text-blue-700">{typeof proceso.logotipoMarca === 'string' ? proceso.logotipoMarca : proceso.logotipoMarca?.name}</span></div>}
          {proceso.poderRepresentante && <div>Poder Representante: <span className="text-blue-700">{typeof proceso.poderRepresentante === 'string' ? proceso.poderRepresentante : proceso.poderRepresentante?.name}</span></div>}
          {proceso.poderAutorizacion && <div>Poder Autorización: <span className="text-blue-700">{typeof proceso.poderAutorizacion === 'string' ? proceso.poderAutorizacion : proceso.poderAutorizacion?.name}</span></div>}
          {!proceso.certificadoCamara && !proceso.logotipoMarca && !proceso.poderRepresentante && !proceso.poderAutorizacion && <span className="text-gray-400 italic">Sin archivos</span>}
          {pagoAsociado && (
            <div className="mt-3">
              <button
                className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 font-semibold shadow"
                onClick={handleDescargarComprobante}
              >
                Descargar comprobante de pago
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const HistorialProcesos = ({ procesos, servicios, servicioFiltro, estadoFiltro, busquedaHistorial, onChangeServicio, onChangeEstado, onChangeBusqueda }) => {
  const [detalle, setDetalle] = useState(null);
  
  // Función para obtener el nombre del estado actual
  const obtenerNombreEstado = (servicio, estadoActual) => {
    if (!servicio || !servicio.process_states) return estadoActual || '-';
    
    // Mapeo de estados comunes
    const estadoMapping = {
      'En revisión': 'en_proceso',
      'Pendiente': 'recibida', 
      'En proceso': 'en_proceso',
      'Finalizado': 'finalizado',
      'Aprobado': 'aprobado',
      'Rechazado': 'rechazado',
      'Anulado': 'anulado'
    };

    // Buscar por nombre exacto
    let estadoEncontrado = servicio.process_states.find(e => e.name === estadoActual);
    
    // Si no se encuentra, buscar por status_key
    if (!estadoEncontrado) {
      estadoEncontrado = servicio.process_states.find(e => e.status_key === estadoActual);
    }
    
    // Si no se encuentra, buscar por mapeo
    if (!estadoEncontrado) {
      const statusKeyMapeado = estadoMapping[estadoActual];
      if (statusKeyMapeado) {
        estadoEncontrado = servicio.process_states.find(e => e.status_key === statusKeyMapeado);
      }
    }

    return estadoEncontrado ? estadoEncontrado.name : estadoActual || '-';
  };

  // Obtener servicios y estados únicos del historial
  const serviciosHistorial = ['Todos', ...Array.from(new Set(procesos.map(p => p.tipoSolicitud)))];
  const estadosHistorial = ['Todos', ...Array.from(new Set(procesos.map(p => p.estado)))];

  // Filtro
  const procesosFiltrados = procesos.filter(proc =>
    (servicioFiltro === 'Todos' || proc.tipoSolicitud === servicioFiltro) &&
    (estadoFiltro === 'Todos' || proc.estado === estadoFiltro) &&
    (
      proc.nombreMarca?.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
      proc.expediente?.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
      proc.tipoSolicitud?.toLowerCase().includes(busquedaHistorial.toLowerCase())
    )
  );

  return (
    <>
      <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3 w-full">
        {/* Buscador */}
        <div className="relative w-full md:w-80 flex-shrink-0">
          <span className="absolute left-3 top-2.5 text-gray-400"><i className="bi bi-search"></i></span>
          <input
            type="text"
            placeholder="Buscar"
            className="pl-9 pr-3 py-3 w-full text-base border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 bg-white shadow-md"
            value={busquedaHistorial}
            onChange={e => onChangeBusqueda(e.target.value)}
          />
        </div>
        {/* Select Servicio */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <label className="text-sm text-gray-500" htmlFor="select-servicio-historial">Servicio:</label>
          <select
            id="select-servicio-historial"
            value={servicioFiltro}
            onChange={e => onChangeServicio(e.target.value)}
            className="px-4 py-2 rounded-lg border border-blue-300 text-base font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition"
          >
            {serviciosHistorial.map(servicio => (
              <option key={servicio} value={servicio}>{servicio}</option>
            ))}
          </select>
        </div>
        {/* Select Estado */}
        <div className="flex items-center gap-2 min-w-[180px]">
          <label className="text-sm text-gray-500" htmlFor="select-estado-historial">Estado:</label>
          <select
            id="select-estado-historial"
            value={estadoFiltro}
            onChange={e => onChangeEstado(e.target.value)}
            className="px-4 py-2 rounded-lg border border-green-300 text-base font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
          >
            {estadosHistorial.map(estado => (
              <option key={estado} value={estado}>{estado}</option>
            ))}
          </select>
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="bg-gray-50 rounded-2xl border">
          <table className="w-full text-sm rounded-2xl">
            <thead>
              <tr className="text-left text-gray-600 font-semibold border-b sticky top-0 bg-gray-50 z-10 shadow-sm">
                <th className="px-6 py-4">Marca</th>
                <th className="px-6 py-4">Expediente</th>
                <th className="px-6 py-4">Tipo de Solicitud</th>
                <th className="px-6 py-4">Estado</th>
                <th className="px-6 py-4">Motivo</th>
                <th className="px-6 py-4">Fecha creación</th>
                <th className="px-6 py-4">Fecha fin</th>
                <th className="px-6 py-4">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {procesosFiltrados.map((proc) => {
                const servicio = servicios.find(s => s && s.nombre === proc.tipoSolicitud);
                const nombreEstadoActual = obtenerNombreEstado(servicio, proc.estado);
                
                return (
                  <tr key={proc.id || proc.expediente || Math.random()} className="border-b last:border-0 hover:bg-blue-50 transition-all duration-200 group">
                    <td className="px-6 py-4 font-semibold text-blue-700 underline cursor-pointer group-hover:text-blue-900 transition-all duration-200 align-middle">{proc.nombreMarca || 'Sin marca'}</td>
                    <td className="px-6 py-4 align-middle">{proc.expediente || '-'}</td>
                    <td className="px-6 py-4 align-middle font-medium">{proc.tipoSolicitud || '-'}</td>
                    <td className="px-6 py-4 align-middle">
                      {proc.estado === 'Anulado' ? (
                        <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">Anulado</span>
                      ) : proc.estado === 'Aprobado' ? (
                        <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Aprobado</span>
                      ) : proc.estado === 'Finalizado' ? (
                        <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-semibold">Finalizado</span>
                      ) : (
                        <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">Rechazado</span>
                      )}
                    </td>
                    <td className="px-6 py-4 align-middle">
                      {proc.estado === 'Anulado' && proc.motivoAnulacion ? (
                        <span className="italic text-red-600">{proc.motivoAnulacion}</span>
                      ) : ''}
                    </td>
                    <td className="px-6 py-4 align-middle text-xs">{obtenerFechaCreacion(proc)}</td>
                    <td className="px-6 py-4 align-middle text-xs">{obtenerFechaFin(proc)}</td>
                    <td className="px-6 py-4 align-middle">
                      <button
                        className="px-3 py-1 rounded bg-blue-600 text-white text-xs font-semibold hover:bg-blue-800 transition-all shadow"
                        onClick={() => setDetalle(proc)}
                      >
                        Ver detalle
                      </button>
                    </td>
                  </tr>
                );
              })}
              {procesosFiltrados.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center py-8 text-gray-400 text-lg">No se encontraron resultados.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        {/* Footer de resultados */}
        <div className="py-4 text-center text-gray-500 text-sm">
          Mostrando {procesosFiltrados.length} de {procesos.length} resultados
        </div>
      </div>
      <DetalleProcesoModal proceso={detalle} onClose={() => setDetalle(null)} />
    </>
  );
};

export default HistorialProcesos; 