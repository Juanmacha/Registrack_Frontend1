// Servicio para obtener y filtrar procesos de usuario
import { getFromStorage } from "../../gestionVentasServicios/services/ventasService.js";
import { getServicios } from "../../gestionVentasServicios/services/serviciosManagementService.js";

export function getSolicitudesUsuario(email) {
  try {
    // Consultar ambos arrays: en proceso y finalizados
    const solicitudesActivas = getFromStorage("ventasServicios");
    const solicitudesFinalizadas = getFromStorage("ventasServiciosFin");
    const todas = [
      ...(Array.isArray(solicitudesActivas) ? solicitudesActivas : []),
      ...(Array.isArray(solicitudesFinalizadas) ? solicitudesFinalizadas : []),
    ];
    return todas.filter((s) => s && typeof s === "object" && s.email === email);
  } catch {
    return [];
  }
}

export function filtrarProcesos(procesos, finalizados = false) {
  if (!Array.isArray(procesos)) return [];
  if (finalizados) {
    return procesos.filter((p) =>
      ["Aprobado", "Rechazado", "Anulado"].includes(p.estado)
    );
  } else {
    return procesos.filter(
      (p) => !["Aprobado", "Rechazado", "Anulado"].includes(p.estado)
    );
  }
}

export function obtenerServicios() {
  const servs = getServicios();
  return Array.isArray(servs) ? servs : [];
}

// Devuelve la fecha de creación del proceso
export function obtenerFechaCreacion(proc) {
  // Suponiendo que existe un campo fechaCreacion o similar
  return proc.fechaCreacion || proc.fechaSolicitud || "-";
}

// Devuelve la fecha de finalización del proceso (si está finalizado)
export function obtenerFechaFin(proc) {
  // Suponiendo que existe un campo fechaFin o similar
  return proc.fechaFin || "-";
}

// Calcula la duración del proceso en días (entre creación y fin)
export function calcularDuracion(proc) {
  const inicio = new Date(obtenerFechaCreacion(proc));
  const fin = new Date(obtenerFechaFin(proc));
  if (isNaN(inicio) || isNaN(fin) || obtenerFechaFin(proc) === "-") return "-";
  const diffMs = fin - inicio;
  const diffDias = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDias + " días";
}
