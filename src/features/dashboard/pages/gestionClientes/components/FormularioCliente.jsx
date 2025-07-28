import React, { useState, useEffect } from "react";

const FormularioCliente = ({
  cliente,
  onGuardar,
  onClose,
  modoEdicion = false,
  rolUsuario = "administrador" // "empleado" o "administrador"
}) => {
  // Estado del formulario
  const [form, setForm] = useState({
    tipoDocumento: "",
    documento: "",
    nombre: "",
    apellido: "",
    email: "",
    telefono: "",
    nitEmpresa: "",
    nombreEmpresa: "",
    marca: "",
    tipoPersona: "",
    estado: "Activo"
  });
  const [errores, setErrores] = useState({});
  const [touched, setTouched] = useState({});
  const [formSubmitted, setFormSubmitted] = useState(false);

  useEffect(() => {
    if (modoEdicion && cliente) {
      setForm({ ...cliente });
    }
  }, [modoEdicion, cliente]);

  // Validaciones
  const validarCampos = () => {
    const nuevosErrores = {};
    if (!form.tipoDocumento) nuevosErrores.tipoDocumento = "El tipo de documento es obligatorio.";
    if (!form.documento || isNaN(form.documento)) {
      nuevosErrores.documento = "El número de documento debe ser válido.";
    } else if (form.documento.length < 7 || form.documento.length > 10) {
      nuevosErrores.documento = "El número de documento debe tener entre 7 y 10 dígitos.";
    }
    if (!form.nombre || form.nombre.trim().length < 2) nuevosErrores.nombre = "El nombre es obligatorio y debe tener al menos 2 letras.";
    if (!form.apellido || form.apellido.trim().length < 2) nuevosErrores.apellido = "El apellido es obligatorio.";
    if (!form.email || !/\S+@\S+\.\S+/.test(form.email)) nuevosErrores.email = "El email no es válido.";
    if (!form.telefono || form.telefono.length < 7) nuevosErrores.telefono = "El teléfono es obligatorio y debe tener al menos 7 dígitos.";
    if (!form.nitEmpresa) nuevosErrores.nitEmpresa = "El NIT de la empresa es obligatorio.";
    if (!form.nombreEmpresa) nuevosErrores.nombreEmpresa = "El nombre de la empresa es obligatorio.";
    if (!form.marca) nuevosErrores.marca = "La marca es obligatoria.";
    if (!form.tipoPersona) nuevosErrores.tipoPersona = "El tipo de persona es obligatorio.";
    setErrores(nuevosErrores);
    return Object.keys(nuevosErrores).length === 0;
  };

  // Manejar cambios
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  // Manejar onBlur para marcar el campo como tocado
  const handleBlur = (e) => {
    setTouched((prev) => ({ ...prev, [e.target.name]: true }));
  };

  // Helper para mostrar error solo si el campo fue tocado o se intentó enviar el form
  const mostrarError = (campo) => (touched[campo] || formSubmitted) && errores[campo];

  // Submit
  const handleSubmit = (e) => {
    e.preventDefault();
    setFormSubmitted(true);
    if (!validarCampos()) return;
    onGuardar(form);
  };

  // Determinar si el campo debe estar deshabilitado
  const isDisabled = (campo) => {
    if (rolUsuario === "administrador") return false;
    // Empleado solo puede editar email y telefono
    return !["email", "telefono"].includes(campo);
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl p-6 overflow-y-auto" style={{ maxHeight: '90vh' }}>
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-person-badge text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">{modoEdicion ? "Editar Cliente" : "Registrar Cliente"}</h2>
              <p className="text-sm text-gray-500">{modoEdicion ? `Editando: ${form.nombre} ${form.apellido}` : "Llena los campos para crear un cliente"}</p>
            </div>
          </div>
        </div>
        {/* Formulario */}
        <form onSubmit={handleSubmit} className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Tipo de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-card-text text-gray-400 mr-2"></i>
                Tipo de Documento <span className="text-gray-500">*</span>
              </label>
              <select
                name="tipoDocumento"
                value={form.tipoDocumento}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white ${mostrarError('tipoDocumento') ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isDisabled("tipoDocumento")}
              >
                <option value="">Tipo de documento</option>
                <option value="CC">Cédula de ciudadanía (CC)</option>
                <option value="TI">Tarjeta de identidad (TI)</option>
                <option value="PA">Pasaporte (PA)</option>
                <option value="PEP">Permiso Especial de Permanencia (PEP)</option>
                <option value="NIT">Número de Identificación Tributaria (NIT)</option>
              </select>
              {mostrarError('tipoDocumento') && <p className="text-red-600 text-sm mt-1">{errores.tipoDocumento}</p>}
            </div>
            {/* Número de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-123 text-gray-400 mr-2"></i>
                Número de Documento <span className="text-gray-500">*</span>
              </label>
              <input
                type="text"
                name="documento"
                value={form.documento}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('documento') ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isDisabled("documento")}
              />
              {mostrarError('documento') && <p className="text-red-600 text-sm mt-1">{errores.documento}</p>}
            </div>
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person text-gray-400 mr-2"></i>
                Nombre <span className="text-gray-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={form.nombre}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('nombre') ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isDisabled("nombre")}
              />
              {mostrarError('nombre') && <p className="text-red-600 text-sm mt-1">{errores.nombre}</p>}
            </div>
            {/* Apellido */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Apellido <span className="text-gray-500">*</span>
              </label>
              <input
                type="text"
                name="apellido"
                value={form.apellido}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('apellido') ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isDisabled("apellido")}
              />
              {mostrarError('apellido') && <p className="text-red-600 text-sm mt-1">{errores.apellido}</p>}
            </div>
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-envelope text-gray-400 mr-2"></i>
                Email <span className="text-gray-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('email') ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isDisabled("email")}
              />
              {mostrarError('email') && <p className="text-red-600 text-sm mt-1">{errores.email}</p>}
            </div>
            {/* Teléfono */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-telephone text-gray-400 mr-2"></i>
                Teléfono <span className="text-gray-500">*</span>
              </label>
              <input
                type="text"
                name="telefono"
                value={form.telefono}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('telefono') ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isDisabled("telefono")}
              />
              {mostrarError('telefono') && <p className="text-red-600 text-sm mt-1">{errores.telefono}</p>}
            </div>
            {/* NIT Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-building text-gray-400 mr-2"></i>
                NIT Empresa <span className="text-gray-500">*</span>
              </label>
              <input
                type="text"
                name="nitEmpresa"
                value={form.nitEmpresa}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('nitEmpresa') ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isDisabled("nitEmpresa")}
              />
              {mostrarError('nitEmpresa') && <p className="text-red-600 text-sm mt-1">{errores.nitEmpresa}</p>}
            </div>
            {/* Nombre Empresa */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-building text-gray-400 mr-2"></i>
                Nombre Empresa <span className="text-gray-500">*</span>
              </label>
              <input
                type="text"
                name="nombreEmpresa"
                value={form.nombreEmpresa}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('nombreEmpresa') ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isDisabled("nombreEmpresa")}
              />
              {mostrarError('nombreEmpresa') && <p className="text-red-600 text-sm mt-1">{errores.nombreEmpresa}</p>}
            </div>
            {/* Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-award text-gray-400 mr-2"></i>
                Marca <span className="text-gray-500">*</span>
              </label>
              <input
                type="text"
                name="marca"
                value={form.marca}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${mostrarError('marca') ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isDisabled("marca")}
              />
              {mostrarError('marca') && <p className="text-red-600 text-sm mt-1">{errores.marca}</p>}
            </div>
            {/* Tipo de Persona */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person-badge text-gray-400 mr-2"></i>
                Tipo de Persona <span className="text-gray-500">*</span>
              </label>
              <select
                name="tipoPersona"
                value={form.tipoPersona}
                onChange={handleChange}
                onBlur={handleBlur}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white ${mostrarError('tipoPersona') ? 'border-red-500' : 'border-gray-300'}`}
                required
                disabled={isDisabled("tipoPersona")}
              >
                <option value="">Seleccionar tipo...</option>
                <option value="Natural">Natural</option>
                <option value="Jurídica">Jurídica</option>
              </select>
              {mostrarError('tipoPersona') && <p className="text-red-600 text-sm mt-1">{errores.tipoPersona}</p>}
            </div>
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
                {modoEdicion ? "Guardar Cambios" : "Registrar Cliente"}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default FormularioCliente; 