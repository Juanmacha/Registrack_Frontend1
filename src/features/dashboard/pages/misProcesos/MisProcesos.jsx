import React, { useEffect, useState } from 'react';
import { getFromStorage } from '../gestionVentasServicios/services/ventasService.js';
import { getServicios, clearServicesCache } from '../gestionVentasServicios/services/serviciosManagementService.js';
import NavBarLanding from '../../../landing/components/landingNavbar.jsx';
import authData from '../../../auth/services/authData.js';

// Simulación de usuario autenticado (ajusta según tu lógica real)
const getUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};

// Utilidad para obtener solicitudes del usuario
function getSolicitudesUsuario(email) {
  try {
    // Consultar ambos arrays: en proceso y finalizados
    const solicitudesActivas = getFromStorage('ventasServicios');
    const solicitudesFinalizadas = getFromStorage('ventasServiciosFin');
    const todas = [
      ...(Array.isArray(solicitudesActivas) ? solicitudesActivas : []),
      ...(Array.isArray(solicitudesFinalizadas) ? solicitudesFinalizadas : [])
    ];
    return todas.filter(s => s && typeof s === 'object' && s.email === email);
  } catch {
    return [];
  }
}

// Línea de tiempo visual
function Timeline({ estados, estadoActual, esHistorial, estadoFinal, motivoAnulacion }) {
  const actualIdx = estados.findIndex(e => e.name === estadoActual || e.status_key === estadoActual);
  return (
    <div className="flex flex-col items-center gap-2">
      <div className="flex items-center gap-2 overflow-x-auto py-2">
        {estados.length === 0 ? (
          <span className="text-gray-400 text-sm">No hay etapas definidas para este servicio.</span>
        ) : (
          estados.map((e, idx) => (
            <div key={e.id} className="flex flex-col items-center min-w-[100px]">
              <div className={`rounded-full w-10 h-10 flex items-center justify-center font-bold text-base border-4 shadow-md
                ${idx < actualIdx ? (esHistorial ? 'bg-blue-300 text-white border-blue-300' : 'bg-blue-500 text-white border-blue-500 scale-100 animate-pulse')
                : idx === actualIdx ? (esHistorial ? 'bg-blue-500 text-white border-blue-500' : 'bg-blue-700 text-white border-blue-700 scale-110 animate-bounce')
                : 'bg-gray-200 text-gray-400 border-gray-300 scale-100'}
                ${esHistorial ? '' : 'transition-all duration-300'}
              `}>
                {idx + 1}
              </div>
              <span className={`text-xs mt-2 text-center font-semibold ${idx <= actualIdx ? 'text-blue-700' : 'text-gray-400'}`}>{e.name}</span>
              {idx < estados.length - 1 && <div className={`h-2 w-12 rounded-full mt-1 mb-1 ${idx < actualIdx ? (esHistorial ? 'bg-blue-300' : 'bg-blue-500') : 'bg-gray-300'} ${esHistorial ? '' : 'transition-all duration-300'}`}></div>}
            </div>
          ))
        )}
      </div>
      {/* Etiqueta de estado final o actual */}
      {esHistorial ? (
        <div className="mt-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold shadow inline-block">
          Solicitud terminada: {estadoFinal}
          {estadoFinal === 'Anulado' && motivoAnulacion && (
            <span className="ml-2 text-red-700">- Motivo: <span className="italic">{motivoAnulacion}</span></span>
          )}
        </div>
      ) : (
        estados.length > 0 && actualIdx >= 0 && (
          <div className="mt-2 px-4 py-2 rounded-full bg-blue-100 text-blue-700 text-sm font-semibold shadow inline-block">
            Estado actual: {estados[actualIdx]?.name || estadoActual}
          </div>
        )
      )}
      {!esHistorial && estados.length > 0 && actualIdx === -1 && (
        <div className="mt-2 px-4 py-2 rounded-full bg-yellow-100 text-yellow-700 text-sm font-semibold shadow inline-block">
          Estado actual: {estadoActual || 'Desconocido'}
        </div>
      )}
    </div>
  );
}

const MisProcesos = () => {
  const [procesos, setProcesos] = useState([]);
  const [servicios, setServicios] = useState([]);
  const [error, setError] = useState(null);
  const [vistaHistorial, setVistaHistorial] = useState(false);
  const [busquedaHistorial, setBusquedaHistorial] = useState("");
  const [servicioFiltro, setServicioFiltro] = useState('Todos');
  const [estadoFiltro, setEstadoFiltro] = useState('Todos');
  const user = authData.getUser();

  useEffect(() => {
    try {
      if (user && user.email) {
        setProcesos(getSolicitudesUsuario(user.email));
      } else {
        setProcesos([]);
      }
      // Limpiar caché para asegurar rutas actualizadas
    clearServicesCache();
    const servs = getServicios();
      setServicios(Array.isArray(servs) ? servs : []);
    } catch (err) {
      setError('Ocurrió un error al cargar tus procesos.');
    }
  }, [user]);

  if (!user) {
    return (
      <>
        <NavBarLanding />
        <div className="pt-32 p-8 text-center text-red-600 font-bold">Debes iniciar sesión para ver tus procesos.</div>
      </>
    );
  }
  if (error) {
    return <div className="p-8 text-center text-red-600 font-bold">{error}</div>;
  }
  if (!Array.isArray(procesos)) {
    return <div className="p-8 text-center text-red-600 font-bold">Error al cargar tus procesos. Intenta recargar la página.</div>;
  }

  // Obtener servicios y estados únicos de los procesos terminados
  const serviciosHistorial = ['Todos', ...Array.from(new Set(procesos.filter(p => ["Aprobado", "Rechazado", "Anulado"].includes(p.estado)).map(p => p.tipoSolicitud)))];
  const estadosHistorial = ['Todos', ...Array.from(new Set(procesos.filter(p => ["Aprobado", "Rechazado", "Anulado"].includes(p.estado)).map(p => p.estado)))];

  return (
    <>
      <NavBarLanding />
      <div className="w-full py-8 px-4 pt-32">
        <h1 className="text-2xl font-bold mb-6 text-blue-800">Mis Procesos</h1>
        <div className="flex justify-center gap-4 mb-8">
          <button
            className={`px-4 py-2 rounded font-semibold transition-all ${!vistaHistorial ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setVistaHistorial(false)}
          >
            Procesos Activos
          </button>
          <button
            className={`px-4 py-2 rounded font-semibold transition-all ${vistaHistorial ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
            onClick={() => setVistaHistorial(true)}
          >
            Historial
          </button>
        </div>
        {procesos.filter(Boolean).filter(proc => vistaHistorial
          ? ["Aprobado", "Rechazado", "Anulado"].includes(proc.estado)
          : !["Aprobado", "Rechazado", "Anulado"].includes(proc.estado)
        ).length === 0 && (
          <div className="text-gray-400 text-center py-8">
            {vistaHistorial ? 'No hay procesos en el historial.' : 'No tienes procesos registrados.'}
          </div>
        )}
        {!vistaHistorial && (
          <div className="space-y-10">
            {procesos.filter(Boolean)
              .filter(proc => !["Aprobado", "Rechazado", "Anulado"].includes(proc.estado))
              .map((proc) => {
                const servicio = servicios.find(s => s && s.nombre === proc.tipoSolicitud);
                const estados = servicio?.process_states || [];
                return (
                  <div key={proc.id || proc.expediente || Math.random()} className="rounded-2xl shadow-lg border border-gray-200 bg-gray-50">
                    {/* Encabezado azul claro */}
                    <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 px-8 py-4 rounded-t-2xl" style={{background: '#f4f8ff'}}>
                      <div className="flex flex-col gap-1">
                        <div className="text-xl font-bold text-blue-800">{proc.nombreMarca || 'Sin marca'}</div>
                        <div className="text-sm text-gray-600 font-medium">Expediente: <span className="font-normal">{proc.expediente || '-'}</span></div>
                        <div className="text-sm text-gray-600 font-medium">Servicio: <span className="font-normal">{proc.tipoSolicitud || '-'}</span></div>
                        <div className="text-sm text-gray-600 font-medium">Representante: <span className="font-normal">{proc.nombreCompleto || proc.titular || '-'}</span></div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500 font-semibold">Última actualización</div>
                        <div className="text-2xl font-bold text-blue-900">{proc.fechaSolicitud || '-'}</div>
                      </div>
                    </div>
                    {/* Línea de tiempo y estado */}
                    <div className="px-8 py-6">
                      <Timeline
                        estados={estados}
                        estadoActual={proc.estado || ''}
                        esHistorial={false}
                      />
                    </div>
                    {/* Detalles del proceso actual (simulado) */}
                    <div className="bg-white rounded-b-2xl px-8 py-6 border-t border-gray-100">
                      <div className="font-semibold text-gray-700 mb-2">Detalles del proceso actual</div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>Etapa actual: <span className="font-bold text-blue-700">{proc.estado || '-'}</span></div>
                        <div>Tiempo estimado: <span className="font-bold">15-30 días</span></div>
                        <div>Próxima acción: <span className="font-bold text-gray-800">Revisión de documentos</span></div>
                        <div>Responsable: <span className="font-bold text-gray-800">Oficina de Marcas</span></div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        )}
        {vistaHistorial && (
          <>
            <div className="mb-6 flex flex-col md:flex-row md:items-center gap-3 w-full">
              {/* Buscador */}
              <div className="relative w-full md:w-80 flex-shrink-0">
                <span className="absolute left-3 top-2.5 text-gray-400"><i className="bi bi-search"></i></span>
                <input
                  type="text"
                  placeholder="Buscar en historial (marca, expediente, tipo...)"
                  className="pl-9 pr-3 py-3 w-full text-base border border-blue-200 rounded-xl focus:ring-2 focus:ring-blue-400 focus:border-blue-400 transition placeholder-gray-400 bg-white shadow-md"
                  value={busquedaHistorial}
                  onChange={e => setBusquedaHistorial(e.target.value)}
                />
              </div>
              {/* Select Servicio */}
              <div className="flex items-center gap-2 min-w-[180px]">
                <label className="text-sm text-gray-500" htmlFor="select-servicio-historial">Servicio:</label>
                <select
                  id="select-servicio-historial"
                  value={servicioFiltro}
                  onChange={e => setServicioFiltro(e.target.value)}
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
                  onChange={e => setEstadoFiltro(e.target.value)}
                  className="px-4 py-2 rounded-lg border border-green-300 text-base font-medium bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-green-400 focus:border-green-400 transition"
                >
                  {estadosHistorial.map(estado => (
                    <option key={estado} value={estado}>{estado}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full bg-gray-50 rounded-2xl shadow-lg border border-gray-200 text-sm">
                <thead>
                  <tr className="text-left text-gray-600 font-semibold border-b sticky top-0 bg-gray-50 z-10 shadow-sm">
                    <th className="px-6 py-4">Marca</th>
                    <th className="px-6 py-4">Expediente</th>
                    <th className="px-6 py-4">Tipo de Solicitud</th>
                    <th className="px-6 py-4">Estado</th>
                    <th className="px-6 py-4">Motivo</th>
                    <th className="px-6 py-4">Fecha</th>
                  </tr>
                </thead>
                <tbody>
                  {procesos.filter(Boolean)
                    .filter(proc => ["Aprobado", "Rechazado", "Anulado"].includes(proc.estado))
                    .filter(proc =>
                      (servicioFiltro === 'Todos' || proc.tipoSolicitud === servicioFiltro) &&
                      (estadoFiltro === 'Todos' || proc.estado === estadoFiltro) &&
                      (
                        proc.nombreMarca?.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
                        proc.expediente?.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
                        proc.tipoSolicitud?.toLowerCase().includes(busquedaHistorial.toLowerCase())
                      )
                    )
                    .map((proc) => (
                      <tr key={proc.id || proc.expediente || Math.random()} className="border-b last:border-0 hover:bg-blue-50 transition-all duration-200 group">
                        <td className="px-6 py-4 font-semibold text-blue-700 underline cursor-pointer group-hover:text-blue-900 transition-all duration-200 align-middle">{proc.nombreMarca || 'Sin marca'}</td>
                        <td className="px-6 py-4 align-middle">{proc.expediente || '-'}</td>
                        <td className="px-6 py-4 align-middle font-medium">{proc.tipoSolicitud || '-'}</td>
                        <td className="px-6 py-4 align-middle">
                          {proc.estado === 'Anulado' ? (
                            <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full font-semibold">Anulado</span>
                          ) : proc.estado === 'Aprobado' ? (
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full font-semibold">Aprobado</span>
                          ) : (
                            <span className="bg-yellow-100 text-yellow-800 px-3 py-1 rounded-full font-semibold">Rechazado</span>
                          )}
                        </td>
                        <td className="px-6 py-4 align-middle">
                          {proc.estado === 'Anulado' && proc.motivoAnulacion ? (
                            <span className="italic text-red-600">{proc.motivoAnulacion}</span>
                          ) : ''}
                        </td>
                        <td className="px-6 py-4 align-middle text-xs">{proc.fechaSolicitud || '-'}</td>
                      </tr>
                    ))}
                  {procesos.filter(Boolean)
                    .filter(proc => ["Aprobado", "Rechazado", "Anulado"].includes(proc.estado))
                    .filter(proc =>
                      (servicioFiltro === 'Todos' || proc.tipoSolicitud === servicioFiltro) &&
                      (estadoFiltro === 'Todos' || proc.estado === estadoFiltro) &&
                      (
                        proc.nombreMarca?.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
                        proc.expediente?.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
                        proc.tipoSolicitud?.toLowerCase().includes(busquedaHistorial.toLowerCase())
                      )
                    ).length === 0 && (
                    <tr>
                      <td colSpan={6} className="text-center py-8 text-gray-400 text-lg">No se encontraron resultados.</td>
                    </tr>
                  )}
                </tbody>
              </table>
              {/* Footer de resultados */}
              <div className="py-4 text-center text-gray-500 text-sm">
                Mostrando {procesos.filter(Boolean)
                  .filter(proc => ["Aprobado", "Rechazado", "Anulado"].includes(proc.estado))
                  .filter(proc =>
                    (servicioFiltro === 'Todos' || proc.tipoSolicitud === servicioFiltro) &&
                    (estadoFiltro === 'Todos' || proc.estado === estadoFiltro) &&
                    (
                      proc.nombreMarca?.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
                      proc.expediente?.toLowerCase().includes(busquedaHistorial.toLowerCase()) ||
                      proc.tipoSolicitud?.toLowerCase().includes(busquedaHistorial.toLowerCase())
                    )
                  ).length} de {procesos.filter(Boolean).filter(proc => ["Aprobado", "Rechazado", "Anulado"].includes(proc.estado)).length} resultados
              </div>
            </div>
          </>
        )}
      </div>
    </>
  );
};

export default MisProcesos; 