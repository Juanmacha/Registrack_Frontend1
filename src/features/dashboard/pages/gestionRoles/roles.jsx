import React, { useState, useEffect } from "react";
import SideBarGeneral from "../../components/sideBarGeneral";
import NavBar from "../../components/navBarGeneral";
import {
  mostrarMensajeExito,
  mostrarMensajeError,
  mostrarConfirmacion,
} from "../../../../utils/alerts";

import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const modelosDisponibles = [
  "Dashboard",
  "Citas",
  "Usuarios",
  "Certificacion",
  "Amplificacion de Servicios",
  "Renovacion",
  "Proceso de Oposicion",
  "Roles",
];

const Roles = () => {
  const [showModal, setShowModal] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [roles, setRoles] = useState([]);
  const [nuevoRol, setNuevoRol] = useState({
    nombre: "",
    estado: "activo",
    permisos: {},
  });

  useEffect(() => {
    const almacenados = JSON.parse(localStorage.getItem("roles")) || [];
    setRoles(almacenados);
  }, []);

  const guardarRoles = (nuevo) => {
    const actualizados = [...roles, nuevo];
    setRoles(actualizados);
    localStorage.setItem("roles", JSON.stringify(actualizados));
  };

  const verDetallesRol = (rol) => {
    setRolSeleccionado(rol);
  };

  const [rolEditable, setRolEditable] = useState(null); // objeto del rol actual editable
  const [permisosEditados, setPermisosEditados] = useState({});

  const getEstadoBadge = (estado) => {
    return (
      <span
        className={`px-3 py-1 rounded-full text-xs font-semibold ${
          estado === "activo"
            ? "bg-green-100 text-green-800"
            : "bg-red-100 text-red-800"
        }`}
      >
        {estado}
      </span>
    );
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoRol.nombre.trim() !== "") {
      guardarRoles(nuevoRol);
      setNuevoRol({ nombre: "", estado: "activo", permisos: {} });
      setShowModal(false);
      mostrarMensajeExito("¡Rol creado exitosamente!");
    } else {
      mostrarMensajeError("Por favor, ingresa un nombre para el rol.");
    }
  };

  const handleCheckboxChange = (modelo, accion) => {
    setNuevoRol((prev) => ({
      ...prev,
      permisos: {
        ...prev.permisos,
        [modelo]: {
          ...prev.permisos[modelo],
          [accion]: !prev.permisos[modelo]?.[accion],
        },
      },
    }));
  };

  const eliminarRol = async (index) => {
    const confirmado = await mostrarConfirmacion(
      "¿Estás seguro?",
      "Esta acción no se puede deshacer.",
      "Sí, eliminar"
    );

    if (confirmado.isConfirmed) {
      const nuevosRoles = [...roles];
      nuevosRoles.splice(index, 1);
      setRoles(nuevosRoles);
      localStorage.setItem("roles", JSON.stringify(nuevosRoles));
      mostrarMensajeExito("Rol eliminado correctamente.");
    }
  };

  const exportarExcel = () => {
    const rolesData = JSON.parse(localStorage.getItem("roles")) || [];

    const encabezados = ["Nombre del Rol", "Estado", "Permisos Asignados"];

    const datosExcel = rolesData.map((rol) => ({
      "Nombre del Rol": rol.nombre,
      Estado: rol.estado,
      "Permisos Asignados": Object.entries(rol.permisos || {})
        .map(([modelo, acciones]) => {
          const accionesActivas = Object.entries(acciones)
            .filter(([_, activo]) => activo)
            .map(([accion]) => accion)
            .join(", ");
          return `${modelo}: ${accionesActivas}`;
        })
        .join(" | "),
    }));

    const worksheet = XLSX.utils.json_to_sheet(datosExcel, {
      header: encabezados,
    });

    // Estilo de encabezados: color de fondo y negrita
    const headerStyle = {
      fill: { fgColor: { rgb: "D9E1F2" } },
      font: { bold: true },
      alignment: { horizontal: "center" },
      border: {
        top: { style: "thin", color: { rgb: "000000" } },
        bottom: { style: "thin", color: { rgb: "000000" } },
        left: { style: "thin", color: { rgb: "000000" } },
        right: { style: "thin", color: { rgb: "000000" } },
      },
    };

    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cell_address = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cell_address]) continue;
      worksheet[cell_address].s = headerStyle;
    }

    // Ajustar el ancho de las columnas
    worksheet["!cols"] = [
      { wch: 25 }, // Nombre del Rol
      { wch: 15 }, // Estado
      { wch: 80 }, // Permisos Asignados
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Roles");

    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
      cellStyles: true,
    });

    const data = new Blob([excelBuffer], {
      type: "application/octet-stream",
    });

    saveAs(data, "roles.xlsx");
  };

  return (
    <div className="bg-[#eceded] flex h-screen w-screen overflow-hidden">
      <SideBarGeneral />
      <div className="flex-1 flex flex-col overflow-y-auto">
        <NavBar titulo="Roles" />
        <div className="p-4 bg-gray-100 min-h-screen">


        <div className="flex justify-end gap-3 mt-4 ">
            <button
              className="btn btn-primary px-4 py-2 text-sm rounded-md"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus"></i> Crear Rol
            </button>
            <button
              className="btn btn-success px-4 py-2 text-sm rounded-md"
              onClick={exportarExcel}
            >
              <i className="bi bi-file-earmark-excel-fill"></i> Descargar Excel
            </button>
          </div>
          
          <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 mt-3">
            <div className="overflow-x-auto w-full">
              <table className="table-auto w-full divide-y divide-gray-100">
                <thead className="text-sm text-gray-500 bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-center">Titular</th>
                    <th className="px-6 py-3 text-center">Estado</th>
                    <th className="px-6 py-3 text-center">Acciones</th>
                  </tr>
                </thead>
                <tbody className="text-sm text-gray-700">
                  {roles.map((rol, index) => (
                    <tr key={index}>
                      <td className="px-6 py-2 text-center">
                        <div className="flex flex-col items-center gap-1">
                          <img
                            src={`https://api.dicebear.com/7.x/initials/svg?seed=${rol.nombre}`}
                            alt={rol.nombre}
                            className="w-10 h-10 rounded-full"
                          />
                          <div className="text-sm font-semibold text-gray-800">
                            {rol.nombre}
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-2 text-center">
                        {getEstadoBadge(rol.estado || "activo")}
                      </td>
                      <td className="px-6 py-2 text-center">
                        <div className="flex gap-1 justify-center flex-wrap">
                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => setRolEditable(rol)}
                          >
                            <i className="bi bi-pencil-fill"></i>
                          </button>

                          <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={() => verDetallesRol(rol)}
                          >
                            <i className="bi bi-eye-fill"></i>
                          </button>

                          <button
                            className="btn btn-outline-danger btn-sm"
                            onClick={() => eliminarRol(index)}
                          >
                            <i className="bi bi-dash-circle"></i>
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          

          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
                <h2 className="text-xl font-bold mb-4">Crear nuevo rol</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nombre del rol
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={nuevoRol.nombre}
                      onChange={(e) =>
                        setNuevoRol({ ...nuevoRol, nombre: e.target.value })
                      }
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                      Estado
                    </label>
                    <select
                      className="w-full border rounded-md px-2 py-1 text-sm"
                      value={nuevoRol.estado}
                      onChange={(e) =>
                        setNuevoRol({ ...nuevoRol, estado: e.target.value })
                      }
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Permisos por modelo:
                    </h3>
                    <table className="w-full text-sm border rounded-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 border">Modelos</th>
                          <th className="px-3 py-2 border text-center">
                            Crear
                          </th>
                          <th className="px-3 py-2 border text-center">
                            Editar
                          </th>
                          <th className="px-3 py-2 border text-center">
                            Eliminar
                          </th>
                          <th className="px-3 py-2 border text-center">
                            Ver Detalles
                          </th>
                          <th className="px-3 py-2 border text-center">
                            Cambiar Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {modelosDisponibles.map((modelo) => (
                          <tr key={modelo}>
                            <td className="px-3 py-2 border">{modelo}</td>
                            {[
                              "crear",
                              "editar",
                              "eliminar",
                              "ver",
                              "estado",
                            ].map((accion) => (
                              <td
                                key={accion}
                                className="px-3 py-2 border text-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    !!nuevoRol.permisos?.[modelo]?.[accion]
                                  }
                                  onChange={() =>
                                    handleCheckboxChange(modelo, accion)
                                  }
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}

          {rolSeleccionado && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-3xl relative">
                <h2 className="text-xl font-bold mb-4">Detalles del rol</h2>
                <p>
                  <strong>Nombre:</strong> {rolSeleccionado.nombre}
                </p>
                <p>
                  <strong>Estado:</strong> {rolSeleccionado.estado}
                </p>

                <div className="mt-6">
                  <h3 className="text-sm font-semibold mb-3 text-gray-700">
                    Permisos y Privilegios
                  </h3>
                  <div className="overflow-x-auto border rounded-lg shadow-sm">
                    <table className="min-w-full divide-y divide-gray-200 text-sm">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-4 py-2 text-left">Modelo</th>
                          <th className="px-4 py-2 text-center">Crear</th>
                          <th className="px-4 py-2 text-center">Editar</th>
                          <th className="px-4 py-2 text-center">Eliminar</th>
                          <th className="px-4 py-2 text-center">
                            Ver Detalles
                          </th>
                          <th className="px-4 py-2 text-center">
                            Cambiar Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-100">
                        {modelosDisponibles.map((modelo) => (
                          <tr key={modelo}>
                            <td className="px-4 py-2 font-medium">{modelo}</td>
                            {[
                              "crear",
                              "editar",
                              "eliminar",
                              "ver",
                              "estado",
                            ].map((accion) => {
                              const permisoActivo =
                                rolSeleccionado.permisos?.[modelo]?.[accion];

                              return (
                                <td
                                  key={accion}
                                  className="px-4 py-2 text-center"
                                >
                                  <span
                                    className={`inline-block w-3 h-3 rounded-full ${
                                      permisoActivo
                                        ? "bg-green-500"
                                        : "bg-red-500"
                                    }`}
                                  ></span>
                                </td>
                              );
                            })}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="flex justify-end mt-4">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setRolSeleccionado(null)}
                  >
                    Cerrar
                  </button>
                </div>
              </div>
            </div>
          )}

          {rolEditable && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-2xl relative">
                <h2 className="text-xl font-bold mb-4">Editar rol</h2>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    const actualizados = roles.map((rol) =>
                      rol.nombre === rolEditable.nombre ? rolEditable : rol
                    );
                    setRoles(actualizados);
                    localStorage.setItem("roles", JSON.stringify(actualizados));
                    setRolEditable(null);
                    mostrarMensajeExito("¡Rol actualizado exitosamente!");
                  }}
                  className="space-y-4"
                >
                  <div>
                    <label className="block text-sm font-medium mb-1">
                      Nombre del rol
                    </label>
                    <input
                      type="text"
                      className="w-full border rounded-md px-3 py-2 text-sm"
                      value={rolEditable.nombre}
                      onChange={(e) =>
                        setRolEditable({
                          ...rolEditable,
                          nombre: e.target.value,
                        })
                      }
                      required
                    />
                  </div>

                  <div className="mb-2">
                    <label className="block text-sm font-medium mb-1">
                      Estado
                    </label>
                    <select
                      className="w-full border rounded-md px-2 py-1 text-sm"
                      value={rolEditable.estado}
                      onChange={(e) =>
                        setRolEditable({
                          ...rolEditable,
                          estado: e.target.value,
                        })
                      }
                    >
                      <option value="activo">Activo</option>
                      <option value="inactivo">Inactivo</option>
                    </select>
                  </div>

                  <div>
                    <h3 className="text-sm font-semibold mb-3">
                      Permisos por modelo:
                    </h3>
                    <table className="w-full text-sm border rounded-md">
                      <thead className="bg-gray-100">
                        <tr>
                          <th className="px-3 py-2 border">Modelos</th>
                          <th className="px-3 py-2 border text-center">
                            Crear
                          </th>
                          <th className="px-3 py-2 border text-center">
                            Editar
                          </th>
                          <th className="px-3 py-2 border text-center">
                            Eliminar
                          </th>
                          <th className="px-3 py-2 border text-center">
                            Ver Detalles
                          </th>
                          <th className="px-3 py-2 border text-center">
                            Cambiar Estado
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {modelosDisponibles.map((modelo) => (
                          <tr key={modelo}>
                            <td className="px-3 py-2 border">{modelo}</td>
                            {[
                              "crear",
                              "editar",
                              "eliminar",
                              "ver",
                              "estado",
                            ].map((accion) => (
                              <td
                                key={accion}
                                className="px-3 py-2 border text-center"
                              >
                                <input
                                  type="checkbox"
                                  checked={
                                    !!rolEditable.permisos?.[modelo]?.[accion]
                                  }
                                  onChange={() => {
                                    const nuevosPermisos = {
                                      ...rolEditable.permisos,
                                      [modelo]: {
                                        ...rolEditable.permisos?.[modelo],
                                        [accion]:
                                          !rolEditable.permisos?.[modelo]?.[
                                            accion
                                          ],
                                      },
                                    };
                                    setRolEditable({
                                      ...rolEditable,
                                      permisos: nuevosPermisos,
                                    });
                                  }}
                                />
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex justify-end gap-2 mt-4">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => setRolEditable(null)}
                    >
                      Cancelar
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Guardar Cambios
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Roles;
