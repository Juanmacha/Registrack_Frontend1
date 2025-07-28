import React, { useState, useRef } from "react";
import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import BotonDescargarPdf from "./descargarPdf";

ChartJS.register(ArcElement, Tooltip, Legend);

const meses = [
  "Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio",
  "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"
];
const anios = [2023, 2024, 2025];

// Datos simulados por mes y año
const datosSimulados = {
  2025: {
    Febrero: {
      labels: [
        "Certificación",
        "Renovación",
        "Proceso de Oposición",
        "Búsqueda de Antecedentes",
        "Ampliación de Alcance",
        "Cesión de Marca"
      ],
      values: [45, 30, 12, 8, 3, 2],
      colors: [
        "#347cf7", // azul
        "#ff7d1a", // naranja
        "#22c55e", // verde
        "#a259e6", // morado
        "#1cc6e6", // celeste
        "#b6e61c"  // verde claro
      ]
    }
    // Puedes agregar más meses/años aquí
  },
  2024: {
    Enero: {
      labels: [
        "Certificación",
        "Renovación",
        "Proceso de Oposición",
        "Búsqueda de Antecedentes",
        "Ampliación de Alcance",
        "Cesión de Marca"
      ],
      values: [50, 30, 10, 5, 3, 2],
      colors: [
        "#347cf7", "#ff7d1a", "#22c55e", "#a259e6", "#1cc6e6", "#b6e61c"
      ]
    }
  }
};

const GraficaIngresosPie = () => {
  const [anio, setAnio] = useState(2025);
  const [mes, setMes] = useState("Febrero");
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const chartRef = useRef(null);

  const datos = datosSimulados[anio]?.[mes] || datosSimulados[2025]["Febrero"];
  const total = datos.values.reduce((a, b) => a + b, 0);

  const data = {
    labels: datos.labels,
    datasets: [
      {
        data: datos.values,
        backgroundColor: datos.colors,
        borderWidth: 2,
        hoverOffset: 16,
      },
    ],
  };

  // Datos para Excel
  const datosExcel = datos.labels.map((label, idx) => ({
    Servicio: label,
    Cantidad: datos.values[idx]
  }));

  const options = {
    cutout: "70%",
    plugins: {
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: function(context) {
            const label = context.label || '';
            const value = context.parsed;
            const percent = ((value / total) * 100).toFixed(0);
            return `${label}: ${percent}%`;
          }
        }
      }
    },
    onHover: (event, chartElement) => {
      if (chartElement.length > 0) {
        setHoveredIndex(chartElement[0].index);
      } else {
        setHoveredIndex(null);
      }
    }
  };

  return (
    <div className="dashboard-chart-container flex flex-col lg:flex-row items-center justify-center gap-2 min-h-[400px] relative">
      {/* Botón PDF en la esquina superior derecha absoluta del contenedor principal */}
      <div className="absolute top-4 right-4 z-20">
        <BotonDescargarPdf 
          datos={datosExcel} 
          nombreArchivo={`ingresos_pie_${mes}_${anio}.pdf`} 
          chartRef={chartRef}
        />
      </div>
      {/* Panel izquierdo: gráfica dona */}
      <div className="flex-shrink-0 flex items-center justify-center lg:justify-end w-full lg:w-auto pr-0 lg:pr-32 dashboard-chart">
        <div className="w-96 h-96" ref={chartRef}>
          <Doughnut data={data} options={options} />
        </div>
      </div>
      {/* Panel derecho: leyenda y controles */}
      <div className="flex flex-col items-center lg:items-start justify-center w-full max-w-md gap-3 relative">
        <h2 className="text-2xl font-bold text-center lg:text-left mb-2">Distribución de Ingresos por Servicio</h2>
        <div className="flex flex-row gap-2 w-full mb-2">
          <span className="flex items-center gap-1 text-gray-500"><i className="bi bi-calendar-event"></i> Período:</span>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={anio}
            onChange={e => setAnio(Number(e.target.value))}
          >
            {anios.map(a => (
              <option key={a} value={a}>{a}</option>
            ))}
          </select>
          <select
            className="border border-gray-300 rounded px-2 py-1"
            value={mes}
            onChange={e => setMes(e.target.value)}
          >
            {meses.map(m => (
              <option key={m} value={m}>{m}</option>
            ))}
          </select>
        </div>
        {/* Leyenda de servicios con porcentaje */}
        <div className="flex flex-col gap-2 w-full bg-white rounded-xl p-2">
          <h3 className="font-bold text-lg mb-1">Servicios</h3>
          {datos.labels.map((label, idx) => {
            const percent = ((datos.values[idx] / total) * 100).toFixed(0);
            const isActive = hoveredIndex === idx;
            return (
              <div key={label} className={`flex items-center justify-between px-2 py-1 rounded-lg ${isActive ? "bg-gray-100" : ""}`}
                style={{ transition: 'background 0.2s' }}>
                <span className="flex items-center gap-2">
                  <span className="inline-block w-4 h-4 rounded-full" style={{ backgroundColor: datos.colors[idx] }}></span>
                  <span className="font-medium text-gray-700">{label}</span>
                </span>
                <span className="font-bold text-gray-800">{percent}%</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default GraficaIngresosPie; 