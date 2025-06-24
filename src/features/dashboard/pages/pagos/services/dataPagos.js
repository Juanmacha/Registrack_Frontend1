const pagos = [
  {
    id: "PAG-0001",
    clienteId: "CLI-001",
    servicioId: "SERV-001",
    monto: 250000,
    fecha: "2025-06-20T14:35:00Z",
    metodoPago: "Tarjeta de crédito",
    estado: "Completado",
    comprobante: "https://example.com/comprobantes/pag-0001.pdf",
    descripcion: "Pago por registro de marca nacional",
    creadoPor: "Juan Pérez"
  },
  {
    id: "PAG-0002",
    clienteId: "CLI-002",
    servicioId: "SERV-003",
    monto: 180000,
    fecha: "2025-06-18T09:12:00Z",
    metodoPago: "Transferencia bancaria",
    estado: "Pendiente",
    comprobante: null,
    descripcion: "Pago por cesión de marca",
    creadoPor: "Sistema"
  },
  {
    id: "PAG-0003",
    clienteId: "CLI-003",
    servicioId: "SERV-002",
    monto: 320000,
    fecha: "2025-06-15T18:47:00Z",
    metodoPago: "PSE",
    estado: "Fallido",
    comprobante: null,
    descripcion: "Pago por renovación de marca",
    creadoPor: "Sandra Gómez"
  },
  {
    id: "PAG-0004",
    clienteId: "CLI-004",
    servicioId: "SERV-005",
    monto: 150000,
    fecha: "2025-06-10T11:20:00Z",
    metodoPago: "PayPal",
    estado: "Completado",
    comprobante: "https://example.com/comprobantes/pag-0004.pdf",
    descripcion: "Pago por ampliación de servicio internacional",
    creadoPor: "Administrador"
  },
  {
    id: "PAG-0005",
    clienteId: "CLI-005",
    servicioId: "SERV-004",
    monto: 195000,
    fecha: "2025-06-05T16:00:00Z",
    metodoPago: "Efectivo",
    estado: "Completado",
    comprobante: null,
    descripcion: "Pago presencial por búsqueda de antecedentes",
    creadoPor: "Recepción"
  }
];

export default pagos;
