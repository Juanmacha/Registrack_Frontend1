import React, { useEffect, useState } from "react";
import TablaEmpleados from "./components/tablaEmpleados";
import empleadosMock from "./services/dataEmpleados";

const Empleados = () => {
  const [datosEmpleados, setDatosEmpleados] = useState([]);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const empleadosPorPagina = 5;

  // Cargar empleados desde localStorage o mock
  useEffect(() => {
    const guardados = localStorage.getItem("empleados");
    if (guardados) {
      setDatosEmpleados(JSON.parse(guardados));
    } else {
      localStorage.setItem("empleados", JSON.stringify(empleadosMock));
      setDatosEmpleados(empleadosMock);
    }
  }, []);

  // Filtrar empleados por búsqueda
  const empleadosFiltrados = datosEmpleados.filter((empleado) =>
    `${empleado.nombre} ${empleado.apellidos} ${empleado.documento} ${empleado.rol}`
      .toLowerCase()
      .includes(busqueda.toLowerCase())
  );

  // Calcular paginación
  const totalPaginas = Math.ceil(empleadosFiltrados.length / empleadosPorPagina);
  const indiceInicio = (paginaActual - 1) * empleadosPorPagina;
  const indiceFin = indiceInicio + empleadosPorPagina;
  const empleadosPaginados = empleadosFiltrados.slice(indiceInicio, indiceFin);

  // Funciones de acción
  const handleVer = (empleado) => {
    alert(`Ver: ${empleado.nombre} ${empleado.apellidos}`);
  };

  const handleEditar = (empleado) => {
    alert(`Editar: ${empleado.nombre} ${empleado.apellidos}`);
  };

  const handleEliminar = (empleado) => {
    const confirmacion = confirm(`¿Eliminar a ${empleado.nombre}?`);
    if (confirmacion) {
      const actualizados = datosEmpleados.filter(e => e.id !== empleado.id);
      setDatosEmpleados(actualizados);
      localStorage.setItem("empleados", JSON.stringify(actualizados));
    }
  };

  const irAPagina = (pagina) => {
    if (pagina >= 1 && pagina <= totalPaginas) {
      setPaginaActual(pagina);
    }
  };

  // 🔧 Función para abrir modal o acción de creación
  const handleAbrirCrear = () => {
    alert("Abrir formulario para crear nuevo empleado");
  };

  return (
    <div className="w-full max-w-8xl mx-auto px-4 bg-[#eceded] min-h-screen">
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="flex-1 flex mt-12 justify-center">
          <div className="w-full px-4">

            {/* === Barra superior: búsqueda + botones === */}
            <div className="flex items-center justify-between px-4 mb-4 w-full">
              <input
                type="text"
                placeholder="Buscar por nombre, apellido, documento, rol..."
                className="form-control w-50 h-9 text-sm border border-gray-300 rounded-md px-3"
                value={busqueda}
                onChange={(e) => {
                  setBusqueda(e.target.value);
                  setPaginaActual(1);
                }}
              />

              <div className="flex gap-3">
                <button className="btn btn-success px-4 py-2 text-sm rounded-md whitespace-nowrap">
                  <i className="bi bi-file-earmark-excel-fill"></i> Descargar Excel
                </button>
              </div>
            </div>

            {/* === Tabla de empleados === */}
            <TablaEmpleados
              empleados={empleadosPaginados}
              onVer={handleVer}
              onEditar={handleEditar}
              onEliminar={handleEliminar}
            />

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
                <span className="font-medium">{empleadosFiltrados.length}</span> resultados
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

          </div>
        </div>
      </div>
    </div>
  );
};

export default Empleados;
