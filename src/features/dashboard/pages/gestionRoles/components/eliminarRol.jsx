import { mostrarConfirmacion } from "../../../../../utils/alerts";
import notificationService from "../../../../../shared/services/NotificationService.js";

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
    notificationService.deleteSuccess('rol');
  }
};

export default eliminarRol;
