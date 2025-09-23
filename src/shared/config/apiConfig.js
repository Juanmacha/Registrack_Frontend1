// Configuración de la API
const API_CONFIG = {
  // URL base de la API desplegada
  BASE_URL: 'https://api-registrack.onrender.com',
  
  // Endpoints de autenticación
  ENDPOINTS: {
    // Autenticación
    LOGIN: '/api/usuarios/login',
    REGISTER: '/api/usuarios/registrar',
    FORGOT_PASSWORD: '/api/usuarios/forgot-password',
    RESET_PASSWORD: '/api/usuarios/reset-password',
    
    // Usuarios
    USERS: '/api/usuarios',
    CREATE_USER: '/api/usuarios/crear',
    USER_BY_ID: (id) => `/api/usuarios/${id}`,
    
    // Servicios
    SERVICES: '/api/servicios',
    SERVICE_BY_ID: (id) => `/api/servicios/${id}`,
    SERVICE_PROCESSES: (id) => `/api/servicios/${id}/procesos`,
    
    // Solicitudes
    REQUESTS: '/api/gestion-solicitudes',
    CREATE_REQUEST: (service) => `/api/gestion-solicitudes/crear/${encodeURIComponent(service)}`,
    MY_REQUESTS: '/api/gestion-solicitudes/mias',
    SEARCH_REQUESTS: '/api/gestion-solicitudes/buscar',
    REQUEST_BY_ID: (id) => `/api/gestion-solicitudes/${id}`,
    EDIT_REQUEST: (id) => `/api/gestion-solicitudes/editar/${id}`,
    CANCEL_REQUEST: (id) => `/api/gestion-solicitudes/anular/${id}`,
    
    // Citas
    APPOINTMENTS: '/api/citas',
    RESCHEDULE_APPOINTMENT: (id) => `/api/citas/${id}/reprogramar`,
    CANCEL_APPOINTMENT: (id) => `/api/citas/${id}/anular`,
    APPOINTMENTS_REPORT: '/api/citas/reporte/excel',
    
    // Seguimiento
    TRACKING: '/api/seguimiento',
    TRACKING_HISTORY: (id) => `/api/seguimiento/historial/${id}`,
    CREATE_TRACKING: '/api/seguimiento/crear',
    TRACKING_BY_ID: (id) => `/api/seguimiento/${id}`,
    SEARCH_TRACKING: (id) => `/api/seguimiento/buscar/${id}`,
    
    // Archivos
    FILES: '/api/archivos',
    UPLOAD_FILE: '/api/archivos/upload',
    DOWNLOAD_FILE: (id) => `/api/archivos/${id}/download`,
    CLIENT_FILES: (id) => `/api/archivos/cliente/${id}`,
    
    // Clientes
    CLIENTS: '/api/gestion-clientes',
    CLIENT_BY_ID: (id) => `/api/gestion-clientes/${id}`,
    CLIENTS_REPORT: '/api/gestion-clientes/reporte/excel',
    
    // Pagos
    PAYMENTS: '/api/gestion-pagos',
    PAYMENT_BY_ID: (id) => `/api/gestion-pagos/${id}`,
    
    // Empresas
    COMPANIES: '/api/empresas',
    COMPANY_CLIENTS: (id) => `/api/empresas/${id}/clientes`,
    COMPANY_CLIENTS_BY_NIT: (nit) => `/api/empresas/nit/${nit}/clientes`,
    
    // Tipos de archivo
    FILE_TYPES: '/api/gestion-tipo-archivos',
    FILE_TYPE_BY_ID: (id) => `/api/gestion-tipo-archivos/${id}`,
    
    // Formularios dinámicos
    DYNAMIC_FORMS: '/api/formularios-dinamicos',
    FORM_BY_SERVICE: (id) => `/api/formularios-dinamicos/servicio/${id}`,
    VALIDATE_FORM: '/api/formularios-dinamicos/validar'
  },
  
  // Configuración de headers por defecto
  DEFAULT_HEADERS: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  },
  
  // Timeout para las peticiones (en milisegundos)
  TIMEOUT: 30000,
  
  // Configuración de reintentos
  RETRY_ATTEMPTS: 3,
  RETRY_DELAY: 1000
};

export default API_CONFIG;
