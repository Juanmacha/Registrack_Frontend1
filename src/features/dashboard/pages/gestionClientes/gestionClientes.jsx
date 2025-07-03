import React, { useEffect, useState } from "react";
import TablaClientes from "./components/tablaClientes";
import VerDetalleCliente from "./components/verDetalleCliente";
import dataClientes from "./services/dataClientes";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CAMPOS_REQUERIDOS = [
  "tipoDocumento",
  "documento", "nombre", "apellido", "email", "telefono",
  "nitEmpresa", "nombreEmpresa", "marca", "tipoPersona"
];

const GestionClientes = () => {
  const [clientes, setClientes] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const [selectedCliente, setSelectedCliente] = useState(null);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [deshabilitarAcciones, setDeshabilitarAcciones] = useState(false);
  const clientesPorPagina = 5;

  useEffect(() => {
    let stored = JSON.parse(localStorage.getItem("clientes")) || [];
    const datosIncompletos =
      stored.length === 0 ||
      stored.length !== dataClientes.length ||
      stored.some(cliente =>
        CAMPOS_REQUERIDOS.some(campo => !(campo in cliente))
      );
    if (datosIncompletos) {
      localStorage.setItem("clientes", JSON.stringify(dataClientes));
      setClientes(dataClientes);
    } else {
      setClientes(stored);
    }
  }, []);

  function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const clientesFiltrados = clientes.filter((c) => {
    const texto = `${c.documento} ${c.nombre} ${c.apellido} ${c.email} ${c.telefono} ${c.estado} ${c.nitEmpresa} ${c.nombreEmpresa} ${c.marca} ${c.tipoPersona}`;
    return normalizarTexto(texto).includes(normalizarTexto(busqueda));
  });

  const totalPaginas = Math.ceil(clientesFiltrados.length / clientesPorPagina);
  const indiceInicio = (paginaActual - 1) * clientesPorPagina;
  const indiceFin = indiceInicio + clientesPorPagina;
  const clientesPagina = clientesFiltrados.slice(indiceInicio, indiceFin);

  const irAPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPaginaActual(num);
  };

  const handleVer = (idx) => {
    setSelectedCliente(clientesPagina[idx]);
    setMostrarModalVer(true);
    setDeshabilitarAcciones(true);
  };

  const handleToggleEstado = (idx) => {
    const actualizados = [...clientesPagina];
    const globalIdx = clientes.findIndex(c => c.documento === actualizados[idx].documento);
    if (globalIdx !== -1) {
      actualizados[idx].estado = actualizados[idx].estado === "Activo" ? "Inactivo" : "Activo";
      const nuevosClientes = [...clientes];
      nuevosClientes[globalIdx] = { ...actualizados[idx] };
      setClientes(nuevosClientes);
      localStorage.setItem("clientes", JSON.stringify(nuevosClientes));
    }
  };

  const handleExportarExcel = () => {
    const encabezados = [
      "Tipo de persona", "Tipo de documento", "Número de documento", "Nombre", "Apellido", "Email", "Teléfono", "Estado", "NIT Empresa", "Nombre Empresa", "Marca"
    ];
    const datosExcel = clientesFiltrados.map((c) => ({
      "Tipo de persona": c.tipoPersona,
      "Tipo de documento": c.tipoDocumento,
      "Número de documento": c.documento,
      "Nombre": c.nombre,
      "Apellido": c.apellido,
      "Email": c.email,
      "Teléfono": c.telefono,
      "Estado": c.estado,
      "NIT Empresa": c.nitEmpresa,
      "Nombre Empresa": c.nombreEmpresa,
      "Marca": c.marca
    }));
    const worksheet = XLSX.utils.json_to_sheet(datosExcel, { header: encabezados });
    worksheet["!cols"] = [
      { wch: 12 }, { wch: 15 }, { wch: 18 }, { wch: 18 }, { wch: 18 }, { wch: 30 }, { wch: 15 }, { wch: 10 }, { wch: 15 }, { wch: 20 }, { wch: 18 }
    ];
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Clientes");
    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const data = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(data, "clientes.xlsx");
  };

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full px-4">
        <div className="flex items-center justify-between px-4 mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar por nombre, empresa, documento..."
            className="form-control w-50 h-9 text-sm border border-gray-300 rounded-md px-3"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />

          <div className="flex gap-3">
            <button
              className="btn btn-success px-4 py-2 text-sm rounded-md whitespace-nowrap"
              onClick={handleExportarExcel}
            >
              <i className="bi bi-file-earmark-excel-fill"></i> Descargar Excel
            </button>
          </div>
        </div>

        <TablaClientes
          clientes={clientesPagina}
          onVer={handleVer}
          onToggleEstado={handleToggleEstado}
          deshabilitarAcciones={deshabilitarAcciones}
        />

        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{indiceInicio + 1}</span> a{" "}
            <span className="font-medium">{Math.min(indiceFin, clientesFiltrados.length)}</span> de{" "}
            <span className="font-medium">{clientesFiltrados.length}</span> resultados
          </div>
          <div className="flex gap-2">
            <button
              className="p-2 rounded-full bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => irAPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
            >
              <i className="bi bi-chevron-left"></i>
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => (
              <button
                key={i}
                className={`h-8 w-8 rounded-full flex items-center justify-center ${
                  paginaActual === i + 1
                    ? "bg-blue-600 text-white"
                    : "bg-white text-blue-600 border border-blue-200"
                }`}
                onClick={() => irAPagina(i + 1)}
              >
                {i + 1}
              </button>
            ))}
            <button
              className="p-2 rounded-full bg-white text-blue-600 hover:bg-gray-100 disabled:opacity-50"
              onClick={() => irAPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
            >
              <i className="bi bi-chevron-right"></i>
            </button>
          </div>
        </div>

        <VerDetalleCliente
          cliente={selectedCliente}
          isOpen={mostrarModalVer}
          onClose={() => {
            setMostrarModalVer(false);
            setDeshabilitarAcciones(false);
          }}
        />
      </div>
    </div>
  );
};

export default GestionClientes;
