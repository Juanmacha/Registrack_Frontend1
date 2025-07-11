import React from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import BotonDescargarExcel from "./descargarExcel";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const datosSimulados = {
  labels: [
    "Certificación",
    "Renovación",
    "Proceso de Oposición",
    "Búsqueda de Antecedentes",
    "Ampliación de Alcance",
    "Cesión de Marca"
  ],
  values: [50000, 30000, 10000, 5000, 3000, 2000],
  colors: [
    "#2563eb", // azul
    "#fb923c", // naranja
    "#22c55e", // verde
    "#a21caf", // morado
    "#06b6d4", // celeste
    "#84cc16"  // verde claro
  ]
};

const data = {
  labels: datosSimulados.labels,
  datasets: [
    {
      label: "Ingresos por Servicio ($)",
      data: datosSimulados.values,
      backgroundColor: datosSimulados.colors,
      borderRadius: 8,
      maxBarThickness: 40,
    },
  ],
};

const options = {
  plugins: {
    legend: { display: false },
    tooltip: {
      callbacks: {
        label: function(context) {
          return `$${context.parsed.y.toLocaleString()}`;
        }
      }
    }
  },
  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        callback: function(value) {
          return `$${value.toLocaleString()}`;
        }
      }
    }
  }
};

const datosExcel = datosSimulados.labels.map((label, idx) => ({
  Servicio: label,
  Ingresos: datosSimulados.values[idx]
}));

const GraficaIngresosBarra = () => {
  return (
    <div className="bg-white rounded-xl shadow border border-gray-200 p-4 mb-6 relative min-h-[340px]">
      {/* Botón en la esquina superior derecha */}
      <div className="absolute top-4 right-4 z-10">
        <BotonDescargarExcel datos={datosExcel} nombreArchivo="ingresos_por_servicio.xlsx" />
      </div>
      <h2 className="text-lg font-bold mb-2">Ingresos por Servicio</h2>
      <Bar data={data} options={options} height={220} />
    </div>
  );
};

export default GraficaIngresosBarra; 