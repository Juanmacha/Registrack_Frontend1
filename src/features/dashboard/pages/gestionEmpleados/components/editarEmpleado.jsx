import React, { useEffect, useState } from "react";

const EditarEmpleadoModal = ({
  showModal,
  setShowModal,
  empleadoEditando,
  handleActualizarEmpleado,
}) => {
  const [formData, setFormData] = useState({
    id: "",
    nombre: "",
    apellidos: "",
    tipoDocumento: "",
    documento: "",
    correo: "",
    rol: "",
    estado: "activo",
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (empleadoEditando) {
      setFormData((prev) => ({
        ...prev,
        ...empleadoEditando,
      }));
      setErrors({});
    }
  }, [empleadoEditando]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.nombre) newErrors.nombre = "El nombre es requerido";
    if (!formData.apellidos) newErrors.apellidos = "Los apellidos son requeridos";
    if (!formData.tipoDocumento) newErrors.tipoDocumento = "Seleccione el tipo de documento";
    if (!formData.documento) newErrors.documento = "El documento es requerido";
    if (!formData.correo) newErrors.correo = "El correo es requerido";
    if (!formData.rol) newErrors.rol = "El rol es requerido";
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      handleActualizarEmpleado(formData);
    }
  };

  if (!showModal) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-5xl p-6 overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-pencil-square text-blue-600 text-xl"></i>
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Editar Empleado</h2>
              <p className="text-sm text-gray-500">ID: {formData.id || "N/A"}</p>
            </div>
          </div>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Nombre */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person text-gray-400 mr-2"></i>
                Nombre *
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${
                  errors.nombre ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.nombre && <p className="text-sm text-red-600">{errors.nombre}</p>}
            </div>

            {/* Apellidos */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person-vcard text-gray-400 mr-2"></i>
                Apellidos *
              </label>
              <input
                type="text"
                name="apellidos"
                value={formData.apellidos}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${
                  errors.apellidos ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.apellidos && <p className="text-sm text-red-600">{errors.apellidos}</p>}
            </div>

            {/* Tipo de Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-card-list text-gray-400 mr-2"></i>
                Tipo de Documento *
              </label>
              <select
                name="tipoDocumento"
                value={formData.tipoDocumento}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-white focus:ring-2 focus:ring-blue-500 ${
                  errors.tipoDocumento ? "border-red-500" : "border-gray-300"
                }`}
              >
                <option value="">Seleccionar</option>
                <option value="CC">Cédula de ciudadanía</option>
                <option value="TI">Tarjeta de identidad</option>
                <option value="CE">Cédula de extranjería</option>
                <option value="PA">Pasaporte</option>
              </select>
              {errors.tipoDocumento && <p className="text-sm text-red-600">{errors.tipoDocumento}</p>}
            </div>

            {/* Documento */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-hash text-gray-400 mr-2"></i>
                Número de Documento *
              </label>
              <input
                type="text"
                name="documento"
                value={formData.documento}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${
                  errors.documento ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.documento && <p className="text-sm text-red-600">{errors.documento}</p>}
            </div>

            {/* Correo */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-envelope text-gray-400 mr-2"></i>
                Correo *
              </label>
              <input
                type="email"
                name="correo"
                value={formData.correo}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${
                  errors.correo ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.correo && <p className="text-sm text-red-600">{errors.correo}</p>}
            </div>

            {/* Rol */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person-badge text-gray-400 mr-2"></i>
                Rol *
              </label>
              <input
                type="text"
                name="rol"
                value={formData.rol}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${
                  errors.rol ? "border-red-500" : "border-gray-300"
                }`}
              />
              {errors.rol && <p className="text-sm text-red-600">{errors.rol}</p>}
            </div>

            {/* Estado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-flag text-gray-400 mr-2"></i>
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="activo">Activo</option>
                <option value="inactivo">Inactivo</option>
              </select>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-500 flex items-center">
              <i className="bi bi-exclamation-circle text-gray-400 mr-2"></i>
              * Campos requeridos
            </p>
            <div className="flex space-x-3">
              <button
                type="button"
                onClick={() => setShowModal(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
              >
                Guardar Cambios
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditarEmpleadoModal;
