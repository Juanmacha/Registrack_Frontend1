// Estado global compartido
let ventasEnProceso = [
  // Datos existentes
  {
    id: "10",
    expediente: "EXP-00130",
    fechaSolicitud: "2025-06-16",
    tipoSolicitud: "Registro",
    tipoPersona: "Natural",
    titular: "Ana Martínez",
    marca: "SkyTech",
    encargado: "Dr. Ramírez",
    proximaCita: "2025-07-05",
    estado: "En revisión",
  },
  {
    id: "11",
    expediente: "EXP-00131",
    fechaSolicitud: "2025-06-17",
    tipoSolicitud: "Renovación",
    tipoPersona: "Jurídica",
    titular: "Corporación Delta",
    marca: "EcoGreen",
    encargado: "Dra. Gómez",
    proximaCita: "2025-07-08",
    estado: "Pendiente firma",
  },
  {
    id: "12",
    expediente: "EXP-00132",
    fechaSolicitud: "2025-06-18",
    tipoSolicitud: "Oposición",
    tipoPersona: "Natural",
    titular: "Luis Rodríguez",
    marca: "FastTrack",
    encargado: "Dr. Morales",
    proximaCita: "2025-07-10",
    estado: "Pendiente documentación",
  },
  {
    id: "13",
    expediente: "EXP-00133",
    fechaSolicitud: "2025-06-19",
    tipoSolicitud: "Registro",
    tipoPersona: "Jurídica",
    titular: "Innovaciones SA",
    marca: "SmartLife",
    encargado: "Dra. Sánchez",
    proximaCita: "2025-07-12",
    estado: "En revisión",
  },
  {
    id: "1",
    expediente: "EXP-00123",
    fechaSolicitud: "2025-06-10",
    tipoSolicitud: "Registro",
    tipoPersona: "Natural",
    titular: "Juan Pérez",
    marca: "TechNova",
    encargado: "Dra. Gómez",
    proximaCita: "",
    estado: "En revisión",
  },
  {
    id: "2",
    expediente: "EXP-00124",
    fechaSolicitud: "2025-06-11",
    tipoSolicitud: "Renovación",
    tipoPersona: "Jurídica",
    titular: "Empresa XYZ",
    marca: "Zentra",
    encargado: "Dr. Morales",
    proximaCita: "2025-06-22",
    estado: "Pendiente firma",
  },
  {
    id: "3",
    expediente: "EXP-00125",
    fechaSolicitud: "2025-06-12",
    tipoSolicitud: "Registro",
    tipoPersona: "Natural",
    titular: "María González",
    marca: "EcoStyle",
    encargado: "Dr. Ramírez",
    proximaCita: "2025-06-25",
    estado: "Pendiente documentación",
  },
  {
    id: "4",
    expediente: "EXP-00126",
    fechaSolicitud: "2025-06-13",
    tipoSolicitud: "Oposición",
    tipoPersona: "Jurídica",
    titular: "Corporación ABC",
    marca: "PowerTech",
    encargado: "Dra. Sánchez",
    proximaCita: "2025-06-28",
    estado: "En revisión",
  },
  {
    id: "5",
    expediente: "EXP-00127",
    fechaSolicitud: "2025-06-14",
    tipoSolicitud: "Renovación",
    tipoPersona: "Natural",
    titular: "Carlos Mendoza",
    marca: "BlueSky",
    encargado: "Dr. Morales",
    proximaCita: "2025-06-30",
    estado: "Pendiente firma",
  },
  {
    id: "6",
    expediente: "EXP-00128",
    fechaSolicitud: "2025-06-15",
    tipoSolicitud: "Registro",
    tipoPersona: "Jurídica",
    titular: "Industrias XYZ",
    marca: "GreenLife",
    encargado: "Dra. Gómez",
    proximaCita: "2025-07-02",
    estado: "En revisión",
  }
];

let ventasFinalizadas = [
  {
    id: "14",
    expediente: "EXP-00134",
    fechaSolicitud: "2025-05-10",
    tipoSolicitud: "Registro",
    tipoPersona: "Natural",
    titular: "Pedro Sánchez",
    marca: "TechPro",
    encargado: "Dr. Ramírez",
    proximaCita: "",
    estado: "Finalizado",
  },
  {
    id: "15",
    expediente: "EXP-00135",
    fechaSolicitud: "2025-05-12",
    tipoSolicitud: "Oposición",
    tipoPersona: "Jurídica",
    titular: "Grupo Tecnológico",
    marca: "SmartTech",
    encargado: "Dra. Gómez",
    proximaCita: "",
    estado: "Anulado",
  },
  {
    id: "16",
    expediente: "EXP-00136",
    fechaSolicitud: "2025-05-14",
    tipoSolicitud: "Renovación",
    tipoPersona: "Natural",
    titular: "Carmen López",
    marca: "EcoWorld",
    encargado: "Dr. Morales",
    proximaCita: "",
    estado: "Finalizado",
  },
  {
    id: "7",
    expediente: "EXP-00120",
    fechaSolicitud: "2025-05-15",
    tipoSolicitud: "Registro",
    tipoPersona: "Jurídica",
    titular: "Grupo Innovación",
    marca: "FutureTech",
    encargado: "Dra. Sánchez",
    proximaCita: "",
    estado: "Finalizado",
  },
  {
    id: "8",
    expediente: "EXP-00121",
    fechaSolicitud: "2025-05-20",
    tipoSolicitud: "Oposición",
    tipoPersona: "Natural",
    titular: "Roberto Jiménez",
    marca: "SportMax",
    encargado: "Dr. Ramírez",
    proximaCita: "",
    estado: "Anulado",
  },
  {
    id: "9",
    expediente: "EXP-00122",
    fechaSolicitud: "2025-05-25",
    tipoSolicitud: "Renovación",
    tipoPersona: "Jurídica",
    titular: "Corporación Delta",
    marca: "EcoFresh",
    encargado: "Dra. Gómez",
    proximaCita: "",
    estado: "Finalizado",
  }
];

// Función para filtrar y paginar datos
const filtrarYPaginar = (datos, busqueda = '', pagina = 1, porPagina = 5) => {
  // Primero filtramos los datos
  const datosFiltrados = busqueda
    ? datos.filter(item =>
        item.titular.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.marca.toLowerCase().includes(busqueda.toLowerCase()) ||
        item.tipoSolicitud.toLowerCase().includes(busqueda.toLowerCase())
      )
    : datos;

  // Luego paginamos los datos filtrados
  const inicio = (pagina - 1) * porPagina;
  const fin = inicio + porPagina;

  return {
    datos: datosFiltrados.slice(inicio, fin),
    total: datosFiltrados.length,
    totalPaginas: Math.ceil(datosFiltrados.length / porPagina)
  };
};

// Obtener ventas en proceso paginadas y filtradas
export const getVentasEnProceso = (pagina = 1, porPagina = 5, busqueda = '') => {
  return filtrarYPaginar(ventasEnProceso, busqueda, pagina, porPagina);
};

// Obtener ventas finalizadas paginadas y filtradas
export const getVentasFinalizadas = (pagina = 1, porPagina = 5, busqueda = '') => {
  return filtrarYPaginar(ventasFinalizadas, busqueda, pagina, porPagina);
};

// Actualizar una venta
export const actualizarVenta = (id, datosActualizados) => {
  // Buscar primero en ventas en proceso
  let ventaIndex = ventasEnProceso.findIndex(venta => venta.id === id);
  let venta;

  if (ventaIndex !== -1) {
    // Si la venta está en proceso
    venta = ventasEnProceso[ventaIndex];
    
    // Si el estado cambia a 'Finalizado' o 'Anulado', mover a ventasFinalizadas
    if (datosActualizados.estado === 'Finalizado' || datosActualizados.estado === 'Anulado') {
      ventasEnProceso.splice(ventaIndex, 1);
      ventasFinalizadas.push({ ...venta, ...datosActualizados });
    } else {
      // Actualizar en ventasEnProceso
      ventasEnProceso[ventaIndex] = { ...venta, ...datosActualizados };
    }
  } else {
    // Buscar en ventas finalizadas
    ventaIndex = ventasFinalizadas.findIndex(venta => venta.id === id);
    if (ventaIndex !== -1) {
      venta = ventasFinalizadas[ventaIndex];
      
      // Si el estado cambia a activo o en proceso, mover a ventasEnProceso
      if (!['Finalizado', 'Anulado'].includes(datosActualizados.estado)) {
        ventasFinalizadas.splice(ventaIndex, 1);
        ventasEnProceso.push({ ...venta, ...datosActualizados });
      } else {
        // Actualizar en ventasFinalizadas
        ventasFinalizadas[ventaIndex] = { ...venta, ...datosActualizados };
      }
    }
  }

  return true;
};