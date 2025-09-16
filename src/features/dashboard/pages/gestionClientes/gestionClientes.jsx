import React, { useEffect, useState } from "react";
import TablaClientes from "./components/tablaClientes";
import VerDetalleCliente from "./components/verDetalleCliente";
import FormularioCliente from "./components/FormularioCliente";
import { ClientService, initializeMockData } from "../../../../utils/mockDataService.js";
import "bootstrap-icons/font/bootstrap-icons.css";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import Swal from "sweetalert2";

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
  const [mostrarModalFormulario, setMostrarModalFormulario] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [clienteEditar, setClienteEditar] = useState(null);
  const rolUsuario = "administrador"; // Cambia a "empleado" para probar restricción
  const clientesPorPagina = 5;

  useEffect(() => {
    initializeMockData();
    const clientesData = ClientService.getAll();
    setClientes(clientesData);
  }, []);

  function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const clientesFiltrados = clientes.filter((c) => {
    const nombreCompleto = `${c.nombre} ${c.apellido}`;
    const texto = `${c.documento} ${nombreCompleto} ${c.email} ${c.telefono} ${c.estado} ${c.nitEmpresa} ${c.nombreEmpresa} ${c.marca} ${c.tipoPersona}`;
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
    const cliente = clientesPagina[idx];
    const nuevoEstado = cliente.estado === "Activo" ? "Inactivo" : "Activo";
    const clienteActualizado = ClientService.update(cliente.id, { estado: nuevoEstado });
    if (clienteActualizado) {
      const clientesActualizados = ClientService.getAll();
      setClientes(clientesActualizados);
    }
  };

  const handleCrearCliente = () => {
    setModoEdicion(false);
    setClienteEditar(null);
    setMostrarModalFormulario(true);
  };
  const handleEditarCliente = (idx) => {
    setModoEdicion(true);
    setClienteEditar(clientesPagina[idx]);
    setMostrarModalFormulario(true);
  };
  const handleGuardarCliente = (nuevoCliente) => {
    if (modoEdicion) {
      // Editar
      const actualizado = ClientService.update(nuevoCliente.id, nuevoCliente);
      if (actualizado) {
        setClientes(ClientService.getAll());
        Swal.fire({ icon: "success", title: "¡Cliente actualizado!", timer: 1500, showConfirmButton: false });
      }
    } else {
      // Crear
      const creado = ClientService.create(nuevoCliente);
      if (creado) {
        setClientes(ClientService.getAll());
        Swal.fire({ icon: "success", title: "¡Cliente creado!", timer: 1500, showConfirmButton: false });
      }
    }
    setMostrarModalFormulario(false);
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
    Swal.fire({
      icon: "success",
      title: "¡Éxito!",
      text: "Archivo Excel descargado exitosamente.",
      confirmButtonColor: "#3085d6",
    });
  };

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full px-4">
        <div className="flex items-center justify-between px-4 mb-4 w-full">
          <input
            type="text"
            placeholder="Buscar"
            className="form-control w-50 h-9 text-sm border border-gray-300 rounded-md px-3"
            value={busqueda}
            onChange={(e) => {
              setBusqueda(e.target.value);
              setPaginaActual(1);
            }}
          />

          <div className="flex gap-3">
            <button
              className="btn btn-primary px-4 py-2 text-sm rounded-md whitespace-nowrap"
              onClick={handleCrearCliente}
            >
              <i className="bi bi-plus-square"></i> Crear Cliente
            </button>
            <button
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
              onClick={handleExportarExcel}
              title="Descargar Excel"
            >
              <i
                className="bi bi-file-earmark-excel-fill"
                style={{ color: "#107C41", fontSize: "18px" }}
              ></i>
            </button>
          </div>
        </div>

        <TablaClientes
          clientes={clientesPagina}
          onVer={handleVer}
          onToggleEstado={handleToggleEstado}
          deshabilitarAcciones={deshabilitarAcciones}
          onEditar={handleEditarCliente}
        />

        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{clientesFiltrados.length === 0 ? 0 : indiceInicio + 1}</span> a {" "}
            <span className="font-medium">{Math.min(indiceFin, clientesFiltrados.length)}</span> de {" "}
            <span className="font-medium">{clientesFiltrados.length}</span> resultados
          </div>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => irAPagina(paginaActual - 1)}
              disabled={paginaActual === 1}
              className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50 flex items-center justify-center h-9 w-9 border border-blue-200"
            >
              <i className="bi bi-chevron-left text-base"></i>
            </button>
            {Array.from({ length: totalPaginas }, (_, i) => i + 1).map((pagina) => (
              <button
                key={pagina}
                onClick={() => irAPagina(pagina)}
                className={`h-9 w-9 rounded-full flex items-center justify-center font-semibold transition border ${
                  paginaActual === pagina
                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                    : "bg-white text-blue-600 border-blue-200 hover:bg-blue-50"
                }`}
              >
                {pagina}
              </button>
            ))}
            <button
              onClick={() => irAPagina(paginaActual + 1)}
              disabled={paginaActual === totalPaginas}
              className="p-2 rounded-full bg-white text-blue-600 hover:bg-blue-100 disabled:opacity-50 flex items-center justify-center h-9 w-9 border border-blue-200"
            >
              <i className="bi bi-chevron-right text-base"></i>
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
        {mostrarModalFormulario && (
          <FormularioCliente
            cliente={clienteEditar}
            onGuardar={handleGuardarCliente}
            onClose={() => setMostrarModalFormulario(false)}
            modoEdicion={modoEdicion}
            rolUsuario={rolUsuario}
          />
        )}
      </div>
    </div>
  );
};

export default GestionClientes;
