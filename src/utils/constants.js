// Constantes para estandarizar nombres y rutas del proyecto

// Nombres de servicios estandarizados
export const SERVICIOS = {
  BUSQUEDA: "Búsqueda de Antecedentes",
  CERTIFICACION: "Certificación de Marca", 
  RENOVACION: "Renovación de Marca",
  PRESENTACION_OPOSICION: "Presentación de Oposición",
  CESION: "Cesión de Marca",
  AMPLIACION: "Ampliación de Alcance"
};

// Rutas estandarizadas (kebab-case)
export const RUTAS = {
  BUSQUEDA: "/pages/busqueda",
  CERTIFICACION: "/pages/certificacion", 
  RENOVACION: "/pages/renovacion",
  PRESENTACION_OPOSICION: "/pages/presentacion-oposicion",
  CESION: "/pages/cesion-marca",
  AMPLIACION: "/pages/ampliacion"
};

// Tipos de documento estandarizados
export const TIPOS_DOCUMENTO = {
  CEDULA: "Cédula de Ciudadanía",
  PASAPORTE: "Pasaporte",
  DNI: "DNI",
  TI: "Tarjeta de Identidad",
  NIT: "NIT"
};

// Estados de proceso estandarizados
export const ESTADOS_PROCESO = {
  RECIBIDA: "recibida",
  EN_PROCESO: "en_proceso", 
  FINALIZADO: "finalizado",
  ANULADO: "anulado",
  PENDIENTE: "pendiente"
};

// Roles de usuario
export const ROLES = {
  ADMIN: "admin",
  USUARIO: "usuario",
  EMPLEADO: "empleado"
}; 