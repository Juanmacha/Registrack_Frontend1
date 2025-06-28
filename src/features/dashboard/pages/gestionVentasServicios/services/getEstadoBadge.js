const colorMap = {
  completado: "#28A745",
  pagado: "#28A745",
  exitoso: "#28A745",
  pendiente: "#FFA726",
  proceso: "#FFA726",
  fallido: "#DC3545",
  rechazado: "#DC3545",
  cancelado: "#DC3545",
  expirado: "#6C757D",
};

const textoMap = {
  completado: "Completado",
  pagado: "Pagado",
  exitoso: "Completado",
  pendiente: "Pendiente",
  proceso: "En Proceso",
  fallido: "Fallido",
  rechazado: "Rechazado",
  cancelado: "Cancelado",
  expirado: "Expirado",
};

const getEstadoPagoBadge = (estado) => {
  const estadoNormalizado = estado?.toLowerCase().replace(/\s/g, "") || "";
  const key = Object.keys(colorMap).find((k) =>
    estadoNormalizado.includes(k)
  );

  return {
    color: colorMap[key] || "#6C757D",
    texto: textoMap[key] || estado || "Sin estado",
  };
};

export default getEstadoPagoBadge;
