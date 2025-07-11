import React, { useState } from "react";
import { FileText } from "lucide-react";
import BotonDescargarExcel from "./descargarExcel";
import BotonInfo from "./detalleInfo";
import ModalDetalleServicio from "./modalInfo"; 
import { Info } from "lucide-react";

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
              <tr>
                <th className="px-6 py-4 text-center">Servicio</th>
                <th className="px-6 py-4 text-center">Cliente</th>
                <th className="px-6 py-4 text-center">Empleado Asignado</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">
                  Tiempo de inactividad prolongado
                </th>
                <th className="px-6 py-4 text-center">Acciones</th>
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
                    <td className="px-6 py-4 text-center">{item.servicio}</td>
                    <td className="px-6 py-4 text-center">{item.cliente}</td>
                    <td className="px-6 py-4 text-center">{item.empleado}</td>
                    <td className="px-6 py-4 text-center">{item.estado}</td>
                    <td className="px-6 py-4 text-center">{item.inactividad}</td>
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