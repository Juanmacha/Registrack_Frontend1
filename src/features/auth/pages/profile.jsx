import React, { useEffect, useState } from "react";
import {
  BiUser,
  BiIdCard,
  BiEnvelope,
  BiEditAlt,
  BiSave,
  BiX,
  BiLock,
  BiShow,
  BiHide,
  BiArrowBack
} from "react-icons/bi";
import authData from "../services/authData";
import { mostrarMensajeExito } from "../../../utils/alerts";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [usuario, setUsuario] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({});
  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});
  const [saving, setSaving] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authData.getUser();
    setUsuario(user);
    setFormData({ ...user, password: "" });
  }, []);

  const documentExists = (documentNumber) => {
    const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
    return usuarios.some(
      (user) => user.documentNumber === documentNumber && user.documentNumber !== usuario?.documentNumber
    );
  };

  const validate = (data = formData) => {
    const errs = {};
    if (!data.firstName?.trim()) errs.firstName = "Nombre requerido";
    else if (data.firstName.trim().length < 2) errs.firstName = "Mínimo 2 caracteres";

    if (!data.lastName?.trim()) errs.lastName = "Apellido requerido";
    else if (data.lastName.trim().length < 2) errs.lastName = "Mínimo 2 caracteres";

    if (!data.documentType?.trim()) errs.documentType = "Tipo de documento requerido";

    if (!data.documentNumber?.trim()) errs.documentNumber = "Número requerido";
    else if (!/^\d{7,10}$/.test(data.documentNumber)) errs.documentNumber = "7-10 dígitos requeridos";
    else if (documentExists(data.documentNumber)) errs.documentNumber = "Ya está registrado";

    if (data.password && data.password.length < 6) errs.password = "Mínimo 6 caracteres";

    return errs;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    const cleanedValue = name === "documentNumber" ? value.replace(/\D/g, "") : value;
    const updatedFormData = { ...formData, [name]: cleanedValue };
    setFormData(updatedFormData);
    setErrors(validate(updatedFormData));
  };

  const handleEdit = () => {
    setEditMode(true);
    setTouched({});
    setErrors({});
  };

  const handleCancel = () => {
    setEditMode(false);
    setFormData({ ...usuario, password: "" });
    setErrors({});
    setTouched({});
  };

  const handleSave = () => {
    const cleanedData = {
      firstName: formData.firstName.trim(),
      lastName: formData.lastName.trim(),
      documentType: formData.documentType.trim(),
      documentNumber: formData.documentNumber.trim(),
      email: formData.email,
      password: formData.password
    };
    const errs = validate(cleanedData);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    const updatedUser = { ...usuario, ...cleanedData };
    if (!cleanedData.password) delete updatedUser.password;
    localStorage.setItem("usuario", JSON.stringify(updatedUser));
    setUsuario(updatedUser);
    setEditMode(false);
    mostrarMensajeExito("Perfil actualizado exitosamente");
  };

  if (!usuario) return <div className="min-h-screen flex items-center justify-center">Cargando perfil...</div>;

  return (
    <div className="min-h-[85vh] bg-gradient-to-br from-gray-50 to-blue-70 p-4">
      <div className="max-w-3xl mx-auto space-y-4">
        <div className="bg-white rounded-xl shadow-md border border-gray-200 overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-blue-800 px-4 py-6 text-center relative">
            <button
              className="absolute top-4 left-4 bg-white/80 hover:bg-blue-100 text-blue-700 rounded-full p-2"
              onClick={() => navigate(-1)}
            >
              <BiArrowBack size={22} />
            </button>
            <div className="w-20 h-20 mx-auto rounded-full border-4 border-white overflow-hidden">
              <img
                src={`https://api.dicebear.com/7.x/initials/svg?seed=${usuario.firstName} ${usuario.lastName}`}
                alt="Avatar"
                className="w-full h-full object-cover"
              />
            </div>
            <h1 className="text-xl font-bold text-white mt-2">
              {editMode ? "Editar Perfil" : "Mi Perfil"}
            </h1>
            <h2 className="text-white">{usuario.firstName} {usuario.lastName}</h2>
          </div>

          <div className="p-4 max-h-[65vh] overflow-y-auto">
            {editMode ? (
              <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <label>Nombre</label>
                    <input name="firstName" value={formData.firstName} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>
                  <div>
                    <label>Apellido</label>
                    <input name="lastName" value={formData.lastName} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                  <div>
                    <label>Tipo de Documento</label>
                    <select name="documentType" value={formData.documentType} onChange={handleChange} className="w-full border px-3 py-2 rounded">
                      <option value="">Seleccionar...</option>
                      <option value="CC">Cédula</option>
                      <option value="TI">Tarjeta de identidad</option>
                    </select>
                    {errors.documentType && <p className="text-red-500 text-sm">{errors.documentType}</p>}
                  </div>
                  <div>
                    <label>Número de Documento</label>
                    <input name="documentNumber" value={formData.documentNumber} onChange={handleChange} className="w-full border px-3 py-2 rounded" />
                    {errors.documentNumber && <p className="text-red-500 text-sm">{errors.documentNumber}</p>}
                  </div>
                  <div>
                    <label>Correo</label>
                    <input value={formData.email} readOnly className="w-full border px-3 py-2 rounded bg-gray-100" />
                  </div>
                  <div>
                    <label>Contraseña (opcional)</label>
                    <input
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      type={showPassword ? "text" : "password"}
                      className="w-full border px-3 py-2 rounded"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)}>
                      {showPassword ? <BiHide /> : <BiShow />}
                    </button>
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <button type="button" onClick={handleCancel} className="px-4 py-2 bg-gray-300 rounded">Cancelar</button>
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded">Guardar</button>
                </div>
              </form>
            ) : (
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <p><strong>Nombre:</strong> {usuario.firstName}</p>
                  <p><strong>Apellido:</strong> {usuario.lastName}</p>
                  <p><strong>Correo:</strong> {usuario.email}</p>
                </div>
                <div>
                  <p><strong>Tipo Doc:</strong> {usuario.documentType}</p>
                  <p><strong>Documento:</strong> {usuario.documentNumber}</p>
                  <p><strong>Contraseña:</strong> ********</p>
                </div>
              </div>
            )}
          </div>

          {!editMode && (
            <div className="p-4 text-right">
              <button
                onClick={handleEdit}
                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
              >
                <BiEditAlt className="inline mr-1" /> Editar
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;