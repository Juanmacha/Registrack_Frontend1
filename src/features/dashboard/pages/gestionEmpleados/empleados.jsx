import React, { useEffect, useState } from "react";
import TablaEmpleados from "./components/tablaEmpleados";
import { EmployeeService, initializeMockData } from "../../../../utils/mockDataService.js";
import CrearEmpleadoModal from "./components/crearEmpleado";
import EditarEmpleadoModal from "./components/editarEmpleado";
import VerEmpleadoModal from "./components/verEmpleado";
import EliminarEmpleado from "./components/eliminarEmpleado";
import DescargarExcelEmpleados from "./components/descargarEmpleadosExcel";


const Empleados = () => {
  const [datosEmpleados, setDatosEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const empleadosPorPagina = 5;

  const [nuevoEmpleado, setNuevoEmpleado] = useState({
    nombre: "",
    apellidos: "",
    documento: "",
    tipoDocumento: "", // agregado
    rol: "",
    email: "", // cambiado de correo a email
    estado: "activo",
  });

  const [mostrarFormulario, setMostrarFormulario] = useState(false);

  const [mostrarEditar, setMostrarEditar] = useState(false);
  const [empleadoEditando, setEmpleadoEditando] = useState(null);

  const handleEditar = (empleado) => {
    setEmpleadoEditando(empleado);
    setMostrarEditar(true);
  };

  const handleActualizarEmpleado = (empleadoActualizado) => {
    const empleadoActualizadoResult = EmployeeService.update(empleadoActualizado.id, empleadoActualizado);
    if (empleadoActualizadoResult) {
      const empleadosActualizados = EmployeeService.getAll();
      setDatosEmpleados(empleadosActualizados);
    }
    setMostrarEditar(false);
  };

  const [mostrarVer, setMostrarVer] = useState(false);
  const [empleadoViendo, setEmpleadoViendo] = useState(null);

  useEffect(() => {
    initializeMockData();
    const empleadosData = EmployeeService.getAll();
    setDatosEmpleados(empleadosData);
  }, []);

  const handleAbrirCrear = () => {
    setNuevoEmpleado({
      nombre: "",
      apellidos: "",
      documento: "",
      tipoDocumento: "", // aquí lo agregas
      rol: "",
      email: "",
      estado: "activo",
    });
    setMostrarFormulario(true);
  };

  const handleGuardarEmpleado = (empleado) => {
    const nuevoEmpleadoCreado = EmployeeService.create(empleado);
    if (nuevoEmpleadoCreado) {
      const empleadosActualizados = EmployeeService.getAll();
      setDatosEmpleados(empleadosActualizados);
    }
    setMostrarFormulario(false);
  };

  const handleCancelar = () => {
    setMostrarFormulario(false);
  };

  const normalizarTexto = (texto) =>
    texto
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();







  const empleadosFiltrados = datosEmpleados.filter((empleado) =>
    normalizarTexto(
      `${empleado.nombre} ${empleado.apellidos} ${empleado.documento} ${empleado.rol}`
    ).includes(normalizarTexto(busqueda))
  );

  const totalPaginas = Math.ceil(
    empleadosFiltrados.length / empleadosPorPagina
  );
  const indiceInicio = (paginaActual - 1) * empleadosPorPagina;
  const indiceFin = indiceInicio + empleadosPorPagina;
  const empleadosPaginados = empleadosFiltrados.slice(indiceInicio, indiceFin);

  const handleVer = (empleado) => {
    setEmpleadoViendo(empleado);
    setMostrarVer(true);
  };

  const handleEliminar = (empleado) => {
    const confirmacion = confirm(`¿Eliminar a ${empleado.nombre}?`);
    if (confirmacion) {
      const eliminado = EmployeeService.delete(empleado.id);
      if (eliminado) {
        const empleadosActualizados = EmployeeService.getAll();
        setDatosEmpleados(empleadosActualizados);
      }
    }
  };

  const irAPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  return (
    <div className="w-full max-w-8xl mx-auto px-4 bg-[#eceded] min-h-screen">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex mt-4 justify-center">
          <div className="w-full px-4">
            {/* === Barra superior === */}
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
                  onClick={handleAbrirCrear}
                >
                  <i className="bi bi-plus-square"></i> Crear Empleado
                </button>
                <DescargarExcelEmpleados empleados={datosEmpleados} />
              </div>
            </div>
            {mostrarFormulario && (
              <CrearEmpleadoModal
                showModal={mostrarFormulario}
                setShowModal={setMostrarFormulario}
                nuevoEmpleado={nuevoEmpleado}
                setNuevoEmpleado={setNuevoEmpleado}
                handleSubmit={handleGuardarEmpleado}
              />
            )}
            {mostrarEditar && empleadoEditando && (
              <EditarEmpleadoModal
                showModal={mostrarEditar}
                setShowModal={setMostrarEditar}
                empleadoEditando={empleadoEditando}
                setEmpleadoEditando={setEmpleadoEditando}
                handleActualizarEmpleado={handleActualizarEmpleado}
              />
            )}
            {/* === Tabla de empleados === */}
            <TablaEmpleados
              empleados={empleadosPaginados}
              onVer={handleVer}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />
            {mostrarVer && empleadoViendo && (
              <VerEmpleadoModal
                showModal={mostrarVer}
                setShowModal={setMostrarVer}
                empleado={empleadoViendo}
              />
            )}

            {/* === Paginación === */}
            <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
              <div className="text-sm text-gray-700">
                Mostrando{" "}
                <span className="font-medium">
                  {empleadosFiltrados.length === 0 ? 0 : indiceInicio + 1}
                </span>{" "}
                a{" "}
                <span className="font-medium">
                  {Math.min(indiceFin, empleadosFiltrados.length)}
                </span>{" "}
                de{" "}
                <span className="font-medium">{empleadosFiltrados.length}</span>{" "}
                resultados
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
                    className={`h-8 w-8 rounded-full flex items-center justify-center ${paginaActual === i + 1
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
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empleados;
