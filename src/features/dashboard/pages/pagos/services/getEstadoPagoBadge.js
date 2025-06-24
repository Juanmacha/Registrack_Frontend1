const getEstadoPagoBadge = (estado) => {
  const estadoLower = estado.toLowerCase();

  if (estadoLower === "completado") {
    return {
      colorClass: "text-green-700 bg-green-100",
      label: "Completado",
    };
  }

  if (estadoLower === "pendiente") {
    return {
      colorClass: "text-yellow-800 bg-yellow-100",
      label: "Pendiente",
    };
  }

  if (estadoLower === "fallido") {
    return {
      colorClass: "text-red-700 bg-red-100",
      label: "Fallido",
    };
  }

  return {
    colorClass: "text-gray-700 bg-gray-100",
    label: "Desconocido",
  };
};

export default getEstadoPagoBadge;
