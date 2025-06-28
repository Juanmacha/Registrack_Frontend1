import React, { useEffect, useState } from "react";
import { BiHide, BiShow } from "react-icons/bi";

const FormularioUsuario = ({
  nuevoUsuario,
  handleInputChange,
  handleGuardarUsuario,
  modoEdicion = false,
  usuarioEditar,
}) => {
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [mostrarConfirmar, setMostrarConfirmar] = useState(false);
  const [confirmarPassword, setConfirmarPassword] = useState("");
  const [errorPassword, setErrorPassword] = useState("");

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

  const handleSubmit = (e) => {
    e.preventDefault();
    if (nuevoUsuario.password !== confirmarPassword) {
      setErrorPassword("Las contraseñas no coinciden");
      return;
    }
    setErrorPassword("");
    handleGuardarUsuario(e);
  };

  return (
    <form
  onSubmit={handleSubmit}
  className="grid grid-cols-1 sm:grid-cols-2 gap-6 px-4 pt-2"
>
  {/* Columna Izquierda */}
  <div>
    <label className="block text-sm font-semibold mb-1">Tipo de Documento</label>
    <select
      name="documentType"
      value={nuevoUsuario.documentType}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="">Seleccionar...</option>
      <option value="CC">Cédula de Ciudadanía</option>
      <option value="CE">Cédula de Extranjería</option>
      <option value="TI">Tarjeta de Identidad</option>
      <option value="PP">Pasaporte</option>
    </select>
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Número de Documento</label>
    <input
      type="text"
      name="documentNumber"
      value={nuevoUsuario.documentNumber}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Nombre</label>
    <input
      type="text"
      name="firstName"
      value={nuevoUsuario.firstName}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Apellido</label>
    <input
      type="text"
      name="lastName"
      value={nuevoUsuario.lastName}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Email</label>
    <input
      type="email"
      name="email"
      value={nuevoUsuario.email}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      required
    />
  </div>

  <div>
    <label className="block text-sm font-semibold mb-1">Rol</label>
    <select
      name="role"
      value={nuevoUsuario.role}
      onChange={handleInputChange}
      className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
      required
    >
      <option value="usuario">Usuario</option>
      <option value="administrador">Administrador</option>
    </select>
  </div>

  {/* Contraseña */}
  <div>
    <label className="block text-sm font-semibold mb-1">Contraseña</label>
    <div className="relative">
      <input
        type={mostrarPassword ? "text" : "password"}
        name="password"
        value={nuevoUsuario.password || ""}
        onChange={handlePasswordChange}
        className="w-full px-3 py-2 border rounded-md pr-10 focus:ring-2 focus:ring-blue-500"
        required
      />
      <span
        className="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
        onClick={() => setMostrarPassword((v) => !v)}
      >
        {mostrarPassword ? <BiHide /> : <BiShow />}
      </span>
    </div>
  </div>

  {/* Confirmar contraseña */}
  <div>
    <label className="block text-sm font-semibold mb-1">Confirmar Contraseña</label>
    <div className="relative">
      <input
        type={mostrarConfirmar ? "text" : "password"}
        name="confirmarPassword"
        value={confirmarPassword}
        onChange={handleConfirmarChange}
        className="w-full px-3 py-2 border rounded-md pr-10 focus:ring-2 focus:ring-blue-500"
        required
      />
      <span
        className="absolute top-2.5 right-3 text-gray-500 cursor-pointer"
        onClick={() => setMostrarConfirmar((v) => !v)}
      >
        {mostrarConfirmar ? <BiHide /> : <BiShow />}
      </span>
    </div>
    {errorPassword && (
      <p className="text-red-600 text-sm mt-1">{errorPassword}</p>
    )}
  </div>

  {/* Botón de enviar */}
  <div className="col-span-2 text-end">
    <button
      type="submit"
      className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700"
    >
      {modoEdicion ? "Actualizar Usuario" : "Guardar Usuario"}
    </button>
  </div>
</form>

  );
};

export default FormularioUsuario;
