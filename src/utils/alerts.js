import Swal from "sweetalert2";

export const mostrarMensajeExito = (mensaje) => {
  Swal.fire({
    icon: "success",
    title: mensaje,
    showConfirmButton: false,
    timer: 1500,
  });
};

export const mostrarMensajeError = (mensaje) => {
  Swal.fire({
    icon: "error",
    title: "Error",
    text: mensaje,
  });
};

export const mostrarConfirmacion = async (titulo, mensaje) => {
  return await Swal.fire({
    title: titulo,
    text: mensaje,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#d33",
    cancelButtonColor: "#3085d6",
    confirmButtonText: "Sí, eliminar",
    cancelButtonText: "Cancelar",
  });
};
