import React from "react";

const tiposServicio = [
  "Todos",
  "Certificación",
  "Renovación",
  "Proceso de Oposición",
  "Búsqueda de Antecedentes",
  "Ampliación de Alcance",
  "Cesión de Marca"
];

const estados = ["Todos", "Aprobado", "En Proceso", "Rechazado"];

const FiltrosIngresos = ({ tipo, setTipo, estado, setEstado }) => (
  <div className="flex flex-wrap gap-4 items-center mb-4">
    <div>
      <label className="block text-xs text-gray-500 mb-1">Tipo de Servicio</label>
      <select
        className="border border-gray-300 rounded px-2 py-1"
        value={tipo}
        onChange={e => setTipo(e.target.value)}
      >
        {tiposServicio.map(t => (
          <option key={t} value={t}>{t}</option>
        ))}
      </select>
    </div>
    <div>
      <label className="block text-xs text-gray-500 mb-1">Estado</label>
      <select
        className="border border-gray-300 rounded px-2 py-1"
        value={estado}
        onChange={e => setEstado(e.target.value)}
      >
        {estados.map(e => (
          <option key={e} value={e}>{e}</option>
        ))}
      </select>
    </div>
  </div>
);

export default FiltrosIngresos; 