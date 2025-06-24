const getEstadoBadge = (estado) => {
  const estadoLower = estado.toLowerCase();

  if (estadoLower.includes("revisión") || estadoLower.includes("activo")) {
    return {
      label: "Active",
      colorClass: "bg-green-100 text-green-700",
    };
  }

  if (estadoLower.includes("pendiente")) {
    return {
      label: "Pending",
      colorClass: "bg-yellow-100 text-yellow-800",
    };
  }

  return {
    label: "Cancel",
    colorClass: "bg-red-100 text-red-700",
  };
};

export default getEstadoBadge;
