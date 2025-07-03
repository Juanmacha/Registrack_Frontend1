const pagos = [
  {
    "id_pago": 1,
    "monto": 150000.00,
    "fecha_pago": "2025-06-15T10:30:00",
    "metodo_pago": "Transferencia",
    "estado": true,
    "comprobante_url": "https://example.com/comprobantes/1.pdf",
    "id_orden_servicio": 101
  },
  {
    "id_pago": 2,
    "monto": 85000.00,
    "fecha_pago": "2025-06-17T14:45:00",
    "metodo_pago": "Efectivo",
    "estado": false,
    "comprobante_url": "https://example.com/comprobantes/2.pdf",
    "id_orden_servicio": 102
  },
  {
    "id_pago": 3,
    "monto": 200000.00,
    "fecha_pago": "2025-06-20T09:15:00",
    "metodo_pago": "Tarjeta",
    "estado": true,
    "comprobante_url": null,
    "id_orden_servicio": 103
  },
  {
    "id_pago": 4,
    "monto": 135000.00,
    "fecha_pago": "2025-06-22T11:00:00",
    "metodo_pago": "Transferencia",
    "estado": true,
    "comprobante_url": "https://example.com/comprobantes/4.pdf",
    "id_orden_servicio": 104
  },
  {
    "id_pago": 5,
    "monto": 50000.00,
    "fecha_pago": "2025-06-25T16:20:00",
    "metodo_pago": "PSE",
    "estado": true,
    "comprobante_url": "https://example.com/comprobantes/5.pdf",
    "id_orden_servicio": 105
  },
  {
    "id_pago": 6,
    "monto": 120000.00,
    "fecha_pago": "2025-06-27T13:10:00",
    "metodo_pago": "Daviplata",
    "estado": false,
    "comprobante_url": null,
    "id_orden_servicio": 106
  }
];

export default pagos;
