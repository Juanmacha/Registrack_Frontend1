import React, { useEffect, useState } from "react";
import SideBarGeneral from "../../components/sideBarGeneral";
import NavBar from "../../components/navBarGeneral";

const Empleados = () => {
  const [datosEmpleados, setDatosEmpleados] = useState([]);

  // Cargar desde localStorage al iniciar
  useEffect(() => {
    const datosGuardados = localStorage.getItem("empleados");
    if (datosGuardados) {
      setDatosEmpleados(JSON.parse(datosGuardados));
    } else {
      // Si no hay datos, se inicializa con valores simulados
      const datosIniciales = [
        {
          id: 1,
          tipoDocumento: "CC",
          documento: "123456789",
          nombre: "Juan",
          apellidos: "Pérez",
          email: "juan@example.com",
          rol: "Administrador",
          estado: "Activo",
        },
        {
          id: 2,
          tipoDocumento: "NIT",
          documento: "987654321",
          nombre: "Ana",
          apellidos: "Gómez",
          email: "ana@example.com",
          rol: "Empleado",
          estado: "Inactivo",
        },
        {
          id: 3,
          tipoDocumento: "NIT",
          documento: "987654321",
          nombre: "Ana",
          apellidos: "Gómez",
          email: "ana@example.com",
          rol: "Empleado",
          estado: "Eliminado",
        },
      ];
      localStorage.setItem("empleados", JSON.stringify(datosIniciales));
      setDatosEmpleados(datosIniciales);
    }
  }, []);

  // Función para mostrar badge del estado
  const getEstadoBadge = (estado) => {
    const color =
      {
        Activo: "bg-green-200 text-green-700",
        Inactivo: "bg-red-200 text-red-700",
        Eliminado: "bg-yellow-200 text-yellow-700",
      }[estado] || "bg-gray-200 text-gray-700";

    return (
      <span className={`px-2 py-1 text-xs rounded-md ${color}`}>{estado}</span>
    );
  };

  return (
    <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
      <SideBarGeneral />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <NavBar titulo="Empleados Registrados" />
        <div className="flex-1 flex mt-12 justify-center">
          <div className="w-full px-4">
            <div className="w-full max-w-full">
              <div className="flex items-center justify-between px-4 mb-4 w-full">
                <input
                  type="text"
                  placeholder="Buscar..."
                  className="form-control w-48 h-9 text-sm border border-gray-300 rounded-md"
                />

                <div className="flex justify-end gap-3 ">
                  <button
                    className="btn btn-primary  text-sm rounded-md w-52 h-10 ml-3"
                    onClick={() => setShowModal(true)}
                  >
                    <i className="bi bi-plus"></i> Crear Empleado
                  </button>
                  <button className="btn btn-success px-4 py-2 text-sm rounded-md w-52">
                    <i className="bi bi-file-earmark-excel-fill"></i> Descargar
                    Excel
                  </button>
                </div>
              </div>

              <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 z-40">
                <div className="overflow-x-auto w-full">
                  <table className="table-auto w-full divide-y divide-gray-100">
                    <thead className="text-left text-sm text-gray-500 bg-gray-50">
                      <tr>
                        <th className="px-6 py-4 font-medium text-center">
                          ID
                        </th>
                        <th className="px-6 py-4 font-medium text-center">
                          Tipo de Documento
                        </th>
                        <th className="px-6 py-4 font-medium text-center">
                          Documento
                        </th>
                        <th className="px-6 py-4 font-medium text-center">
                          Nombre
                        </th>
                        <th className="px-6 py-4 font-medium text-center">
                          Apellidos
                        </th>
                        <th className="px-6 py-4 font-medium text-center">
                          Email
                        </th>
                        <th className="px-6 py-4 font-medium text-center">
                          Rol
                        </th>
                        <th className="px-6 py-4 font-medium text-center">
                          Estado
                        </th>
                        <th className="px-6 py-4 font-medium text-center">
                          Acciones
                        </th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
                      {datosEmpleados.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 text-center">{item.id}</td>
                          <td className="px-6 py-4 text-center">
                            {item.tipoDocumento}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.documento}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.nombre}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.apellidos}
                          </td>
                          <td className="px-6 py-4 text-center">
                            {item.email}
                          </td>
                          <td className="px-6 py-4 text-center">{item.rol}</td>
                          <td className="px-6 py-4 text-center">
                            {getEstadoBadge(item.estado)}
                          </td>
                          <td className="px-6 py-4 text-center">
                            <div className="flex gap-2 justify-center flex-wrap">
                              <button className="btn btn-outline-secondary btn-sm">
                                <i className="bi bi-pencil-fill"></i>
                              </button>
                              <button className="btn btn-outline-secondary btn-sm">
                                <i className="bi bi-eye-fill"></i>
                              </button>
                              <button className="btn btn-outline-danger btn-sm">
                                <i className="bi bi-dash-circle"></i>
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                      {datosEmpleados.length === 0 && (
                        <tr>
                          <td
                            colSpan="9"
                            className="text-center py-6 text-gray-500 italic"
                          >
                            No hay empleados registrados.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Empleados;
