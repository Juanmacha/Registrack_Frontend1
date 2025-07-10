import React, { useState } from "react";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const tiposServicio = [
  "Certificaciones",
  "Renovación",
  "Oposición",
  "Antecedentes",
  "Cesión de Marca",
  "Ampliación de Alcance",
];

const datosSimulados = {
  dia: [
    { aprobado: 2, proceso: 2, rechazado: 1 },
    { aprobado: 1, proceso: 1, rechazado: 1 },
    { aprobado: 1, proceso: 0, rechazado: 1 },
    { aprobado: 2, proceso: 1, rechazado: 1 },
    { aprobado: 3, proceso: 2, rechazado: 1 },
    { aprobado: 0, proceso: 1, rechazado: 0 },
  ],
  semana: [
    { aprobado: 10, proceso: 7, rechazado: 3 },
    { aprobado: 7, proceso: 5, rechazado: 3 },
    { aprobado: 5, proceso: 2, rechazado: 3 },
    { aprobado: 8, proceso: 6, rechazado: 4 },
    { aprobado: 12, proceso: 7, rechazado: 3 },
    { aprobado: 2, proceso: 5, rechazado: 1 },
  ],
  mes: [
    { aprobado: 22, proceso: 15, rechazado: 8 },
    { aprobado: 15, proceso: 10, rechazado: 5 },
    { aprobado: 10, proceso: 4, rechazado: 4 },
    { aprobado: 18, proceso: 12, rechazado: 5 },
    { aprobado: 20, proceso: 15, rechazado: 5 },
    { aprobado: 5, proceso: 6, rechazado: 1 },
  ],
};

const periodos = [
  { label: "Último día", value: "dia" },
  { label: "Última semana", value: "semana" },
  { label: "Último mes", value: "mes" },
];

const badgeClass = {
  aprobado: "bg-blue-100 text-blue-700",
  proceso: "bg-orange-100 text-orange-700",
  rechazado: "bg-green-100 text-green-700",
};

const labelMap = {
  aprobado: "Aprobado",
  proceso: "En Proceso",
  rechazado: "Rechazado",
};

const GraficaResumenServicios = () => {
  const [periodo, setPeriodo] = useState("semana");
  const datos = datosSimulados[periodo];

  const handleDescargarExcel = () => {
    const dataExcel = tiposServicio.map((tipo, idx) => ({
      Servicio: tipo,
      Aprobado: datos[idx].aprobado,
      "En Proceso": datos[idx].proceso,
      Rechazado: datos[idx].rechazado,
    }));
    const hoja = XLSX.utils.json_to_sheet(dataExcel);
    const libro = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(libro, hoja, "ResumenServicios");
    const excelBuffer = XLSX.write(libro, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, `resumen_servicios_${periodo}.xlsx`);
  };

  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 mb-4 p-2">
      {/* Filtros de periodo y botón de descarga */}
      <div className="flex flex-wrap items-center justify-between mb-2 gap-2">
        <div className="font-bold text-lg text-blue-800">Resumen de Servicios</div>
        <div className="flex gap-2 items-center">
          {periodos.map((p) => (
            <button
              key={p.value}
              onClick={() => setPeriodo(p.value)}
              className={`px-2 py-1 rounded-lg border text-xs font-medium transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 ${
                periodo === p.value
                  ? "bg-blue-100 text-blue-700 border-blue-400"
                  : "bg-gray-50 text-gray-700 border-gray-200 hover:bg-blue-50"
              }`}
            >
              {p.label}
            </button>
          ))}
          <button
            onClick={handleDescargarExcel}
            className="rounded-circle p-0 d-flex align-items-center justify-content-center"
            style={{
              width: "40px",
              height: "40px",
              backgroundColor: "transparent",
              transition: "background-color 0.3s",
              border: "1px solid green",
            }}
            onMouseEnter={e => (e.currentTarget.style.backgroundColor = "#86ed53")}
            onMouseLeave={e => (e.currentTarget.style.backgroundColor = "transparent")}
            title="Descargar Excel"
          >
            <i
              className="bi bi-file-earmark-excel-fill"
              style={{ color: "#107C41", fontSize: "18px" }}
            ></i>
          </button>
        </div>
      </div>
      {/* Mini cards grid */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
        {tiposServicio.map((tipo, idx) => (
          <div
            key={tipo}
            className="flex flex-col items-center bg-gray-50 rounded-lg border border-gray-100 p-2 shadow-sm min-w-0"
          >
            <div className="text-xs font-semibold text-gray-700 text-center mb-1 truncate w-full" title={tipo}>
              {tipo}
            </div>
            <div className="flex flex-col gap-1 w-full">
              <div className={`flex items-center justify-between text-[11px] font-medium rounded px-2 py-0.5 ${badgeClass.aprobado}`}>
                <span>{labelMap.aprobado}</span>
                <span>{datos[idx].aprobado}</span>
              </div>
              <div className={`flex items-center justify-between text-[11px] font-medium rounded px-2 py-0.5 ${badgeClass.proceso}`}>
                <span>{labelMap.proceso}</span>
                <span>{datos[idx].proceso}</span>
              </div>
              <div className={`flex items-center justify-between text-[11px] font-medium rounded px-2 py-0.5 ${badgeClass.rechazado}`}>
                <span>{labelMap.rechazado}</span>
                <span>{datos[idx].rechazado}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GraficaResumenServicios; 