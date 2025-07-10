// Servicio de ventas usando localStorage

const STORAGE_KEY = "ventasServicios";
const STORAGE_KEY_FIN = "ventasServiciosFin";

// Utilidad para obtener datos de localStorage
export function getFromStorage(key) {
  const data = localStorage.getItem(key);
  return data ? JSON.parse(data) : [];
}

// Utilidad para guardar datos en localStorage
function setToStorage(key, data) {
  localStorage.setItem(key, JSON.stringify(data));
}

// Inicializar si no existe
function initStorage() {
  if (!localStorage.getItem(STORAGE_KEY)) setToStorage(STORAGE_KEY, []);
  if (!localStorage.getItem(STORAGE_KEY_FIN)) setToStorage(STORAGE_KEY_FIN, []);
}

initStorage();

// Función para inicializar datos de prueba (solo si no hay datos)
export function initDatosPrueba() {
  const ventas = getFromStorage(STORAGE_KEY);
  if (ventas.length === 0) {
    const datosPrueba = [
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
      },
      {
        id: "2",
        titular: "Empresa XYZ",
        tipoPersona: "Jurídica",
        expediente: "EXP-00124",
        tipoSolicitud: "Certificación de Marca",
        marca: "Zentra",
        encargado: "Dr. Morales",
        proximaCita: "2025-06-22",
        estado: "Pendiente",
        comentarios: [],
      },
    ];
    setToStorage(STORAGE_KEY, datosPrueba);
  }
}

// Listar ventas en proceso
export function getVentasEnProceso(pagina = 1, porPagina = 5, busqueda = "") {
  let datos = getFromStorage(STORAGE_KEY);
  if (busqueda) {
    datos = datos.filter(
      (item) =>
        item.titular.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.tipoSolicitud.toLowerCase().includes(busqueda.toLowerCase())
    );
  }
  const total = datos.length;
  const totalPaginas = Math.ceil(total / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  return {
    datos: datos.slice(inicio, fin),
    total,
    totalPaginas,
  };
}

// Listar ventas finalizadas
export function getVentasFinalizadas(pagina = 1, porPagina = 5, busqueda = "") {
  let datos = getFromStorage(STORAGE_KEY_FIN);
  if (busqueda) {
    datos = datos.filter(
      (item) =>
        item.titular.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.tipoSolicitud.toLowerCase().includes(busqueda.toLowerCase())
    );
  }
  const total = datos.length;
  const totalPaginas = Math.ceil(total / porPagina);
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;
  return {
    datos: datos.slice(inicio, fin),
    total,
    totalPaginas,
  };
}

// Crear nueva venta
export function crearVenta(nuevaVenta) {
  const ventas = getFromStorage(STORAGE_KEY);
  const id = Date.now().toString();

  // Mapear los campos del formulario a los campos que espera la tabla
  const ventaMapeada = {
    ...nuevaVenta,
    id,
    comentarios: [],
    // Mapear titular
    titular:
      nuevaVenta.tipoSolicitante === "Titular"
        ? nuevaVenta.tipoPersona === "Natural"
          ? nuevaVenta.nombreCompleto
          : nuevaVenta.nombreEmpresa
        : nuevaVenta.nombreCompleto,
    // Mapear marca
    marca: nuevaVenta.nombreMarca,
    // Mapear tipo de solicitud
    tipoSolicitud: nuevaVenta.tipoSolicitud,
    // Mapear encargado (por defecto)
    encargado: nuevaVenta.encargado || "Sin asignar",
    // Mapear próxima cita (por defecto)
    proximaCita: nuevaVenta.proximaCita || null,
    // Mapear tipo de persona
    tipoPersona: nuevaVenta.tipoPersona || nuevaVenta.tipoSolicitante,
  };

  ventas.push(ventaMapeada);
  setToStorage(STORAGE_KEY, ventas);
  return true;
}

// Editar venta
export function actualizarVenta(id, datosActualizados) {
  let ventas = getFromStorage(STORAGE_KEY);
  let ventasFin = getFromStorage(STORAGE_KEY_FIN);
  let ventaIndex = ventas.findIndex((v) => v.id === id);
  let ventaFinIndex = ventasFin.findIndex((v) => v.id === id);
  let venta;

  // Función para mapear datos actualizados
  const mapearDatosActualizados = (datos) => {
    const mapeados = { ...datos };

    // Mapear titular si se actualizaron campos relacionados
    if (
      datos.tipoSolicitante ||
      datos.tipoPersona ||
      datos.nombreCompleto ||
      datos.nombreEmpresa
    ) {
      mapeados.titular =
        datos.tipoSolicitante === "Titular"
          ? datos.tipoPersona === "Natural"
            ? datos.nombreCompleto
            : datos.nombreEmpresa
          : datos.nombreCompleto;
    }

    // Mapear marca si se actualizó nombreMarca
    if (datos.nombreMarca) {
      mapeados.marca = datos.nombreMarca;
    }

    // Mapear tipo de persona
    if (datos.tipoPersona || datos.tipoSolicitante) {
      mapeados.tipoPersona = datos.tipoPersona || datos.tipoSolicitante;
    }

    // Guardar fecha de finalización si el estado es finalizado/anulado/rechazado
    if (["Finalizado", "Anulado", "Rechazado"].includes(datos.estado)) {
      mapeados.fechaFin = new Date().toISOString();
    }

    return mapeados;
  };

  // Si está en proceso
  if (ventaIndex !== -1) {
    venta = ventas[ventaIndex];
    const datosMapeados = mapearDatosActualizados(datosActualizados);

    // Si cambia a finalizado/anulado/rechazado, mover a finalizadas
    if (
      datosMapeados.estado === "Finalizado" ||
      datosMapeados.estado === "Anulado" ||
      datosMapeados.estado === "Rechazado"
    ) {
      ventas.splice(ventaIndex, 1);
      ventasFin.push({ ...venta, ...datosMapeados });
    } else {
      ventas[ventaIndex] = { ...venta, ...datosMapeados };
    }
    setToStorage(STORAGE_KEY, ventas);
    setToStorage(STORAGE_KEY_FIN, ventasFin);
    return true;
  }
  // Si está en finalizadas
  if (ventaFinIndex !== -1) {
    venta = ventasFin[ventaFinIndex];
    const datosMapeados = mapearDatosActualizados(datosActualizados);

    // Si vuelve a proceso
    if (!["Finalizado", "Anulado"].includes(datosMapeados.estado)) {
      ventasFin.splice(ventaFinIndex, 1);
      ventas.push({ ...venta, ...datosMapeados });
    } else {
      ventasFin[ventaFinIndex] = { ...venta, ...datosMapeados };
    }
    setToStorage(STORAGE_KEY, ventas);
    setToStorage(STORAGE_KEY_FIN, ventasFin);
    return true;
  }
  return false;
}

// Eliminar venta (anular) con motivo
export function anularVenta(id, motivo) {
  return actualizarVenta(id, { estado: "Anulado", motivoAnulacion: motivo });
}

// Añadir comentario
export function agregarComentario(id, texto, especial = false) {
  let ventas = getFromStorage(STORAGE_KEY);
  let ventasFin = getFromStorage(STORAGE_KEY_FIN);
  const fecha = new Date().toLocaleString();
  let venta = ventas.find((v) => v.id === id);
  if (venta) {
    venta.comentarios = venta.comentarios || [];
    venta.comentarios.push({ texto, fecha, especial });
    setToStorage(STORAGE_KEY, ventas);
    return true;
  }
  venta = ventasFin.find((v) => v.id === id);
  if (venta) {
    venta.comentarios = venta.comentarios || [];
    venta.comentarios.push({ texto, fecha, especial });
    setToStorage(STORAGE_KEY_FIN, ventasFin);
    return true;
  }
  return false;
}

// Obtener comentarios de una venta
export function getComentarios(id) {
  let ventas = getFromStorage(STORAGE_KEY);
  let ventasFin = getFromStorage(STORAGE_KEY_FIN);
  let venta =
    ventas.find((v) => v.id === id) || ventasFin.find((v) => v.id === id);
  return venta && venta.comentarios ? venta.comentarios : [];
}
