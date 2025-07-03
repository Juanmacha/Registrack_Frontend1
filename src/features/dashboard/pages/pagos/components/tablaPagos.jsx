import React, { useState, useEffect } from "react";
import "bootstrap-icons/font/bootstrap-icons.css";
import pagos from "../services/dataPagos";
import getEstadoPagoBadge from "../services/getEstadoPagoBadge";
import VerDetallePago from "../components/verDetallePagos";
import DescargarExcelPagos from "../components/descargarExcelPagos";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const Tablapagos = () => {
  const [datos, setDatos] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [totalPaginas, setTotalPaginas] = useState(0);
  const [totalRegistros, setTotalRegistros] = useState(0);
  const registrosPorPagina = 5;

  const [detalleSeleccionado, setDetalleSeleccionado] = useState(null);
  const [modalAbierto, setModalAbierto] = useState(false);

  const abrirDetalle = (pago) => {
    setDetalleSeleccionado(pago);
    setModalAbierto(true);
  };

  const cerrarDetalle = () => {
    setDetalleSeleccionado(null);
    setModalAbierto(false);
  };

  useEffect(() => {
    const filtrar = pagos.filter(
      (p) =>
        p.id_pago.toString().includes(busqueda) ||
        p.metodo_pago.toLowerCase().includes(busqueda.toLowerCase())
    );
    const total = filtrar.length;
    const paginas = Math.ceil(total / registrosPorPagina);
    const inicio = (paginaActual - 1) * registrosPorPagina;
    const datosPaginados = filtrar.slice(inicio, inicio + registrosPorPagina);
    setDatos(datosPaginados);
    setTotalPaginas(paginas);
    setTotalRegistros(total);
  }, [paginaActual, busqueda]);

  const handleBusquedaChange = (e) => {
    setBusqueda(e.target.value);
    setPaginaActual(1);
  };

  return (
    <div className="w-full max-w-full">
      <div className="flex items-center justify-between px-4 mb-4 w-full">
        <input
          type="text"
          placeholder="Buscar por ID o método"
          className="form-control w-50 h-9 text-sm border border-gray-300 rounded-md px-3"
          value={busqueda}
          onChange={handleBusquedaChange}
        />
        <DescargarExcelPagos pagos={pagos} />
      </div>

      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 z-40">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full divide-y divide-gray-100">
            <thead className="text-left text-sm text-gray-500 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-center">ID Pago</th>
                <th className="px-6 py-4 text-center">Monto</th>
                <th className="px-6 py-4 text-center">Fecha</th>
                <th className="px-6 py-4 text-center">Método</th>
                <th className="px-6 py-4 text-center">Orden de Servicio</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700 text-center">
              {datos.map((item) => {
                const { color, texto } = getEstadoPagoBadge(item.estado);
                return (
                  <tr key={item.id_pago}>
                    <td className="px-6 py-4">{item.id_pago}</td>
                    <td className="px-6 py-4">${item.monto.toLocaleString()}</td>
                    <td className="px-6 py-4">
                      {new Date(item.fecha_pago).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">{item.metodo_pago}</td>
                    <td className="px-6 py-4">{item.id_orden_servicio}</td>
                    <td className="px-6 py-4 text-center">
                      <span
                        style={{ color, fontWeight: 600, fontSize: "14px" }}
                      >
                        {texto}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex gap-2 justify-center flex-wrap">
                        <button
                          onClick={() => abrirDetalle(item)}
                          className="btn btn-outline-info rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                          style={{
                            width: "32px",
                            height: "32px",
                            borderColor: "#1E4A85",
                            color: "#1E4A85",
                          }}
                          title="Ver detalle"
                        >
                          <i className="bi bi-eye-fill"></i>
                        </button>
                        {item.comprobante_url && (
                          <a
                            href={item.comprobante_url}
                            download={`comprobante_pago_${item.id_pago}.pdf`}
                            className="btn btn-outline-secondary rounded-circle p-0 d-flex align-items-center justify-content-center custom-hover"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderColor: "#6C757D",
                              color: "#6C757D",
                            }}
                            title="Descargar comprobante"
                          >
                            <i className="bi bi-download"></i>
                          </a>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginación */}
        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200 sm:px-6">
          <div className="text-sm text-gray-700">
            Mostrando{" "}
            <span className="font-medium">
              {(paginaActual - 1) * registrosPorPagina + 1}
            </span>{" "}
            a{" "}
            <span className="font-medium">
              {Math.min(paginaActual * registrosPorPagina, totalRegistros)}
            </span>{" "}
            de <span className="font-medium">{totalRegistros}</span>
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setPaginaActual(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="p-2 rounded-full bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center h-8 w-8"
            >
              <FaChevronLeft className="text-sm" />
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <button
                key={pagina}
                onClick={() => setPaginaActual(pagina)}
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  paginaActual === pagina
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-200"
                }`}
              >
                {pagina}
              </button>
            ))}
            <button
              onClick={() => setPaginaActual(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="p-2 rounded-full bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50 flex items-center justify-center h-8 w-8"
            >
              <FaChevronRight className="text-sm" />
            </button>
          </div>
        </div>
      </div>

      <VerDetallePago
        datos={detalleSeleccionado}
        isOpen={modalAbierto}
        onClose={cerrarDetalle}
      />

      <style jsx>{`
        .custom-hover:hover {
          opacity: 0.8;
          transform: scale(1.05);
          transition: all 0.2s ease-in-out;
        }
      `}</style>
    </div>
  );
};

export default Tablapagos;
