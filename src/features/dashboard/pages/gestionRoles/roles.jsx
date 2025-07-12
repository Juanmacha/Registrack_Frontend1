// pages/gestionRoles/index.jsx
import React, { useEffect, useState } from "react";
import TablaRoles from "./components/tablaRoles";
import CrearRolModal from "./components/crearRol";
import EditarRolModal from "./components/editarRol";
import DetalleRolModal from "./components/verRol";

import {
  mostrarMensajeExito,
  mostrarMensajeError,
} from "../../../../utils/alerts";
import { modelosDisponibles, guardarRoles } from "./services/rolesG";
import { RoleService } from "../../../../utils/mockDataService";

const GestionRoles = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [rolEditable, setRolEditable] = useState(null);

  const [nuevoRol, setNuevoRol] = useState({
    nombre: "",
    estado: "Activo",
    permisos: {},
  });

  useEffect(() => {
    // Cargar roles desde el sistema centralizado
    const rolesCentralizados = RoleService.getAll();
    setRoles(rolesCentralizados);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoRol.nombre.trim() !== "") {
      // Usar RoleService para crear el rol
      const rolCreado = RoleService.create(nuevoRol);
      if (rolCreado) {
        setRoles(RoleService.getAll());
        setNuevoRol({ nombre: "", estado: "Activo", permisos: {} });
        setShowModal(false);
        mostrarMensajeExito("¡Rol creado exitosamente!");
      } else {
        mostrarMensajeError("Error al crear el rol.");
      }
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

  const handleActualizarRoles = () => {
    setRoles(RoleService.getAll());
  };

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full px-4">
        <div className="flex justify-between items-center mt-4 mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Gestión de Roles</h1>
          <div className="flex gap-3">
            <button
              className="btn btn-secondary px-4 py-2 text-sm rounded-md"
              onClick={handleActualizarRoles}
            >
              <i className="bi bi-arrow-clockwise"></i> Actualizar
            </button>
            <button
              className="btn btn-primary px-4 py-2 text-sm rounded-md"
              onClick={() => setShowModal(true)}
            >
              <i className="bi bi-plus"></i> Crear Rol
            </button>
          </div>
        </div>

        <TablaRoles
          roles={roles}
          setRolEditable={setRolEditable}
          setRolSeleccionado={setRolSeleccionado}
          setRoles={setRoles}
        />

        <CrearRolModal
          showModal={showModal}
          setShowModal={setShowModal}
          nuevoRol={nuevoRol}
          setNuevoRol={setNuevoRol}
          handleSubmit={handleSubmit}
          handleCheckboxChange={handleCheckboxChange}
          modelosDisponibles={modelosDisponibles}
        />

        {rolSeleccionado && (
          <DetalleRolModal
            rol={rolSeleccionado}
            onClose={() => setRolSeleccionado(null)}
            modelosDisponibles={modelosDisponibles}
          />
        )}

        {rolEditable && (
          <EditarRolModal
            rolEditable={rolEditable}
            setRolEditable={setRolEditable}
            roles={roles}
            setRoles={setRoles}
          />
        )}
      </div>
    </div>
  );
};

export default GestionRoles;
