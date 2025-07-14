// Mock Data Centralizado - RegistrackFrontend
// Este archivo contiene todos los datos mock del sistema organizados por entidades

// ============================================================================
// CONSTANTES Y CONFIGURACIÓN
// ============================================================================

export const MOCK_CONFIG = {
  version: "1.0.0",
  lastUpdate: "2025-01-27",
  description: "Datos mock centralizados para RegistrackFrontend"
};

// ============================================================================
// TIPOS DE DOCUMENTO ESTANDARIZADOS
// ============================================================================

export const TIPOS_DOCUMENTO = {
  CEDULA: "Cédula de Ciudadanía",
  TI: "Tarjeta de Identidad", 
  PASAPORTE: "Pasaporte",
  NIT: "NIT",
  PEP: "Permiso Especial de Permanencia",
  CE: "Cédula de Extranjería"
};

// ============================================================================
// ROLES DE USUARIO - UNIFICADOS
// ============================================================================

export const ROLES = {
  ADMINISTRADOR: "Administrador",
  EMPLEADO: "Empleado", 
  CLIENTE: "Cliente"
};

// Eliminar ROLES_SISTEMA duplicado y usar ROLES en todo el sistema
// export const ROLES_SISTEMA = { ... }; // ❌ ELIMINAR ESTA DUPLICACIÓN

// ============================================================================
// ESTADOS DE PROCESO
// ============================================================================

export const ESTADOS_PROCESO = {
  RECIBIDA: "recibida",
  EN_PROCESO: "en_proceso",
  FINALIZADO: "finalizado",
  ANULADO: "anulado",
  PENDIENTE: "pendiente",
  APROBADO: "aprobado",
  RECHAZADO: "rechazado"
};

// ============================================================================
// ESTADOS DE CITAS
// ============================================================================

export const ESTADOS_CITA = {
  PROGRAMADA: "programada",
  REPROGRAMADA: "reprogramada",
  CANCELADA: "cancelada",
  COMPLETADA: "completada",
  PENDIENTE: "pendiente"
};

// ============================================================================
// MÉTODOS DE PAGO
// ============================================================================

export const METODOS_PAGO = {
  TRANSFERENCIA: "Transferencia",
  EFECTIVO: "Efectivo",
  TARJETA: "Tarjeta",
  PSE: "PSE",
  DAVIPLATA: "Daviplata"
};

// ============================================================================
// SERVICIOS DISPONIBLES
// ============================================================================

export const SERVICIOS = [
  {
    id: "1",
    nombre: "Búsqueda de Antecedentes",
    descripcion_corta: "¿Necesitas saber si tu marca ya está registrada por otra persona o si está disponible para registro? Aquí puedes verificarlo.",
    visible_en_landing: true,
    landing_data: {
      titulo: "Búsqueda de Antecedentes",
      resumen: "Verifica la disponibilidad de tu marca antes de iniciar el registro.",
      imagen: "/images/busqueda.jpg"
    },
    info_page_data: {
      descripcion: "Nuestro servicio de búsqueda de antecedentes incluye una revisión exhaustiva de bases de datos nacionales e internacionales para verificar la disponibilidad de marcas y evitar conflictos legales futuros.",
    },
    route_path: "/pages/busqueda",
    process_states: [
      { id: "1", name: "Solicitud Recibida", order: 1, status_key: "recibida" },
      { id: "2", name: "Búsqueda en Proceso", order: 2, status_key: "en_proceso" },
      { id: "3", name: "Informe Generado", order: 3, status_key: "informe" }
    ]
  },
  {
    id: "2", 
    nombre: "Certificación de Marca",
    descripcion_corta: "¿Necesitas certificar tu marca para adquirirla de uso antes de que otro lo haga?",
    visible_en_landing: true,
    landing_data: {
      titulo: "Certificación de Marca",
      resumen: "Acompañamiento completo en el proceso de certificación de tu marca.",
      imagen: "/images/certificacion.jpg"
    },
    info_page_data: {
      descripcion: "Te acompañamos en todo el proceso de certificación de marca, desde la presentación de la solicitud hasta la obtención del certificado oficial, garantizando el cumplimiento de todos los requisitos legales.",
    },
    route_path: "/pages/certificacion",
    process_states: [
      { id: "1", name: "En estudio de forma", order: 1, status_key: "estudio_forma" },
      { id: "2", name: "Publicado", order: 2, status_key: "publicado" },
      { id: "3", name: "Oposición", order: 3, status_key: "oposicion" },
      { id: "4", name: "En estudio de fondo", order: 4, status_key: "estudio_fondo" },
      { id: "5", name: "Registrado", order: 5, status_key: "registrado" },
      { id: "6", name: "Rechazado primera instancia", order: 6, status_key: "rechazado_1" },
      { id: "7", name: "Apelación", order: 7, status_key: "apelacion" },
      { id: "8", name: "Aprobado", order: 8, status_key: "aprobado" },
      { id: "9", name: "Rechazado", order: 9, status_key: "rechazado" }
    ]
  },
  {
    id: "3",
    nombre: "Renovación de Marca", 
    descripcion_corta: "¿Tu certificación está por caducar y necesitas una renovación antes de que otra persona se adueñe de ella?",
    visible_en_landing: true,
    landing_data: {
      titulo: "Renovación de Marca",
      resumen: "Renueva tu marca y mantén tu protección legal vigente.",
      imagen: "/images/renovacion.jpeg"
    },
    info_page_data: {
      descripcion: "Mantenemos tu marca protegida gestionando las renovaciones oportunas de los registros, asegurando que nunca pierdas la protección legal de tu propiedad intelectual.",
    },
    route_path: "/pages/renovacion",
    process_states: [
      { id: "1", name: "Solicitud Recibida", order: 1, status_key: "recibida" },
      { id: "2", name: "Renovación en Proceso", order: 2, status_key: "en_proceso" },
      { id: "3", name: "Renovada", order: 3, status_key: "renovada" }
    ]
  },
  {
    id: "4",
    nombre: "Presentación de Oposición",
    descripcion_corta: "¿Necesitas presentar una demanda de oposición porque crees que alguien está solicitando un nombre parecido, gramático o igual a tu marca?",
    visible_en_landing: true,
    landing_data: {
      titulo: "Presentación de Oposición", 
      resumen: "Defiende tus derechos de marca presentando una oposición.",
      imagen: "/images/opocision.jpeg"
    },
    info_page_data: {
      descripcion: "Protegemos tus derechos de marca presentando oposiciones estratégicas contra solicitudes de registro que puedan generar confusión o afectar tu propiedad intelectual.",
    },
    route_path: "/pages/presentacion-oposicion",
    process_states: [
      { id: "1", name: "Solicitud Recibida", order: 1, status_key: "recibida" },
      { id: "2", name: "Oposición en Proceso", order: 2, status_key: "en_proceso" },
      { id: "3", name: "Resuelta", order: 3, status_key: "resuelta" }
    ]
  },
  {
    id: "5",
    nombre: "Cesión de Marca",
    descripcion_corta: "¿Necesitas cambiar el titular de la marca que está registrada a tu nombre o colocar una marca que no va tuya a tu nombre?",
    visible_en_landing: true,
    landing_data: {
      titulo: "Cesión de Marca",
      resumen: "Gestiona la transferencia de derechos de tu marca de forma segura.",
      imagen: "/images/cesion.jpg"
    },
    info_page_data: {
      descripcion: "Facilitamos la transferencia de derechos de marca, asesorando en todos los aspectos legales y administrativos del proceso de cesión para garantizar una transacción segura y legal.",
    },
    route_path: "/pages/cesion-marca",
    process_states: [
      { id: "1", name: "Solicitud Recibida", order: 1, status_key: "recibida" },
      { id: "2", name: "Cesión en Proceso", order: 2, status_key: "en_proceso" },
      { id: "3", name: "Cedido", order: 3, status_key: "cedido" }
    ]
  },
  {
    id: "6",
    nombre: "Ampliación de Alcance",
    descripcion_corta: "¿Tienes una marca que presta uno o varios servicios y productos y quieres agregarle otro servicio?",
    visible_en_landing: true,
    landing_data: {
      titulo: "Ampliación de Alcance",
      resumen: "Extiende la protección de tu marca a nuevas clases o categorías.",
      imagen: "/images/ampliaxcion.jpg"
    },
    info_page_data: {
      descripcion: "Ampliamos la protección de tu marca a nuevas clases o categorías de productos y servicios, adaptando la estrategia de protección a la evolución de tu negocio.",
    },
    route_path: "/pages/ampliacion",
    process_states: [
      { id: "1", name: "Solicitud Recibida", order: 1, status_key: "recibida" },
      { id: "2", name: "Ampliación en Proceso", order: 2, status_key: "en_proceso" },
      { id: "3", name: "Ampliado", order: 3, status_key: "ampliado" }
    ]
  }
];

// ============================================================================
// USUARIOS DEL SISTEMA
// ============================================================================

export const USUARIOS = [
  {
    id: "1",
    firstName: "Juan",
    lastName: "Pérez",
    documentType: TIPOS_DOCUMENTO.CEDULA,
    documentNumber: "1010101010",
    email: "juan.perez@example.com",
    password: "123456",
    role: ROLES.ADMINISTRADOR,
    estado: "activo"
  },
  {
    id: "2", 
    firstName: "Ana",
    lastName: "Gómez",
    documentType: TIPOS_DOCUMENTO.TI,
    documentNumber: "1144228899",
    email: "ana.gomez@example.com",
    password: "abcdef",
    role: ROLES.CLIENTE,
    estado: "activo"
  },
  {
    id: "3",
    firstName: "Carlos",
    lastName: "Ramírez", 
    documentType: TIPOS_DOCUMENTO.CEDULA,
    documentNumber: "999222111",
    email: "carlos.ramirez@example.com",
    password: "pass1234",
    role: ROLES.CLIENTE,
    estado: "activo"
  },
  {
    id: "4",
    firstName: "Laura",
    lastName: "Torres",
    documentType: TIPOS_DOCUMENTO.CEDULA,
    documentNumber: "1122334455",
    email: "laura.torres@example.com",
    password: "securepass",
    role: ROLES.ADMINISTRADOR,
    estado: "activo"
  },
  {
    id: "5",
    firstName: "Yuver",
    lastName: "Martinez",
    documentType: TIPOS_DOCUMENTO.CEDULA,
    documentNumber: "1077998509",
    email: "antoniodjromana@gmail.com",
    password: "Yuver",
    role: ROLES.CLIENTE,
    estado: "activo"
  },
  {
    id: "6",
    firstName: "Santiago",
    lastName: "Guerrero",
    documentType: TIPOS_DOCUMENTO.CEDULA,
    documentNumber: "9090808070",
    email: "santiago.guerrero@example.com",
    password: "santi123",
    role: ROLES.ADMINISTRADOR,
    estado: "activo"
  }
];

// ============================================================================
// EMPLEADOS
// ============================================================================

export const EMPLEADOS = [
  {
    id: "1",
    tipoDocumento: TIPOS_DOCUMENTO.CEDULA,
    documento: "123456789",
    nombre: "Juan",
    apellidos: "Pérez",
    email: "juan@example.com",
    rol: ROLES.ADMINISTRADOR,
    estado: "Activo",
    fechaContratacion: "2024-01-15",
    departamento: "Administración",
    telefono: "3001234567",
    direccion: "Calle 123 #45-67, Medellín"
  },
  {
    id: "2",
    tipoDocumento: TIPOS_DOCUMENTO.CEDULA,
    documento: "987654321",
    nombre: "Ana",
    apellidos: "Gómez",
    email: "ana@example.com",
    rol: ROLES.EMPLEADO,
    estado: "Activo",
    fechaContratacion: "2024-03-20",
    departamento: "Atención al Cliente",
    telefono: "3009876543",
    direccion: "Carrera 78 #90-12, Medellín"
  },
  {
    id: "3",
    tipoDocumento: TIPOS_DOCUMENTO.CEDULA,
    documento: "555666777",
    nombre: "Carlos",
    apellidos: "Morales",
    email: "carlos@example.com",
    rol: ROLES.EMPLEADO,
    estado: "Activo",
    fechaContratacion: "2024-02-10",
    departamento: "Gestión de Servicios",
    telefono: "3005556667",
    direccion: "Avenida 34 #56-78, Medellín"
  },
  {
    id: "4",
    tipoDocumento: TIPOS_DOCUMENTO.CEDULA,
    documento: "111222333",
    nombre: "María",
    apellidos: "López",
    email: "maria@example.com",
    rol: ROLES.ADMINISTRADOR,
    estado: "Activo",
    fechaContratacion: "2023-11-05",
    departamento: "Administración",
    telefono: "3001112223",
    direccion: "Calle 89 #12-34, Medellín"
  },
  {
    id: "5",
    tipoDocumento: TIPOS_DOCUMENTO.CEDULA,
    documento: "444555666",
    nombre: "Laura",
    apellidos: "Torres",
    email: "laura@example.com",
    rol: ROLES.EMPLEADO,
    estado: "Activo",
    fechaContratacion: "2024-04-15",
    departamento: "Atención al Cliente",
    telefono: "3004445556",
    direccion: "Carrera 45 #67-89, Medellín"
  },
  {
    id: "6",
    tipoDocumento: TIPOS_DOCUMENTO.CEDULA,
    documento: "777888999",
    nombre: "Roberto",
    apellidos: "Hernández",
    email: "roberto@example.com",
    rol: ROLES.EMPLEADO,
    estado: "Activo",
    fechaContratacion: "2024-01-30",
    departamento: "Gestión de Servicios",
    telefono: "3007778889",
    direccion: "Avenida 12 #34-56, Medellín"
  }
];

// ============================================================================
// CLIENTES
// ============================================================================

export const CLIENTES = [
  {
    id: "1",
    tipoDocumento: TIPOS_DOCUMENTO.CEDULA,
    documento: "1001234567",
    nombre: "Carlos",
    apellido: "Pérez",
    email: "carlos.perez@example.com",
    telefono: "3001234567",
    nitEmpresa: "900123456",
    nombreEmpresa: "Soluciones S.A.S.",
    marca: "SolTech",
    tipoPersona: "Jurídica",
    estado: "activo"
  },
  {
    id: "2",
    tipoDocumento: TIPOS_DOCUMENTO.CE,
    documento: "1009876543",
    nombre: "Luisa",
    apellido: "Gómez",
    email: "luisa.gomez@example.com",
    telefono: "3019876543",
    nitEmpresa: "900987654",
    nombreEmpresa: "Innovar Ltda.",
    marca: "Innova",
    tipoPersona: "Jurídica",
    estado: "activo"
  },
  {
    id: "3",
    tipoDocumento: TIPOS_DOCUMENTO.CEDULA,
    documento: "1012345678",
    nombre: "Ana",
    apellido: "Martínez",
    email: "ana.martinez@example.com",
    telefono: "3023456789",
    nitEmpresa: "901234567",
    nombreEmpresa: "Creativos S.A.",
    marca: "Creativa",
    tipoPersona: "Jurídica",
    estado: "activo"
  },
  {
    id: "4",
    tipoDocumento: TIPOS_DOCUMENTO.TI,
    documento: "1023456789",
    nombre: "Julián",
    apellido: "Ramírez",
    email: "julian.ramirez@example.com",
    telefono: "3101234567",
    nitEmpresa: "902345678",
    nombreEmpresa: "Empaques Express",
    marca: "EmpaqX",
    tipoPersona: "Natural",
    estado: "activo"
  }
];

// ============================================================================
// VENTAS/SERVICIOS EN PROCESO
// ============================================================================

export const VENTAS_EN_PROCESO = [
  {
    id: "1",
    titular: "Juan Pérez",
    tipoPersona: "Natural",
    expediente: "EXP-00123",
    tipoSolicitud: "Certificación de Marca",
    marca: "TechNova",
    encargado: "Dra. Gómez",
    proximaCita: null,
    estado: "En revisión",
    comentarios: [],
    fechaSolicitud: "2025-01-15",
    email: "juan.perez@example.com",
    telefono: "3001234567"
  },
  {
    id: "2",
    titular: "Ana Gómez",
    tipoPersona: "Natural", 
    expediente: "EXP-00124",
    tipoSolicitud: "Certificación de Marca",
    marca: "Zentra",
    encargado: "Dr. Morales",
    proximaCita: "2025-06-22",
    estado: "Pendiente",
    comentarios: [],
    fechaSolicitud: "2025-01-20",
    email: "ana.gomez@example.com",
    telefono: "3009876543"
  },
  {
    id: "3",
    titular: "Carlos Ramírez",
    tipoPersona: "Natural",
    expediente: "EXP-00125", 
    tipoSolicitud: "Búsqueda de Antecedentes",
    marca: "Creativa",
    encargado: "Dra. López",
    proximaCita: null,
    estado: "En proceso",
    comentarios: [],
    fechaSolicitud: "2025-01-25",
    email: "carlos.ramirez@example.com",
    telefono: "3023456789"
  },
  {
    id: "4",
    titular: "Yuver Martinez",
    tipoPersona: "Natural",
    expediente: "EXP-00126",
    tipoSolicitud: "Renovación de Marca",
    marca: "InnovaTech",
    encargado: "Dr. Rodríguez",
    proximaCita: null,
    estado: "En proceso",
    comentarios: [],
    fechaSolicitud: "2025-01-28",
    email: "antoniodjromana@gmail.com",
    telefono: "3012345678"
  },
  {
    id: "5",
    titular: "Laura Torres",
    tipoPersona: "Natural",
    expediente: "EXP-00127",
    tipoSolicitud: "Presentación de Oposición",
    marca: "TorresDesign",
    encargado: "Dra. Silva",
    proximaCita: null,
    estado: "Pendiente",
    comentarios: [],
    fechaSolicitud: "2025-01-30",
    email: "laura.torres@example.com",
    telefono: "3023456789"
  },
  {
    id: "6",
    titular: "Santiago Guerrero",
    tipoPersona: "Natural",
    expediente: "EXP-00128",
    tipoSolicitud: "Cesión de Marca",
    marca: "GuerreroDesign",
    encargado: "Dr. Mendoza",
    proximaCita: null,
    estado: "En revisión",
    comentarios: [],
    fechaSolicitud: "2025-02-01",
    email: "santiago.guerrero@example.com",
    telefono: "3034567890"
  },
  {
    id: "7",
    titular: "Empresa ABC",
    tipoPersona: "Jurídica",
    expediente: "EXP-00129",
    tipoSolicitud: "Ampliación de Alcance",
    marca: "ABC Solutions",
    encargado: "Dra. Herrera",
    proximaCita: null,
    estado: "En proceso",
    comentarios: [],
    fechaSolicitud: "2025-02-03",
    email: "empresa.abc@example.com",
    telefono: "3045678901"
  }
];

// ============================================================================
// VENTAS/SERVICIOS FINALIZADOS
// ============================================================================

export const VENTAS_FINALIZADAS = [
  {
    id: "8",
    titular: "Juan Pérez",
    tipoPersona: "Natural",
    expediente: "EXP-00120",
    tipoSolicitud: "Renovación de Marca",
    marca: "TechNova",
    encargado: "Dr. Pérez",
    proximaCita: null,
    estado: "Finalizado",
    comentarios: [],
    fechaSolicitud: "2024-12-15",
    fechaFinalizacion: "2025-01-10",
    email: "juan.perez@example.com",
    telefono: "3101234567"
  },
  {
    id: "9",
    titular: "Ana Gómez",
    tipoPersona: "Natural",
    expediente: "EXP-00121",
    tipoSolicitud: "Certificación de Marca", 
    marca: "Zentra",
    encargado: "Dra. Torres",
    proximaCita: null,
    estado: "Rechazado",
    comentarios: [],
    fechaSolicitud: "2024-11-20",
    fechaFinalizacion: "2025-01-05",
    email: "ana.gomez@example.com",
    telefono: "3019876543"
  },
  {
    id: "10",
    titular: "Carlos Ramírez",
    tipoPersona: "Natural",
    expediente: "EXP-00122",
    tipoSolicitud: "Búsqueda de Antecedentes",
    marca: "Creativa",
    encargado: "Dra. Vega",
    proximaCita: null,
    estado: "Finalizado",
    comentarios: [],
    fechaSolicitud: "2024-10-15",
    fechaFinalizacion: "2024-11-20",
    email: "carlos.ramirez@example.com",
    telefono: "3056789012"
  },
  {
    id: "11",
    titular: "Yuver Martinez",
    tipoPersona: "Natural",
    expediente: "EXP-00123",
    tipoSolicitud: "Presentación de Oposición",
    marca: "InnovaTech",
    encargado: "Dr. Castro",
    proximaCita: null,
    estado: "Aprobado",
    comentarios: [],
    fechaSolicitud: "2024-09-10",
    fechaFinalizacion: "2024-12-05",
    email: "antoniodjromana@gmail.com",
    telefono: "3067890123"
  },
  {
    id: "12",
    titular: "Laura Torres",
    tipoPersona: "Natural",
    expediente: "EXP-00124",
    tipoSolicitud: "Cesión de Marca",
    marca: "TorresDesign",
    encargado: "Dra. Morales",
    proximaCita: null,
    estado: "Finalizado",
    comentarios: [],
    fechaSolicitud: "2024-08-20",
    fechaFinalizacion: "2024-10-15",
    email: "laura.torres@example.com",
    telefono: "3078901234"
  },
  {
    id: "13",
    titular: "Santiago Guerrero",
    tipoPersona: "Natural",
    expediente: "EXP-00125",
    tipoSolicitud: "Ampliación de Alcance",
    marca: "GuerreroDesign",
    encargado: "Dr. Herrera",
    proximaCita: null,
    estado: "Aprobado",
    comentarios: [],
    fechaSolicitud: "2024-07-15",
    fechaFinalizacion: "2024-09-20",
    email: "santiago.guerrero@example.com",
    telefono: "3089012345"
  }
];

// ============================================================================
// PAGOS
// ============================================================================

export const PAGOS = [
  {
    id_pago: 1,
    monto: 150000.00,
    fecha_pago: "2025-01-15T10:30:00",
    metodo_pago: METODOS_PAGO.TRANSFERENCIA,
    estado: true,
    comprobante_url: "https://example.com/comprobantes/1.pdf",
    id_orden_servicio: "1"
  },
  {
    id_pago: 2,
    monto: 85000.00,
    fecha_pago: "2025-01-17T14:45:00",
    metodo_pago: METODOS_PAGO.EFECTIVO,
    estado: false,
    comprobante_url: "https://example.com/comprobantes/2.pdf",
    id_orden_servicio: "2"
  },
  {
    id_pago: 3,
    monto: 200000.00,
    fecha_pago: "2025-01-20T09:15:00",
    metodo_pago: METODOS_PAGO.TARJETA,
    estado: true,
    comprobante_url: null,
    id_orden_servicio: "3"
  },
  {
    id_pago: 4,
    monto: 135000.00,
    fecha_pago: "2025-01-22T11:00:00",
    metodo_pago: METODOS_PAGO.TRANSFERENCIA,
    estado: true,
    comprobante_url: "https://example.com/comprobantes/4.pdf",
    id_orden_servicio: "4"
  }
];

// ============================================================================
// CITAS
// ============================================================================

export const CITAS = [
  {
    id: "1",
    title: "Asesor: Dra. Gómez",
    start: "2025-01-30T09:00:00",
    end: "2025-01-30T10:00:00",
    extendedProps: {
      nombre: "Juan",
      apellido: "Pérez",
      cedula: "1010101010",
      telefono: "3001234567",
      horaInicio: "09:00",
      horaFin: "10:00",
      detalle: "Consulta sobre certificación de marca",
      tipoCita: "Consulta",
      asesor: "Dra. Gómez",
      estado: "Programada"
    }
  },
  {
    id: "2",
    title: "Asesor: Dr. Morales",
    start: "2025-02-01T14:00:00",
    end: "2025-02-01T15:00:00",
    extendedProps: {
      nombre: "Ana",
      apellido: "Martínez",
      cedula: "1012345678",
      telefono: "3023456789",
      horaInicio: "14:00",
      horaFin: "15:00",
      detalle: "Revisión de documentos",
      tipoCita: "Revisión",
      asesor: "Dr. Morales",
      estado: "Programada"
    }
  }
];

// ============================================================================
// ROLES Y PERMISOS
// ============================================================================

export const ROLES_PERMISOS = [
  {
    id: "1",
    nombre: ROLES.ADMINISTRADOR,
    estado: "Activo",
    descripcion: "Acceso completo al sistema con todos los permisos",
    permisos: {
      usuarios: { crear: true, leer: true, actualizar: true, eliminar: true },
      empleados: { crear: true, leer: true, actualizar: true, eliminar: true },
      clientes: { crear: true, leer: true, actualizar: true, eliminar: true },
      ventas: { crear: true, leer: true, actualizar: true, eliminar: true },
      pagos: { crear: true, leer: true, actualizar: true, eliminar: true },
      citas: { crear: true, leer: true, actualizar: true, eliminar: true },
      roles: { crear: true, leer: true, actualizar: true, eliminar: true },
      reportes: { crear: true, leer: true, actualizar: true, eliminar: true },
      configuracion: { crear: true, leer: true, actualizar: true, eliminar: true }
    }
  },
  {
    id: "2",
    nombre: ROLES.EMPLEADO,
    estado: "Activo",
    descripcion: "Acceso limitado para gestión de clientes y servicios",
    permisos: {
      usuarios: { crear: false, leer: true, actualizar: false, eliminar: false },
      empleados: { crear: false, leer: true, actualizar: false, eliminar: false },
      clientes: { crear: true, leer: true, actualizar: true, eliminar: false },
      ventas: { crear: true, leer: true, actualizar: true, eliminar: false },
      pagos: { crear: true, leer: true, actualizar: true, eliminar: false },
      citas: { crear: true, leer: true, actualizar: true, eliminar: false },
      roles: { crear: false, leer: false, actualizar: false, eliminar: false },
      reportes: { crear: false, leer: true, actualizar: false, eliminar: false },
      configuracion: { crear: false, leer: false, actualizar: false, eliminar: false }
    }
  },
  {
    id: "3",
    nombre: ROLES.CLIENTE,
    estado: "Activo",
    descripcion: "Acceso básico para consulta de servicios propios",
    permisos: {
      usuarios: { crear: false, leer: false, actualizar: false, eliminar: false },
      empleados: { crear: false, leer: false, actualizar: false, eliminar: false },
      clientes: { crear: false, leer: false, actualizar: false, eliminar: false },
      ventas: { crear: false, leer: true, actualizar: false, eliminar: false },
      pagos: { crear: false, leer: true, actualizar: false, eliminar: false },
      citas: { crear: true, leer: true, actualizar: false, eliminar: false },
      roles: { crear: false, leer: false, actualizar: false, eliminar: false },
      reportes: { crear: false, leer: false, actualizar: false, eliminar: false },
      configuracion: { crear: false, leer: false, actualizar: false, eliminar: false }
    }
  }
];

// ============================================================================
// FUNCIONES DE UTILIDAD
// ============================================================================

// Obtener servicio por ID
export function getServicioById(id) {
  return SERVICIOS.find(servicio => servicio.id === id);
}

// Obtener usuario por email
export function getUsuarioByEmail(email) {
  return USUARIOS.find(usuario => usuario.email === email);
}

// Obtener cliente por documento
export function getClienteByDocumento(documento) {
  return CLIENTES.find(cliente => cliente.documento === documento);
}

// Obtener empleado por documento
export function getEmpleadoByDocumento(documento) {
  return EMPLEADOS.find(empleado => empleado.documento === documento);
}

// Obtener ventas por cliente
export function getVentasByCliente(email) {
  return [
    ...VENTAS_EN_PROCESO.filter(venta => venta.email === email),
    ...VENTAS_FINALIZADAS.filter(venta => venta.email === email)
  ];
}

// Validar si un usuario tiene permisos
export function tienePermiso(usuario, recurso, accion) {
  const rol = ROLES_PERMISOS.find(r => r.nombre === usuario.role);
  if (!rol) return false;
  return rol.permisos[recurso]?.[accion] || false;
}

// ============================================================================
// EXPORTACIÓN PRINCIPAL
// ============================================================================

export default {
  MOCK_CONFIG,
  TIPOS_DOCUMENTO,
  ROLES,
  ESTADOS_PROCESO,
  METODOS_PAGO,
  SERVICIOS,
  USUARIOS,
  EMPLEADOS,
  CLIENTES,
  VENTAS_EN_PROCESO,
  VENTAS_FINALIZADAS,
  PAGOS,
  CITAS,
  ROLES_PERMISOS,
  // Funciones de utilidad
  getServicioById,
  getUsuarioByEmail,
  getClienteByDocumento,
  getEmpleadoByDocumento,
  getVentasByCliente,
  tienePermiso
}; 