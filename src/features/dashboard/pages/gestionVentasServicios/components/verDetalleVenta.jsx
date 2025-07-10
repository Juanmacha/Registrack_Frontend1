import React from "react";
import { getComentarios } from '../services/ventasService';

const labelClass = "text-xs text-gray-500 font-semibold mb-1";
const valueClass = "text-xs text-gray-800 mb-2 break-all";

const renderFileDisplayName = (file) => {
  if (!file) return <span className="italic text-gray-400">No disponible</span>;
  if (typeof file === 'string') return file;
  if (file.name) return file.name;
  return <span className="italic text-gray-400">No disponible</span>;
};

const VerDetalleVenta = ({ datos, isOpen, onClose }) => {
  if (!isOpen || !datos) return null;

  const getEstadoBadge = (estado) => {
    const estadoLower = estado?.toLowerCase() || '';
    if (estadoLower === "finalizado") {
      return (
        <span className="px-3 py-1 text-blue-700 bg-blue-100 rounded-full text-xs font-semibold">
          Finalizado
        </span>
      );
    }
    if (estadoLower === "anulado") {
      return (
        <span className="px-3 py-1 text-red-700 bg-red-100 rounded-full text-xs font-semibold">
          Anulado
        </span>
      );
    }
    if (estadoLower.includes("revisión") || estadoLower.includes("activo")) {
      return (
        <span className="px-3 py-1 text-green-700 bg-green-100 rounded-full text-xs font-semibold">
          {estado}
        </span>
      );
    }
    if (estadoLower.includes("pendiente")) {
      return (
        <span className="px-3 py-1 text-yellow-800 bg-yellow-100 rounded-full text-xs font-semibold">
          {estado}
        </span>
      );
    }
    return (
      <span className="px-3 py-1 text-gray-700 bg-gray-100 rounded-full text-xs font-semibold">
        {estado}
      </span>
    );
  };

  // Obtener comentarios de la venta
  const comentarios = getComentarios(datos.id);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-800 bg-opacity-75 backdrop-blur-sm transition-all">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-6xl p-0 overflow-y-auto max-h-[90vh] relative border border-gray-200">
        {/* Header sticky */}
        <div className="sticky top-0 z-10 bg-gray-50 px-6 py-3 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-eye text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Detalle del Servicio</h2>
              <p className="text-sm text-gray-500">Expediente: {datos.expediente || <span className="italic text-gray-400">No especificado</span>}</p>
            </div>
          </div>
          <button 
            onClick={onClose}
            className="text-gray-900 hover:text-red-700 bg-gray-50 text-2xl px-2 py-1 rounded-full focus:outline-none sticky top-0"
            style={{ position: 'sticky', top: 0 }}
          >
            <i className="bi bi-x-lg"></i>
          </button>
        </div>

        {/* Content: grid 4 columnas en desktop, 1 en móvil */}
        <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
          {/* Columna 1: Cliente y Representante */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Titular / Representante</h3>
            <div className="bg-gray-50 rounded-lg p-3 max-h-56 overflow-y-auto">
              <div className="flex items-center space-x-3 mb-2">
                <img
                  src={`https://api.dicebear.com/7.x/initials/svg?seed=${datos.titular || datos.nombreCompleto || ''}`}
                  alt={datos.titular || datos.nombreCompleto || ''}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <div className="font-medium text-gray-800">{datos.titular || datos.nombreCompleto || <span className="italic text-gray-400">No especificado</span>}</div>
                  <div className="text-xs text-gray-500">{datos.tipoPersona || datos.tipoSolicitante || <span className="italic text-gray-400">No especificado</span>}</div>
                </div>
              </div>
              <div className={labelClass}>Tipo de Solicitante:</div>
              <div className={valueClass}>{datos.tipoSolicitante || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Tipo de Persona:</div>
              <div className={valueClass}>{datos.tipoPersona || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Tipo de Documento:</div>
              <div className={valueClass}>{datos.tipoDocumento || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>N° Documento:</div>
              <div className={valueClass}>{datos.numeroDocumento || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Email:</div>
              <div className={valueClass}>{datos.email || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Teléfono:</div>
              <div className={valueClass}>{datos.telefono || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Dirección:</div>
              <div className={valueClass}>{datos.direccion || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Tipo de Entidad:</div>
              <div className={valueClass}>{datos.tipoEntidad || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Razón Social:</div>
              <div className={valueClass}>{datos.razonSocial || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Nombre Empresa:</div>
              <div className={valueClass}>{datos.nombreEmpresa || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>NIT:</div>
              <div className={valueClass}>{datos.nit || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Poder Representante:</div>
              <div className={valueClass}>{renderFileDisplayName(datos.poderRepresentante)}</div>
              <div className={labelClass}>Poder Autorización:</div>
              <div className={valueClass}>{renderFileDisplayName(datos.poderAutorizacion)}</div>
            </div>
          </div>

          {/* Columna 2: Detalles de la Solicitud y Marca */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Detalles y Marca</h3>
            <div className="bg-gray-50 rounded-lg p-3 max-h-56 overflow-y-auto">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs text-gray-600">Estado:</span>
                {getEstadoBadge(datos.estado)}
              </div>
              <div className={labelClass}>Tipo de Solicitud:</div>
              <div className={valueClass}>{datos.tipoSolicitud || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Encargado:</div>
              <div className={valueClass}>{datos.encargado || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Fecha Solicitud:</div>
              <div className={valueClass}>{datos.fechaSolicitud || <span className="italic text-gray-400">No especificado</span>}</div>
              <div className={labelClass}>Próxima Cita:</div>
              <div className={valueClass}>{datos.proximaCita || <span className="italic text-gray-400">Sin citas</span>}</div>
              {datos.motivoAnulacion && (
                <div className="flex items-center space-x-2 text-xs bg-red-50 p-2 rounded mt-2">
                  <i className="bi bi-exclamation-triangle text-red-400"></i>
                  <span className="text-gray-600">Motivo de Anulación:</span>
                  <span className="font-medium text-red-700">{datos.motivoAnulacion}</span>
                </div>
              )}
              <div className="mt-2 border-t pt-2">
                <div className={labelClass}>País:</div>
                <div className={valueClass}>{datos.pais || <span className="italic text-gray-400">No especificado</span>}</div>
                <div className={labelClass}>NIT Marca:</div>
                <div className={valueClass}>{datos.nitMarca || <span className="italic text-gray-400">No especificado</span>}</div>
                <div className={labelClass}>Nombre Marca:</div>
                <div className={valueClass}>{datos.nombreMarca || <span className="italic text-gray-400">No especificado</span>}</div>
                <div className="flex items-center justify-between">
                  <span className={labelClass}>Categoría:</span>
                  <div className="flex items-center gap-1">
                    <i className={`bi ${
                      datos.categoria === 'Productos' 
                        ? 'bi-box text-blue-600' 
                        : 'bi-gear text-green-600'
                    } text-xs`}></i>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      datos.categoria === 'Productos' 
                        ? 'bg-blue-100 text-blue-800' 
                        : 'bg-green-100 text-green-800'
                    }`}>
                      {datos.categoria || 'No especificada'}
                    </span>
                  </div>
                </div>
              </div>
            </div>
            {/* Archivos Adjuntos */}
            <div className="bg-gray-50 rounded-lg p-3 max-h-56 overflow-y-auto">
              <h4 className="text-xs font-semibold text-gray-600 mb-1">Archivos Adjuntos</h4>
              <div className={labelClass}>Certificado Cámara:</div>
              <div className={valueClass}>{renderFileDisplayName(datos.certificadoCamara)}</div>
              <div className={labelClass}>Logotipo Marca:</div>
              <div className={valueClass}>{renderFileDisplayName(datos.logotipoMarca)}</div>
            </div>
          </div>

          {/* Columna 3: Clases de la Marca */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Clases de la Marca</h3>
            <div className="bg-gray-50 rounded-lg p-3 max-h-56 overflow-y-auto">
              {Array.isArray(datos.clases) && datos.clases.length > 0 ? (
                <ul className="space-y-1 max-h-32 overflow-y-auto pr-1">
                  {datos.clases.map((c, idx) => (
                    <li key={idx} className="text-xs text-gray-700 flex flex-col md:flex-row md:items-center md:gap-2">
                      <span>N° Clase: <span className="font-medium">{c.numero || <span className="italic text-gray-400">No especificado</span>}</span></span>
                      <span>Descripción: <span className="font-medium">{c.descripcion || <span className="italic text-gray-400">No especificado</span>}</span></span>
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-xs italic">Sin clases</div>
              )}
            </div>
          </div>

          {/* Columna 4: Comentarios */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-blue-700 uppercase tracking-wider mb-2">Comentarios</h3>
            <div className="bg-gray-50 rounded-lg p-3 max-h-56 overflow-y-auto">
              {comentarios && comentarios.length > 0 ? (
                <ul className="space-y-2 max-h-32 overflow-y-auto pr-1">
                  {comentarios.map((c, idx) => (
                    <li key={idx} className={`text-xs text-gray-700 ${c.especial ? 'bg-blue-50 border-l-4 border-blue-400 p-2 rounded' : ''}`}>
                      {c.especial ? (
                        <>
                          <span className="font-semibold text-blue-800 flex items-center gap-1">
                            <i className="bi bi-arrow-repeat"></i> Justificación de cambio de estado
                          </span>
                          <span className="block text-blue-900 font-medium mt-1">{c.texto}</span>
                          <span className="block text-xs text-blue-500 mt-1">{c.fecha}</span>
                        </>
                      ) : (
                        <>
                          <span className="font-semibold text-blue-700">{c.autor || 'Sistema'}:</span> {c.texto}
                          <span className="block text-xs text-gray-400">{c.fecha}</span>
                        </>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <div className="text-gray-400 text-xs italic">Sin comentarios</div>
              )}
            </div>
          </div>
        </div>

        {/* Footer compacto */}
        <div className="bg-gray-50 px-6 py-2 border-t border-gray-200 flex justify-end sticky bottom-0 z-10">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerDetalleVenta;
