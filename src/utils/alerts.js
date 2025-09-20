import { AlertService } from "../shared/styles/alertStandards.js";

export const mostrarMensajeExito = (mensaje) => {
  return AlertService.success("¡Éxito!", mensaje, {
    showConfirmButton: false,
    timer: 1500,
  });
};

export const mostrarMensajeError = (mensaje) => {
  return AlertService.error("Error", mensaje);
};

export const mostrarConfirmacion = async (titulo, mensaje) => {
  return await AlertService.confirm(titulo, mensaje, {
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
};
