// utils/rolesUtils.js

export const guardarRoles = (roles, nuevo, setRoles) => {
  const actualizados = [...roles, nuevo];
  setRoles(actualizados);
  localStorage.setItem("roles", JSON.stringify(actualizados));
};

export function getEstadoBadge(estado) {
  // Acepta valores booleanos y strings como "activo" o "inactivo"
  if (estado === true || estado === "activo" || estado === "Activo") {
    return { texto: "Activo", color: "#28a745" }; // Verde
  }
  return { texto: "Inactivo", color: "#dc3545" }; // Rojo
}

export const modelosDisponibles = [
  "Dashboard",
  "Citas",
  "Usuarios",
  "Certificacion",
  "Amplificacion de Servicios",
  "Renovacion",
  "Proceso de Oposicion",
  "Roles",
];
