import { mostrarConfirmacion, mostrarMensajeExito } from "../../../../../utils/alerts";

const eliminarRol = async (index, roles, setRoles) => {
  const confirmado = await mostrarConfirmacion(
    "¿Estás seguro?",
    "Esta acción no se puede deshacer.",
    "Sí, eliminar"
  );

  if (confirmado.isConfirmed) {
    const nuevosRoles = [...roles];
    nuevosRoles.splice(index, 1);
    setRoles(nuevosRoles);
    localStorage.setItem("roles", JSON.stringify(nuevosRoles));
    mostrarMensajeExito("Rol eliminado correctamente.");
  }
};

export default eliminarRol;
