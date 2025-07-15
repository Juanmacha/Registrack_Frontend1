import React, { useState } from "react";
import { FileText } from "lucide-react";
import BotonDescargarExcel from "./descargarExcel";
import BotonInfo from "./detalleInfo";
import ModalDetalleServicio from "./modalInfo";
import { Info } from "lucide-react";

// Utilidad para avatar con iniciales
const Avatar = ({ nombre, color = "#2563eb" }) => {
  const iniciales = nombre
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 3);
  return (
    <div
      className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-white text-sm shadow border"
      style={{ backgroundColor: color }}
    >
      {iniciales}
    </div>
  );
};

// Badge de estado
const EstadoBadge = ({ estado }) => {
  const estadoLower = (estado || "").toLowerCase();
  if (estadoLower.includes("juicio"))
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-blue-100 text-blue-700">{estado}</span>;
  if (estadoLower.includes("forma"))
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-yellow-100 text-yellow-700">{estado}</span>;
  if (estadoLower.includes("pendiente"))
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-orange-100 text-orange-700">{estado}</span>;
  if (estadoLower.includes("incompleta"))
    return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-100 text-red-600">{estado}</span>;
  return <span className="px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700">{estado}</span>;
};

// Color para días
const DiasColor = ({ dias }) => {
  const num = parseInt(dias);
  let color = "text-gray-700";
  if (num >= 30) color = "text-red-600";
  else if (num >= 15) color = "text-orange-500";
  else if (num >= 8) color = "text-yellow-600";
  else color = "text-blue-700";
  return <span className={color + " font-semibold"}>{dias} días</span>;
};

const TablaServicios = () => {
  const [modalAbierto, setModalAbierto] = useState(false);
  const [servicioSeleccionado, setServicioSeleccionado] = useState(null);
  const [busquedaGlobal, setBusquedaGlobal] = useState("");

  const datos = [
    {
      servicio: "P.Oposición",
      cliente: "Thomas Jaramillo",
      empleado: "Jorge Vanegas",
      estado: "En proceso de Juicio",
      inactividad: "20 días",
    },
    {
      servicio: "Certificación",
      cliente: "Yuver Martinez",
      empleado: "Paulina Vanegas",
      estado: "Estudio de Forma",
      inactividad: "15 días",
    },
  ];

  // Filtrado global por todos los campos relevantes
  const datosFiltrados = datos.filter((item) => {
    const texto = `${item.servicio} ${item.cliente} ${item.empleado} ${item.estado} ${item.inactividad}`.toLowerCase();
    return texto.includes(busquedaGlobal.toLowerCase());
  });

  const abrirModal = (servicio) => {
    setServicioSeleccionado(servicio);
    setModalAbierto(true);
  };

  return (
    <>
      <div className="card-responsive hover-responsive z-40">
        {/* Encabezado elegante */}
        <div className="flex items-center gap-2 px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="bg-gray-200 p-2 rounded-full">
            <i className="bi bi-exclamation-triangle text-gray-600 text-xl"></i>
          </div>
          <h2 className="text-lg font-bold text-gray-800 tracking-wide">Servicios con Inactividad Prolongada</h2>
        </div>
        {/* Barra de búsqueda global */}
        <div className="flex flex-col md:flex-row gap-4 px-6 py-4 bg-white">
          <input
            type="text"
            placeholder="Buscar"
            className="border border-gray-300 rounded-lg px-4 py-2 w-full md:w-1/2"
            value={busquedaGlobal}
            onChange={e => setBusquedaGlobal(e.target.value)}
          />
        </div>
        <div className="table-responsive">
          <table className="table-auto w-full divide-y divide-gray-100">
            <thead className="text-left text-sm text-gray-500 bg-gray-50">
              <tr className="bg-gray-100 text-gray-700 text-xs uppercase tracking-wider border-b border-gray-200">
                <th className="px-4 py-3 text-left">Cliente</th>
                <th className="px-4 py-3 text-left">Empleado</th>
                <th className="px-4 py-3 text-center">Estado</th>
                <th className="px-4 py-3 text-center">Días Inactivo</th>
                <th className="px-4 py-3 text-center">Servicio</th>
                <th className="px-4 py-3 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {datosFiltrados.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center text-gray-500 py-8">
                    No se encontraron servicios con los filtros actuales.
                  </td>
                </tr>
              ) : (
                datosFiltrados.map((item, index) => (
                  <tr key={index}>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center gap-3 justify-center">
                        <FileText className="text-blue-500" size={20} />
                        <span className="font-medium text-gray-800">{item.servicio}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Avatar nombre={item.cliente} color="#2563eb" />
                        <span className="font-medium text-gray-800">{item.cliente}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center gap-2 justify-center">
                        <Avatar nombre={item.empleado} color="#444" />
                        <span className="font-medium text-gray-800">{item.empleado}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <EstadoBadge estado={item.estado} />
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex items-center gap-1 justify-center">
                        <i className="bi bi-clock-history text-gray-400 text-base"></i>
                        <DiasColor dias={parseInt(item.inactividad)} />
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <BotonDescargarExcel
                          datos={[item]}
                          nombreArchivo={`servicio-${index + 1}.xlsx`}
                        />
                        <BotonInfo
                          onClick={() => abrirModal(item)}
                        />
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal con detalle del servicio */}
      <ModalDetalleServicio
        abierto={modalAbierto}
        cerrar={() => setModalAbierto(false)}
        datos={servicioSeleccionado}
      />
    </>
  );
};

export default TablaServicios; 