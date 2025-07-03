import React, { useState, useEffect } from "react";
import { BiHide, BiShow } from "react-icons/bi";
import { validarUsuario } from "../services/validarUsuario";

const FormularioUsuario = ({
  nuevoUsuario,
  handleInputChange,
  handleGuardarUsuario,
  modoEdicion = false,
  usuarioEditar,
  onClose
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");
  const [errores, setErrores] = useState({});
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (modoEdicion && usuarioEditar) {
      handleInputChange({ target: { name: "documentType", value: usuarioEditar.documentType } });
      handleInputChange({ target: { name: "documentNumber", value: usuarioEditar.documentNumber } });
      handleInputChange({ target: { name: "firstName", value: usuarioEditar.firstName } });
      handleInputChange({ target: { name: "lastName", value: usuarioEditar.lastName } });
      handleInputChange({ target: { name: "email", value: usuarioEditar.email } });
      handleInputChange({ target: { name: "role", value: usuarioEditar.role } });
    }
    // eslint-disable-next-line
  }, [modoEdicion, usuarioEditar]);

  // Validación en tiempo real
  useEffect(() => {
    if (!modoEdicion) {
      validarCampos();
    }
    // eslint-disable-next-line
  }, [nuevoUsuario, confirmarPassword]);

  const handlePasswordChange = (e) => {
    handleInputChange(e);
    if (confirmarPassword && e.target.value !== confirmarPassword) {
      setErrorPassword("Las contraseñas no coinciden");
    } else {
      setErrorPassword("");
    }
  };

  const handleConfirmarChange = (e) => {
    setConfirmarPassword(e.target.value);
    if (nuevoUsuario.password !== e.target.value) {
      setErrorPassword("Las contraseñas no coinciden");
    } else {
      setErrorPassword("");
    }
  };

  const validarCampos = () => {
    const nuevosErrores = {};
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    // Para edición, excluir el usuario actual de la validación de unicidad
    const usuarioActualEmail = modoEdicion && usuarioEditar ? usuarioEditar.email : null;
    const usuarioActualDoc = modoEdicion && usuarioEditar ? usuarioEditar.documentNumber : null;

    if (!nuevoUsuario.documentType) nuevosErrores.documentType = "El tipo de documento es obligatorio.";
    if (!nuevoUsuario.documentNumber || isNaN(nuevoUsuario.documentNumber)) {
      nuevosErrores.documentNumber = "El número de documento debe ser válido.";
    } else if (nuevoUsuario.documentNumber.length < 7 || nuevoUsuario.documentNumber.length > 10) {
      nuevosErrores.documentNumber = "El número de documento debe tener entre 7 y 10 dígitos.";
    }
    if (!nuevoUsuario.firstName || nuevoUsuario.firstName.trim().length < 2) nuevosErrores.firstName = "El nombre es obligatorio y debe tener al menos 2 letras.";
    if (!nuevoUsuario.lastName || nuevoUsuario.lastName.trim().length < 2) nuevosErrores.lastName = "El apellido es obligatorio.";
    if (!nuevoUsuario.email || !/\S+@\S+\.\S+/.test(nuevoUsuario.email)) nuevosErrores.email = "El email no es válido.";
    if (!nuevoUsuario.role) nuevosErrores.role = "El rol es obligatorio.";

    // Validar unicidad de email y documento en ambos modos
    if (usuarios.some(u => u.email === nuevoUsuario.email && u.email !== usuarioActualEmail)) {
      nuevosErrores.email = "El correo ya está registrado.";
    }
    if (usuarios.some(u => u.documentNumber === nuevoUsuario.documentNumber && u.documentNumber !== usuarioActualDoc)) {
      nuevosErrores.documentNumber = "El número de documento ya está registrado.";
    }

    if (!modoEdicion) {
      if (!nuevoUsuario.password || nuevoUsuario.password.length < 6) nuevosErrores.password = "La contraseña es obligatoria y debe tener al menos 6 caracteres.";
      else if (/\s/.test(nuevoUsuario.password)) nuevosErrores.password = "La contraseña no debe contener espacios en blanco.";
      if (!confirmarPassword) nuevosErrores.confirmarPassword = "Debes confirmar la contraseña.";
      else if (nuevoUsuario.password !== confirmarPassword) nuevosErrores.confirmarPassword = "Las contraseñas no coinciden.";
      else if (/\s/.test(confirmarPassword)) nuevosErrores.confirmarPassword = "La confirmación no debe contener espacios en blanco.";
    }
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar onBlur para marcar el campo como tocado
  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // Modificar handleInputChange para validar en tiempo real
  const handleInputChangeRealtime = (e) => {
    handleInputChange(e);
    if (!modoEdicion) {
      validarCampos();
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!validarCampos()) return;
    handleGuardarUsuario(e);
  };

  // Helper para mostrar error solo si el campo fue tocado o se intentó enviar el form
  const mostrarError = (campo) => (touched[campo] || formSubmitted) && errores[campo];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-pencil-square text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{modoEdicion ? "Editar Usuario" : "Registrar Usuario"}</h2>
              <p className="text-sm text-gray-500">{modoEdicion ? `Editando: ${usuarioEditar?.firstName} ${usuarioEditar?.lastName}` : "Llena los campos para crear un usuario"}</p>
            </div>
          </div>
          {onClose && (
            <button onClick={onClose} className="text-gray-900 hover:text-red-700 bg-gray-50">
              <i className="bi bi-x-lg"></i>
            </button>
          )}
        </div>

        {/* Formulario en dos columnas */}
        <form onSubmit={handleSubmit} className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Documento */}
  <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-card-text text-gray-400 mr-2"></i>
                Tipo de Documento
              </label>
    <select
      name="documentType"
      value={nuevoUsuario.documentType}
                onChange={handleInputChangeRealtime}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white ${mostrarError('documentType') ? 'border-red-500' : 'border-gray-300'}`}
      required
    >
      <option value="">Seleccionar...</option>
      <option value="CC">Cédula de Ciudadanía</option>
      <option value="CE">Cédula de Extranjería</option>
      <option value="TI">Tarjeta de Identidad</option>
      <option value="PP">Pasaporte</option>
    </select>
              {mostrarError('documentType') && <p className="text-red-600 text-sm mt-1">{errores.documentType}</p>}
  </div>
            {/* Número de Documento */}
  <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-123 text-gray-400 mr-2"></i>
                Número de Documento
              </label>
    <input
      type="text"
      name="documentNumber"
      value={nuevoUsuario.documentNumber}
                onChange={handleInputChangeRealtime}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('documentNumber') ? 'border-red-500' : 'border-gray-300'}`}
      required
    />
              {mostrarError('documentNumber') && <p className="text-red-600 text-sm mt-1">{errores.documentNumber}</p>}
  </div>
            {/* Nombre */}
  <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person text-gray-400 mr-2"></i>
                Nombre
              </label>
    <input
      type="text"
      name="firstName"
      value={nuevoUsuario.firstName}
                onChange={handleInputChangeRealtime}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('firstName') ? 'border-red-500' : 'border-gray-300'}`}
      required
    />
              {mostrarError('firstName') && <p className="text-red-600 text-sm mt-1">{errores.firstName}</p>}
  </div>
            {/* Apellido */}
  <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person text-gray-400 mr-2"></i>
                Apellido
              </label>
    <input
      type="text"
      name="lastName"
      value={nuevoUsuario.lastName}
                onChange={handleInputChangeRealtime}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('lastName') ? 'border-red-500' : 'border-gray-300'}`}
      required
    />
              {mostrarError('lastName') && <p className="text-red-600 text-sm mt-1">{errores.lastName}</p>}
  </div>
            {/* Email */}
  <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-envelope text-gray-400 mr-2"></i>
                Email
              </label>
    <input
      type="email"
      name="email"
      value={nuevoUsuario.email}
                onChange={handleInputChangeRealtime}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('email') ? 'border-red-500' : 'border-gray-300'}`}
      required
    />
              {mostrarError('email') && <p className="text-red-600 text-sm mt-1">{errores.email}</p>}
  </div>
            {/* Rol */}
  <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person-badge text-gray-400 mr-2"></i>
                Rol
              </label>
    <select
      name="role"
      value={nuevoUsuario.role}
                onChange={handleInputChangeRealtime}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white ${mostrarError('role') ? 'border-red-500' : 'border-gray-300'}`}
      required
    >
      <option value="usuario">Usuario</option>
      <option value="administrador">Administrador</option>
    </select>
              {mostrarError('role') && <p className="text-red-600 text-sm mt-1">{errores.role}</p>}
  </div>
            {/* Contraseña y Confirmar Contraseña solo en modo creación */}
            {!modoEdicion && (
              <>
  {/* Contraseña */}
  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <i className="bi bi-lock text-gray-400 mr-2"></i>
                    Contraseña
                  </label>
    <div className="relative">
      <input
        type={mostrarPassword ? "text" : "password"}
        name="password"
        value={nuevoUsuario.password || ""}
        onChange={handlePasswordChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm pr-10 bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('password') ? 'border-red-500' : 'border-gray-300'}`}
        required
      />
      <span
        className="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
        onClick={() => setMostrarPassword((v) => !v)}
      >
        {mostrarPassword ? <BiHide /> : <BiShow />}
      </span>
    </div>
                  {mostrarError('password') && <p className="text-red-600 text-sm mt-1">{errores.password}</p>}
  </div>
  {/* Confirmar contraseña */}
  <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    <i className="bi bi-lock-fill text-gray-400 mr-2"></i>
                    Confirmar Contraseña
                  </label>
    <div className="relative">
      <input
        type={mostrarConfirmar ? "text" : "password"}
        name="confirmarPassword"
        value={confirmarPassword}
        onChange={handleConfirmarChange}
                      onBlur={handleBlur}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm pr-10 bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('confirmarPassword') ? 'border-red-500' : 'border-gray-300'}`}
        required
      />
      <span
        className="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
        onClick={() => setMostrarConfirmar((v) => !v)}
      >
        {mostrarConfirmar ? <BiHide /> : <BiShow />}
      </span>
    </div>
                  {(mostrarError('confirmarPassword') || errorPassword) && <p className="text-red-600 text-sm mt-1">{errores.confirmarPassword || errorPassword}</p>}
                </div>
              </>
    )}
  </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 flex items-center">
              <i className="bi bi-exclamation-circle text-gray-400 mr-2"></i>
              * Todos los campos son obligatorios
            </p>
            <div className="flex space-x-3">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancelar
                </button>
              )}
    <button
      type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
    >
                {modoEdicion ? "Guardar Cambios" : "Registrar Usuario"}
    </button>
            </div>
  </div>
</form>
      </div>
    </div>
  );
};

export default FormularioUsuario;
