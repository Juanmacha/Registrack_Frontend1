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
import { modelosDisponibles, guardarRoles } from "../gestionRoles/services/rolesG";

const GestionRoles = () => {
  const [roles, setRoles] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [rolSeleccionado, setRolSeleccionado] = useState(null);
  const [rolEditable, setRolEditable] = useState(null);

  const [nuevoRol, setNuevoRol] = useState({
    nombre: "",
    estado: "activo",
    permisos: {},
  });

  useEffect(() => {
    const almacenados = JSON.parse(localStorage.getItem("roles")) || [];
    setRoles(almacenados);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoRol.nombre.trim() !== "") {
      guardarRoles(roles, nuevoRol, setRoles);
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

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full px-4">
        <div className="flex justify-end gap-3 mt-4">
          <button
            className="btn btn-primary px-4 py-2 text-sm rounded-md"
            onClick={() => setShowModal(true)}
          >
            <i className="bi bi-plus"></i> Crear Rol
          </button>
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
