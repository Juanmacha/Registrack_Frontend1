import React from 'react';
import Timeline from './Timeline.jsx';
import { obtenerFechaCreacion } from '../services/procesosService.js';
import { PAISES } from '../../../../../shared/utils/paises.js';

const ProcesosActivos = ({ procesos, servicios }) => {
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

  return (
    <div className="space-y-10">
      {procesos.map((proc) => {
        const servicio = servicios.find(s => s && s.nombre === proc.tipoSolicitud);
        const estados = servicio?.process_states || [];
        const nombreEstadoActual = obtenerNombreEstado(servicio, proc.estado);
        
        // Buscar país y bandera
        const paisObj = PAISES.find(p => p.nombre === proc.pais);
        return (
          <div key={proc.id || proc.expediente || Math.random()} className="rounded-2xl shadow-lg border border-gray-200 bg-gray-50">
            {/* Encabezado azul claro */}
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-4 rounded-t-2xl" style={{background: '#f4f8ff'}}>
              <div className="flex flex-col gap-1 flex-1 min-w-0">
                <div className="flex items-center gap-2 text-xl font-bold text-blue-800">
                  {proc.nombreMarca || 'Sin marca'}
                  {paisObj && (
                    <img src={paisObj.bandera} alt={paisObj.nombre} title={paisObj.nombre} className="w-7 h-5 rounded shadow border border-gray-300" />
                  )}
                </div>
                <div className="text-sm text-gray-600 font-medium">Expediente: <span className="font-normal">{proc.expediente || '-'}</span></div>
                <div className="text-sm text-gray-600 font-medium">Servicio: <span className="font-normal">{proc.tipoSolicitud || '-'}</span></div>
                <div className="text-sm text-gray-600 font-medium">Representante: <span className="font-normal">{proc.nombreCompleto || proc.titular || '-'}</span></div>
                <div className="text-sm text-gray-600 font-medium">Fecha de creación: <span className="font-normal">{obtenerFechaCreacion(proc)}</span></div>
              </div>
              {/* Estado actual centrado entre los dos bloques */}
              <div className="flex-1 flex justify-center items-center min-w-0">
                <div className="px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold shadow inline-block whitespace-nowrap">
                  Estado actual: {nombreEstadoActual}
                </div>
              </div>
              <div className="text-right flex-1 min-w-0">
                <div className="text-xs text-gray-500 font-semibold">Última actualización</div>
                <div className="text-2xl font-bold text-blue-900">{proc.fechaSolicitud || '-'}</div>
              </div>
            </div>
            {/* Línea de tiempo y estado */}
            <div className="px-8 pt-2 pb-2">
              <Timeline
                estados={estados}
                estadoActual={proc.estado || ''}
                esHistorial={false}
              />
            </div>
            {/* Detalles del proceso actual */}
            <div className="bg-white rounded-b-2xl px-8 py-6 border-t border-gray-100">
              <div className="font-semibold text-gray-700 mb-2">Detalles del proceso actual</div>
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 text-sm">
                <div className="grid grid-cols-1 gap-2">
                  <div>Etapa actual: <span className="font-bold text-blue-700">{nombreEstadoActual}</span></div>
                  <div>Próxima acción: <span className="font-bold text-gray-800">Revisión de documentos</span></div>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  <div>Tiempo estimado: <span className="font-bold">15-30 días</span></div>
                  <div>Responsable: <span className="font-bold text-gray-800">Oficina de Marcas</span></div>
                </div>
                {/* Botón de historial de pagos alineado a la derecha */}
                <div className="flex justify-end md:justify-center items-center mt-4 md:mt-0">
                  <button
                    className="px-4 py-2 rounded-lg bg-white border border-green-600 text-green-700 font-semibold shadow-sm hover:bg-green-50 hover:border-green-700 transition-all text-sm flex items-center gap-2"
                    onClick={() => alert('Aquí irá la navegación al historial de pagos')}
                  >
                    <i className="bi bi-cash-coin"></i>
                    Ver historial de pagos
                  </button>
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default ProcesosActivos; 