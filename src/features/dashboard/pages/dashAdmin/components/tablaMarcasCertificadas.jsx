import React, { useState } from "react";
import { Calendar, AlertTriangle, Download } from "lucide-react";
import BotonDescargarExcel from "./descargarExcel";
import StandardAvatar from "../../../../../shared/components/StandardAvatar";

// Badge de estado de vencimiento
const EstadoVencimientoBadge = ({ diasRestantes }) => {
  const dias = parseInt(diasRestantes);
  if (dias <= 30) {
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-700">Crítico</span>;
  } else if (dias <= 60) {
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">Urgente</span>;
  } else if (dias <= 90) {
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">Atención</span>;
  } else {
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700">Normal</span>;
  }
};

// Color para días restantes
const DiasRestantesColor = ({ dias }) => {
  const num = parseInt(dias);
  let color = "text-gray-700";
  if (num <= 30) color = "text-red-600 font-bold";
  else if (num <= 60) color = "text-orange-500 font-semibold";
  else if (num <= 90) color = "text-yellow-600 font-semibold";
  else color = "text-green-700";
  return <span className={color}>{dias} días</span>;
};

const TablaMarcasCertificadas = () => {
  const [busquedaGlobal, setBusquedaGlobal] = useState("");

  // Datos simulados de marcas certificadas próximas a vencerse
  const datos = [
    {
      marca: "COCA-COLA",
      cliente: "Coca-Cola Company",
      fechaCertificacion: "2022-03-15",
      fechaVencimiento: "2025-03-15",
      diasRestantes: 45,
      estado: "Activa",
      empleadoAsignado: "María González"
    },
    {
      marca: "NIKE",
      cliente: "Nike Inc.",
      fechaCertificacion: "2021-08-20",
      fechaVencimiento: "2025-02-20",
      diasRestantes: 25,
      estado: "Activa",
      empleadoAsignado: "Carlos Rodríguez"
    },
    {
      marca: "APPLE",
      cliente: "Apple Inc.",
      fechaCertificacion: "2022-11-10",
      fechaVencimiento: "2025-01-10",
      diasRestantes: 15,
      estado: "Activa",
      empleadoAsignado: "Ana Martínez"
    },
    {
      marca: "MICROSOFT",
      cliente: "Microsoft Corporation",
      fechaCertificacion: "2021-05-12",
      fechaVencimiento: "2025-04-12",
      diasRestantes: 75,
      estado: "Activa",
      empleadoAsignado: "Luis Pérez"
    },
    {
      marca: "GOOGLE",
      cliente: "Alphabet Inc.",
      fechaCertificacion: "2022-09-05",
      fechaVencimiento: "2025-03-05",
      diasRestantes: 35,
      estado: "Activa",
      empleadoAsignado: "Sofia Herrera"
    },
    {
      marca: "AMAZON",
      cliente: "Amazon.com Inc.",
      fechaCertificacion: "2021-12-18",
      fechaVencimiento: "2025-02-18",
      diasRestantes: 28,
      estado: "Activa",
      empleadoAsignado: "Roberto Silva"
    }
  ];

  // Filtrado global por todos los campos relevantes
  const datosFiltrados = datos.filter((item) => {
    const texto = `${item.marca} ${item.cliente} ${item.empleadoAsignado} ${item.estado}`.toLowerCase();
    return texto.includes(busquedaGlobal.toLowerCase());
  });

  // Ordenar por días restantes (más críticos primero)
  const datosOrdenados = datosFiltrados.sort((a, b) => a.diasRestantes - b.diasRestantes);

  return (
    <div className="card-responsive hover-responsive z-40">
      {/* Encabezado elegante */}
      <div className="flex items-center gap-2 px-6 py-4 bg-gradient-to-r from-orange-50 to-red-50 border-b border-orange-200">
        <div className="bg-orange-200 p-2 rounded-full">
          <AlertTriangle className="text-orange-600 text-xl" />
        </div>
        <h2 className="text-lg font-bold text-orange-800 tracking-wide">Marcas Certificadas Próximas a Vencerse</h2>
        <div className="ml-auto">
          <BotonDescargarExcel
            datos={datosOrdenados.map(item => ({
              Marca: item.marca,
              Cliente: item.cliente,
              "Fecha Certificación": item.fechaCertificacion,
              "Fecha Vencimiento": item.fechaVencimiento,
              "Días Restantes": item.diasRestantes,
              Estado: item.estado,
              "Empleado Asignado": item.empleadoAsignado
            }))}
            nombreArchivo="marcas-certificadas-proximas-vencimiento.xlsx"
          />
        </div>
      </div>

      {/* Barra de búsqueda global */}
      <div className="flex flex-col md:flex-row gap-4 px-6 py-4 bg-white">
        <input
          type="text"
          placeholder="Buscar por marca, cliente, empleado..."
          value={busquedaGlobal}
          onChange={(e) => setBusquedaGlobal(e.target.value)}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500"
        />
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>{datosOrdenados.length} marcas encontradas</span>
        </div>
      </div>

      {/* Tabla responsiva */}
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-gray-700 uppercase bg-gray-50">
            <tr>
              <th className="px-6 py-4 font-bold text-center">Cliente</th>
              <th className="px-6 py-4 font-bold text-center">Marca</th>
              <th className="px-6 py-4 font-bold text-center">Fecha Certificación</th>
              <th className="px-6 py-4 font-bold text-center">Fecha Vencimiento</th>
              <th className="px-6 py-4 font-bold text-center">Días Restantes</th>
              <th className="px-6 py-4 font-bold text-center">Estado</th>
              <th className="px-6 py-4 font-bold text-center">Empleado Asignado</th>
              <th className="px-6 py-4 font-bold text-center">Acciones</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {datosOrdenados.map((item, index) => (
              <tr key={index} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4 text-center">
                  <div className="flex items-center justify-center gap-3">
                    <StandardAvatar 
                      nombre={item.cliente}
                    />
                    <div className="text-left">
                      <span>{item.cliente}</span>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4 text-center font-medium text-gray-900">
                  {item.marca}
                </td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {new Date(item.fechaCertificacion).toLocaleDateString("es-ES")}
                </td>
                <td className="px-6 py-4 text-center text-gray-600">
                  {new Date(item.fechaVencimiento).toLocaleDateString("es-ES")}
                </td>
                <td className="px-6 py-4 text-center">
                  <DiasRestantesColor dias={item.diasRestantes} />
                </td>
                <td className="px-6 py-4 text-center">
                  <EstadoVencimientoBadge diasRestantes={item.diasRestantes} />
                </td>
                <td className="px-6 py-4 text-center text-gray-700">
                  {item.empleadoAsignado}
                </td>
                <td className="px-6 py-4 text-center">
                  <button
                    className="p-2 rounded-md bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-50 flex items-center justify-center h-10 w-10 border border-gray-300 transition-all duration-200"
                    title="Iniciar proceso de renovación"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                    </svg>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Mensaje si no hay datos */}
      {datosOrdenados.length === 0 && (
        <div className="text-center py-8 text-gray-500">
          <AlertTriangle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
          <p>No se encontraron marcas certificadas próximas a vencerse</p>
        </div>
      )}
    </div>
  );
};

export default TablaMarcasCertificadas; 