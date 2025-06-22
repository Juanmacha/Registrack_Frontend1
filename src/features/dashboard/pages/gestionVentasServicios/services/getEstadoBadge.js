// src/utils/getEstadoBadge.js

const getEstadoBadge = (estado) => {
  const estadoLower = estado.toLowerCase();
  if (estadoLower.includes("revisión") || estadoLower.includes("activo")) {
    return (
      <span className="px-3 py-1 text-green-700 bg-green-100 rounded-full text-xs font-semibold">
        Active
      </span>
    );
  }
  if (estadoLower.includes("pendiente")) {
    return (
      <span className="px-3 py-1 text-yellow-800 bg-yellow-100 rounded-full text-xs font-semibold">
        Pending
      </span>
    );
  }
  return (
    <span className="px-3 py-1 text-red-700 bg-red-100 rounded-full text-xs font-semibold">
      Cancel
    </span>
  );
};

export default getEstadoBadge;
