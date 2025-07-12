// Servicio de ventas usando la data mock centralizada
// ✅ REFACTORIZADO: Ahora usa SaleService del mockDataService

import { SaleService, initializeMockData } from '../../../../../utils/mockDataService.js';

// Inicializar datos mock centralizados
initializeMockData();

// Función para inicializar datos de prueba (solo si no hay datos)
export function initDatosPrueba() {
  const ventas = SaleService.getInProcess();
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
        email: "juan.perez@example.com",
        telefono: "3001234567"
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
        email: "empresa.xyz@example.com",
        telefono: "3009876543"
      },
    ];
    
    // Usar SaleService para crear las ventas
    datosPrueba.forEach(venta => {
      SaleService.create(venta);
    });
  }
}

// Crear nueva venta
export function crearVenta(nuevaVenta) {
  // Mapear los campos del formulario a los campos que espera la tabla
  const ventaMapeada = {
    ...nuevaVenta,
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

  return SaleService.create(ventaMapeada);
}

// Editar venta
export function actualizarVenta(id, datosActualizados) {
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

  const datosMapeados = mapearDatosActualizados(datosActualizados);
  return SaleService.update(id, datosMapeados);
}

// Anular venta
export function anularVenta(id, motivo) {
  return SaleService.cancel(id, motivo);
}

// Agregar comentario
export function agregarComentario(id, texto, especial = false) {
  return SaleService.addComment(id, texto);
}

// Obtener comentarios
export function getComentarios(id) {
  const venta = SaleService.getById(id);
  return venta?.comentarios || [];
}
