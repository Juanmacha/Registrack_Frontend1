import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import TablaUsuarios from "./components/tablaUsuarios";
import FormularioUsuario from "./components/FormularioUsuario";
import VerDetalleUsuario from "./components/verDetalleUsuario";
import { UserService, initializeMockData } from "../../../../utils/mockDataService.js";
import { validarUsuario } from "./services/validarUsuario";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const CAMPOS_REQUERIDOS = [
  "firstName", "lastName", "documentType", "documentNumber", "email", "password", "role"
];

const GestionUsuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [nuevoUsuario, setNuevoUsuario] = useState({
    documentType: "",
    documentNumber: "",
    firstName: "",
    lastName: "",
    email: "",
    role: "usuario"
  });
  const [mostrarModal, setMostrarModal] = useState(false);
  const [mostrarModalVer, setMostrarModalVer] = useState(false);
  const [modoEdicion, setModoEdicion] = useState(false);
  const [usuarioSeleccionado, setUsuarioSeleccionado] = useState(null);
  const [indiceEditar, setIndiceEditar] = useState(null);
  const [busqueda, setBusqueda] = useState("");
  const [paginaActual, setPaginaActual] = useState(1);
  const usuariosPorPagina = 5;

  useEffect(() => {
    initializeMockData();
    const usuariosData = UserService.getAll();
    setUsuarios(usuariosData);
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNuevoUsuario(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleGuardarUsuario = (e) => {
    e.preventDefault();
    console.log("Guardando usuario:", nuevoUsuario);
    console.log("Modo edición:", modoEdicion);
    console.log("Índice editar:", indiceEditar);
    console.log("Usuario seleccionado:", usuarioSeleccionado);
    
    const esValido = validarUsuario(nuevoUsuario);
    if (!esValido) return;
    
    if (modoEdicion && usuarioSeleccionado !== null && indiceEditar !== null) {
      console.log("Actualizando usuario en índice:", indiceEditar);
      const usuarioActualizado = UserService.update(usuarioSeleccionado.id, nuevoUsuario);
      if (usuarioActualizado) {
        const usuariosActualizados = UserService.getAll();
        setUsuarios(usuariosActualizados);
        console.log("Usuario actualizado exitosamente");
      }
    } else {
      console.log("Creando nuevo usuario");
      const nuevoUsuarioCreado = UserService.create(nuevoUsuario);
      if (nuevoUsuarioCreado) {
        const usuariosActualizados = UserService.getAll();
        setUsuarios(usuariosActualizados);
      }
    }
    Swal.fire({
      icon: "success",
      title: modoEdicion ? "Usuario actualizado exitosamente" : "Usuario registrado exitosamente",
      confirmButtonText: "OK",
    });
    setModoEdicion(false);
    setUsuarioSeleccionado(null);
    setIndiceEditar(null);
    setMostrarModal(false);
    setNuevoUsuario({
      documentType: "",
      documentNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "usuario"
    });
  };

  const handleDelete = (usuario) => {
    Swal.fire({
      title: "¿Estás seguro?",
      text: "No podrás revertir esta acción",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar"
    }).then((result) => {
      if (result.isConfirmed) {
        const eliminado = UserService.delete(usuario.id);
        if (eliminado) {
          const usuariosActualizados = UserService.getAll();
          setUsuarios(usuariosActualizados);
          Swal.fire("Eliminado", "El usuario ha sido eliminado.", "success");
        }
      }
    });
  };

  function normalizarTexto(texto) {
    return texto.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  }

  const usuariosFiltrados = usuarios.filter((u) => {
    const texto = `${u.documentType} ${u.documentNumber} ${u.firstName} ${u.lastName} ${u.email} ${u.role}`;
    return normalizarTexto(texto).includes(normalizarTexto(busqueda));
  });

  const totalPaginas = Math.ceil(usuariosFiltrados.length / usuariosPorPagina);
  const indiceInicio = (paginaActual - 1) * usuariosPorPagina;
  const indiceFin = indiceInicio + usuariosPorPagina;
  const usuariosPagina = usuariosFiltrados.slice(indiceInicio, indiceFin);

  const irAPagina = (num) => {
    if (num >= 1 && num <= totalPaginas) setPaginaActual(num);
  };

  const handleVer = (usuario) => {
    setUsuarioSeleccionado(usuario);
    setMostrarModalVer(true);
  };

  const handleEditar = (usuario, idx) => {
    // Encontrar el índice real del usuario en el array completo de usuarios
    const indiceReal = usuarios.findIndex(u => 
      u.documentNumber === usuario.documentNumber && 
      u.email === usuario.email
    );
    
    console.log("Editando usuario:", usuario);
    console.log("Índice real encontrado:", indiceReal);
    
    setNuevoUsuario(usuario);
    setModoEdicion(true);
    setUsuarioSeleccionado(usuario);
    setIndiceEditar(indiceReal);
    setMostrarModal(true);
  };

  const handleAbrirCrear = () => {
    setNuevoUsuario({
      documentType: "",
      documentNumber: "",
      firstName: "",
      lastName: "",
      email: "",
      role: "usuario"
    });
    setModoEdicion(false);
    setUsuarioSeleccionado(null);
    setIndiceEditar(null);
    setMostrarModal(true);
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
            <button className="btn btn-primary px-4 py-2 text-sm rounded-md whitespace-nowrap" onClick={handleAbrirCrear}>
              <i className="bi bi-plus-square"></i> Crear Usuario
            </button>
          </div>
        </div>

        <TablaUsuarios
          usuarios={usuariosPagina}
          handleDelete={handleDelete}
          onVer={handleVer}
          onEditar={handleEditar}
          deshabilitarAcciones={mostrarModal || mostrarModalVer}
          mostrarBusqueda={false}
          mostrarPaginacion={false}
        />

        <div className="flex items-center justify-between px-4 py-3 bg-white border-t border-gray-200">
          <div className="text-sm text-gray-700">
            Mostrando <span className="font-medium">{indiceInicio + 1}</span> a
            <span className="font-medium"> {Math.min(indiceFin, usuariosFiltrados.length)}</span> de
            <span className="font-medium"> {usuariosFiltrados.length}</span> resultados
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

        {mostrarModal && (
          <div className="absolute top-0 left-0 w-full h-full flex items-center justify-center z-50">
            <div className="absolute inset-0 backdrop-blur-sm"></div>
            <div className="relative bg-white rounded-lg shadow-2xl p-8 w-full max-w-2xl border border-gray-200">
              <h2 className="text-xl font-semibold mb-4">{modoEdicion ? "Editar Usuario" : "Agregar Nuevo Usuario"}</h2>
              <FormularioUsuario
                nuevoUsuario={nuevoUsuario}
                handleInputChange={handleInputChange}
                handleGuardarUsuario={handleGuardarUsuario}
                modoEdicion={modoEdicion}
                usuarioEditar={usuarioSeleccionado}
                onClose={() => setMostrarModal(false)}
              />
              <div className="flex items-center justify-end pt-6 border-t border-gray-200 mt-6">
                <button
                  type="button"
                  onClick={() => setMostrarModal(false)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 mr-2"
                >
                  Cancelar
                </button>
                <button
                  type="button"
                  onClick={handleGuardarUsuario}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
                >
                  {modoEdicion ? "Guardar Cambios" : "Registrar Usuario"}
                </button>
              </div>
            </div>
          </div>
        )}

        <VerDetalleUsuario
          usuario={usuarioSeleccionado}
          isOpen={mostrarModalVer}
          onClose={() => setMostrarModalVer(false)}
        />
      </div>
    </div>
  );
};

export default GestionUsuarios;
