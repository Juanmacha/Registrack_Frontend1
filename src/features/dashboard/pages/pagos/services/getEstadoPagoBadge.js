const getEstadoPagoBadge = (estado) => {
  if (estado === true) {
    return {
      color: "#16a34a", // verde
      texto: "Completado",
    };
  }

  if (estado === false) {
    return {
      color: "#dc2626", // rojo
      texto: "Fallido",
    };
  }

  return {
    color: "#6b7280", // gris
    texto: "Desconocido",
  };
};

export default getEstadoPagoBadge;
