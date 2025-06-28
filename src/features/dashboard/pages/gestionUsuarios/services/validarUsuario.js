import Swal from "sweetalert2";

export const validarUsuario = (usuario) => {
  const errores = [];

  if (!usuario.documentType) {
    errores.push("El tipo de documento es obligatorio.");
  }

  if (!usuario.documentNumber || isNaN(usuario.documentNumber)) {
    errores.push("El número de documento debe ser válido.");
  }

  if (!usuario.firstName || usuario.firstName.trim().length < 2) {
    errores.push("El nombre es obligatorio y debe tener al menos 2 letras.");
  }

  if (!usuario.lastName || usuario.lastName.trim().length < 2) {
    errores.push("El apellido es obligatorio.");
  }

  if (!usuario.email || !/\S+@\S+\.\S+/.test(usuario.email)) {
    errores.push("El email no es válido.");
  }

  if (!usuario.role) {
    errores.push("El rol es obligatorio.");
  }

  if (errores.length > 0) {
    Swal.fire({
      icon: "error",
      title: "Errores de validación",
      html: errores.map((e) => `<p>• ${e}</p>`).join(""),
      confirmButtonText: "Entendido",
      confirmButtonColor: "#d33",
    });

    return false; // Hubo errores
  }

  return true; // Todo está bien
};
