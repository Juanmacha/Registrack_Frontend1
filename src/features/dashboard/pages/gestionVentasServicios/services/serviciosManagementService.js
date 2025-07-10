// Servicio robusto para la gestión modular de servicios

const STORAGE_KEY = "servicios_management";

function getFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

function setToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) {
    const serviciosIniciales = [
      {
        id: "1",
        nombre: "Búsqueda de Antecedentes",
        descripcion_corta:
          "¿Necesitas saber si tu marca ya está registrada por otra persona o si está disponible para registro? Aquí puedes verificarlo.",
        visible_en_landing: true,
        landing_data: {
          titulo: "Búsqueda de Antecedentes",
          resumen:
            "Verifica la disponibilidad de tu marca antes de iniciar el registro.",
        },
        info_page_data: {
          descripcion:
            "Nuestro servicio de búsqueda de antecedentes incluye una revisión exhaustiva de bases de datos nacionales e internacionales para verificar la disponibilidad de marcas y evitar conflictos legales futuros.",
        },
        route_path: "/pages/busqueda",
        process_states: [
          {
            id: "1",
            name: "Solicitud Recibida",
            order: 1,
            status_key: "recibida",
          },
          {
            id: "2",
            name: "Búsqueda en Proceso",
            order: 2,
            status_key: "en_proceso",
          },
          {
            id: "3",
            name: "Informe Generado",
            order: 3,
            status_key: "informe",
          },
        ],
      },
      {
        id: "2",
        nombre: "Certificación de Marca",
        descripcion_corta:
          "¿Necesitas certificar tu marca para adquirirla de uso antes de que otro lo haga?",
        visible_en_landing: true,
        landing_data: {
          titulo: "Certificación de Marca",
          resumen:
            "Acompañamiento completo en el proceso de certificación de tu marca.",
        },
        info_page_data: {
          descripcion:
            "Te acompañamos en todo el proceso de certificación de marca, desde la presentación de la solicitud hasta la obtención del certificado oficial, garantizando el cumplimiento de todos los requisitos legales.",
        },
        route_path: "/pages/certificacion",
        process_states: [
          {
            id: "1",
            name: "En estudio de forma",
            order: 1,
            status_key: "estudio_forma",
          },
          { id: "2", name: "Publicado", order: 2, status_key: "publicado" },
          { id: "3", name: "Oposición", order: 3, status_key: "oposicion" },
          {
            id: "4",
            name: "En estudio de fondo",
            order: 4,
            status_key: "estudio_fondo",
          },
          { id: "5", name: "Registrado", order: 5, status_key: "registrado" },
          {
            id: "6",
            name: "Rechazado primera instancia",
            order: 6,
            status_key: "rechazado_1",
          },
          { id: "7", name: "Apelación", order: 7, status_key: "apelacion" },
          { id: "8", name: "Aprobado", order: 8, status_key: "aprobado" },
          { id: "9", name: "Rechazado", order: 9, status_key: "rechazado" },
        ],
      },
      {
        id: "3",
        nombre: "Renovación de Marca",
        descripcion_corta:
          "¿Tu certificación está por caducar y necesitas una renovación antes de que otra persona se adueñe de ella?",
        visible_en_landing: true,
        landing_data: {
          titulo: "Renovación de Marca",
          resumen: "Renueva tu marca y mantén tu protección legal vigente.",
        },
        info_page_data: {
          descripcion:
            "Mantenemos tu marca protegida gestionando las renovaciones oportunas de los registros, asegurando que nunca pierdas la protección legal de tu propiedad intelectual.",
        },
        route_path: "/pages/renovacion",
        process_states: [
          {
            id: "1",
            name: "Solicitud Recibida",
            order: 1,
            status_key: "recibida",
          },
          {
            id: "2",
            name: "Renovación en Proceso",
            order: 2,
            status_key: "en_proceso",
          },
          { id: "3", name: "Renovada", order: 3, status_key: "renovada" },
        ],
      },
      {
        id: "4",
        nombre: "Oposición",
        descripcion_corta:
          "¿Necesitas presentar una demanda de oposición porque crees que alguien está solicitando un nombre parecido, gramático o igual a tu marca?",
        visible_en_landing: true,
        landing_data: {
          titulo: "Oposición",
          resumen: "Defiende tus derechos de marca presentando una oposición.",
        },
        info_page_data: {
          descripcion:
            "Protegemos tus derechos de marca presentando oposiciones estratégicas contra solicitudes de registro que puedan generar confusión o afectar tu propiedad intelectual.",
        },
        route_path: "/pages/presentacionOposicion",
        process_states: [
          {
            id: "1",
            name: "Solicitud Recibida",
            order: 1,
            status_key: "recibida",
          },
          {
            id: "2",
            name: "Oposición en Proceso",
            order: 2,
            status_key: "en_proceso",
          },
          { id: "3", name: "Resuelta", order: 3, status_key: "resuelta" },
        ],
      },
      {
        id: "5",
        nombre: "Cesión de Marca",
        descripcion_corta:
          "¿Necesitas cambiar el titular de la marca que está registrada a tu nombre o colocar una marca que no va tuya a tu nombre?",
        visible_en_landing: true,
        landing_data: {
          titulo: "Cesión de Marca",
          resumen:
            "Gestiona la transferencia de derechos de tu marca de forma segura.",
        },
        info_page_data: {
          descripcion:
            "Facilitamos la transferencia de derechos de marca, asesorando en todos los aspectos legales y administrativos del proceso de cesión para garantizar una transacción segura y legal.",
        },
        route_path: "/pages/cesionMarca",
        process_states: [
          {
            id: "1",
            name: "Solicitud Recibida",
            order: 1,
            status_key: "recibida",
          },
          {
            id: "2",
            name: "Cesión en Proceso",
            order: 2,
            status_key: "en_proceso",
          },
          { id: "3", name: "Cedido", order: 3, status_key: "cedido" },
        ],
      },
      {
        id: "6",
        nombre: "Ampliación de Alcance",
        descripcion_corta:
          "¿Tienes una marca que presta uno o varios servicios y productos y quieres agregarle otro servicio?",
        visible_en_landing: true,
        landing_data: {
          titulo: "Ampliación de Alcance",
          resumen:
            "Extiende la protección de tu marca a nuevas clases o categorías.",
        },
        info_page_data: {
          descripcion:
            "Ampliamos la protección de tu marca a nuevas clases o categorías de productos y servicios, adaptando la estrategia de protección a la evolución de tu negocio.",
        },
        route_path: "/pages/ampliacion",
        process_states: [
          {
            id: "1",
            name: "Solicitud Recibida",
            order: 1,
            status_key: "recibida",
          },
          {
            id: "2",
            name: "Ampliación en Proceso",
            order: 2,
            status_key: "en_proceso",
          },
          { id: "3", name: "Ampliado", order: 3, status_key: "ampliado" },
        ],
      },
    ];
    setToStorage(STORAGE_KEY, serviciosIniciales);
  }
}

initStorage();

// CRUD y métodos de gestión modular
export function getServicios() {
  return getFromStorage(STORAGE_KEY);
}

export function getServicioById(id) {
  return getFromStorage(STORAGE_KEY).find((s) => s.id === id);
}

export function updateServicio(id, data) {
  const servicios = getFromStorage(STORAGE_KEY);
  const idx = servicios.findIndex((s) => s.id === id);
  if (idx !== -1) {
    servicios[idx] = { ...servicios[idx], ...data };
    setToStorage(STORAGE_KEY, servicios);
    return true;
  }
  return false;
}

export function toggleVisibilidadServicio(id) {
  const servicios = getFromStorage(STORAGE_KEY);
  const idx = servicios.findIndex((s) => s.id === id);
  if (idx !== -1) {
    servicios[idx].visible_en_landing = !servicios[idx].visible_en_landing;
    setToStorage(STORAGE_KEY, servicios);
    return true;
  }
  return false;
}

export function updateLandingData(id, landing_data) {
  return updateServicio(id, { landing_data });
}

export function updateInfoPageData(id, info_page_data) {
  return updateServicio(id, { info_page_data });
}

export function updateProcessStates(id, process_states) {
  return updateServicio(id, { process_states });
}

// Métodos para process_states
export function addProcessState(id, newState) {
  const servicios = getFromStorage(STORAGE_KEY);
  const idx = servicios.findIndex((s) => s.id === id);
  if (idx !== -1) {
    servicios[idx].process_states.push(newState);
    setToStorage(STORAGE_KEY, servicios);
    return true;
  }
  return false;
}

export function removeProcessState(id, stateId) {
  const servicios = getFromStorage(STORAGE_KEY);
  const idx = servicios.findIndex((s) => s.id === id);
  if (idx !== -1) {
    servicios[idx].process_states = servicios[idx].process_states.filter(
      (s) => s.id !== stateId
    );
    setToStorage(STORAGE_KEY, servicios);
    return true;
  }
  return false;
}

export function reorderProcessStates(id, newOrder) {
  return updateServicio(id, { process_states: newOrder });
}
