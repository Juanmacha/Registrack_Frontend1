import alertService from './alertService.js';

const citaAlertService = {
  // Alerta de fecha no válida
  fechaNoValida: () => {
    return alertService.warning(
      "Fecha no válida", 
      "No puedes agendar citas en fechas anteriores a hoy."
    );
  },

  // Alerta de cita agendada exitosamente
  citaAgendada: () => {
    return alertService.success(
      "Cita agendada", 
      "La cita ha sido agendada correctamente."
    );
  },

  // Alerta de cita reprogramada exitosamente
  citaReprogramada: () => {
    return alertService.success(
      "Cita reprogramada", 
      "La cita ha sido reprogramada correctamente."
    );
  },

  // Alerta de cita anulada exitosamente
  citaAnulada: () => {
    return alertService.success(
      "Cita anulada", 
      "La cita ha sido anulada correctamente."
    );
  },

  // Confirmación para anular cita
  confirmarAnulacion: () => {
    return alertService.confirm(
      "Anular cita",
      "¿Estás seguro de que quieres anular esta cita? Esta acción no se puede deshacer.",
      "Sí, anular cita",
      "Cancelar"
    );
  },

  // Confirmación para reprogramar cita
  confirmarReprogramacion: () => {
    return alertService.confirm(
      "Reprogramar cita",
      "¿Estás seguro de que quieres reprogramar esta cita?",
      "Sí, reprogramar",
      "Cancelar"
    );
  },

  // Alerta de error al procesar cita
  errorProcesarCita: () => {
    return alertService.error(
      "Error", 
      "Error al procesar la cita. Por favor, intenta de nuevo."
    );
  },

  // Alerta de error al anular cita
  errorAnularCita: () => {
    return alertService.error(
      "Error", 
      "Error al anular la cita. Por favor, intenta de nuevo."
    );
  },

  // Alerta de error al reprogramar cita
  errorReprogramarCita: () => {
    return alertService.error(
      "Error", 
      "Error al reprogramar la cita. Por favor, intenta de nuevo."
    );
  },

  // Alerta de validación de campos
  validacionCampos: (campo) => {
    return alertService.validationError(
      `Por favor, completa el campo: ${campo}`
    );
  },

  // Alerta de conflicto de horarios
  conflictoHorarios: () => {
    return alertService.warning(
      "Conflicto de horarios",
      "Ya existe una cita programada en este horario. Por favor, selecciona otro horario."
    );
  },

  // Alerta de cita próxima
  citaProxima: (nombre, hora) => {
    return alertService.info(
      "Cita próxima",
      `Recordatorio: ${nombre} tiene una cita programada a las ${hora}.`
    );
  },

  // Alerta de cita vencida
  citaVencida: (nombre) => {
    return alertService.warning(
      "Cita vencida",
      `La cita de ${nombre} ha vencido. Por favor, reprograma o anula la cita.`
    );
  },

  // Alerta de carga para agendar cita
  cargandoAgendar: () => {
    return alertService.loading("Agendando cita...");
  },

  // Alerta de carga para reprogramar cita
  cargandoReprogramar: () => {
    return alertService.loading("Reprogramando cita...");
  },

  // Alerta de carga para anular cita
  cargandoAnular: () => {
    return alertService.loading("Anulando cita...");
  },

  // Alerta de éxito al exportar citas
  exportarExitoso: () => {
    return alertService.success(
      "Exportación exitosa",
      "Las citas han sido exportadas correctamente."
    );
  },

  // Alerta de error al exportar citas
  errorExportar: () => {
    return alertService.error(
      "Error de exportación",
      "Error al exportar las citas. Por favor, intenta de nuevo."
    );
  },

  // Alerta de confirmación para eliminar múltiples citas
  confirmarEliminacionMultiple: (cantidad) => {
    return alertService.confirm(
      "Eliminar citas",
      `¿Estás seguro de que quieres eliminar ${cantidad} citas? Esta acción no se puede deshacer.`,
      "Sí, eliminar",
      "Cancelar"
    );
  },

  // Alerta de éxito al eliminar múltiples citas
  eliminacionMultipleExitosa: (cantidad) => {
    return alertService.success(
      "Citas eliminadas",
      `${cantidad} citas han sido eliminadas correctamente.`
    );
  },

  // Alerta de información sobre el calendario
  infoCalendario: () => {
    return alertService.info(
      "Información del calendario",
      "• Citas programadas: Verde\n• Citas reprogramadas: Azul\n• Citas anuladas: Gris\n\nHaz clic en una fecha para agendar una nueva cita o en una cita existente para ver detalles."
    );
  },

  // Alerta de confirmación para limpiar calendario
  confirmarLimpiarCalendario: () => {
    return alertService.confirm(
      "Limpiar calendario",
      "¿Estás seguro de que quieres eliminar todas las citas del calendario? Esta acción no se puede deshacer.",
      "Sí, limpiar todo",
      "Cancelar"
    );
  },

  // Alerta de éxito al limpiar calendario
  calendarioLimpio: () => {
    return alertService.success(
      "Calendario limpio",
      "Todas las citas han sido eliminadas del calendario."
    );
  }
};

export default citaAlertService; 