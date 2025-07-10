// src/utils/permisos.js

// Obtiene los permisos del rol del usuario desde localStorage
export function getPermisosUsuario(usuario) {
  const roles = JSON.parse(localStorage.getItem("roles")) || [];
  const rolUsuario = roles.find(r => r.nombre === usuario.role);
  return rolUsuario ? rolUsuario.permisos : {};
}

// Verifica si el usuario tiene permiso para una acción en un módulo
export function tienePermiso(usuario, modulo, accion) {
  // Si es administrador, siempre true
  if (usuario.role === "Administrador") return true;
  const permisos = getPermisosUsuario(usuario);
  return permisos[modulo]?.[accion] === true;
} 