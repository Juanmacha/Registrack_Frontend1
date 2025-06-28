// src/services/logicaVentasServicios.js

const obtenerSolicitudes = () => {
  return [
    {
      id: 1,
      titular: "Juan Pérez",
      tipoTitular: "Natural",
      expediente: "EXP-00123",
      solicitudTipo: "Registro",
      marca: "TechNova",
      encargado: "Dra. Gómez",
      cita: "Sin citas",
      estado: "Active",
    },
    {
      id: 2,
      titular: "Empresa XYZ",
      tipoTitular: "Jurídica",
      expediente: "EXP-00124",
      solicitudTipo: "Renovación",
      marca: "Zentra",
      encargado: "Dr. Morales",
      cita: "2025-06-22",
      estado: "Pending",
    },
    {
      id: 3,
      titular: "Empresa Nike",
      tipoTitular: "Jurídica",
      expediente: "EXP-001210",
      solicitudTipo: "Renovación",
      marca: "Nike",
      encargado: "Morales",
      cita: "2025-07-22",
      estado: "Pending",
    },
  ];
};

const eliminarSolicitud = (id, lista) => {
  return lista.filter((item) => item.id !== id);
};

const editarSolicitud = (id, nuevosDatos, lista) => {
  return lista.map((item) =>
    item.id === id ? { ...item, ...nuevosDatos } : item
  );
};

export { obtenerSolicitudes, eliminarSolicitud, editarSolicitud };