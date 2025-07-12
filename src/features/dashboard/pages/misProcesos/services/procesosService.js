// Servicio para obtener y filtrar procesos de usuario
// ✅ REFACTORIZADO: Ahora usa la data mock centralizada

import { SaleService, ServiceService, initializeMockData } from '../../../../../utils/mockDataService.js';

// Inicializar datos mock centralizados
initializeMockData();

export function getSolicitudesUsuario(email) {
  try {
    // Usar SaleService para obtener todas las ventas
    const todas = SaleService.getAll();
    return todas.filter((s) => s && typeof s === "object" && s.email === email);
  } catch {
    return [];
  }
}

export function filtrarProcesos(procesos, finalizados = false) {
  if (!Array.isArray(procesos)) return [];
  if (finalizados) {
    return procesos.filter((p) =>
      ["Aprobado", "Rechazado", "Anulado", "Finalizado"].includes(p.estado)
    );
  } else {
    return procesos.filter(
      (p) => !["Aprobado", "Rechazado", "Anulado", "Finalizado"].includes(p.estado)
    );
  }
}

export function obtenerServicios() {
  const servs = ServiceService.getAll();
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
