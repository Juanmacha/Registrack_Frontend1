import React, { useState, useEffect } from 'react';

const EditarVenta = ({ datos, isOpen, onClose, onGuardar }) => {
  const [formData, setFormData] = useState({
    id: '',
    expediente: '',
    fechaSolicitud: '',
    tipoSolicitud: '',
    tipoPersona: '',
    titular: '',
    marca: '',
    encargado: '',
    proximaCita: '',
    estado: ''
  });

  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (datos) {
      setFormData(datos);
      setErrors({});
    }
  }, [datos]);

  const validateForm = () => {
    const newErrors = {};
    if (!formData.expediente) newErrors.expediente = 'El expediente es requerido';
    if (!formData.titular) newErrors.titular = 'El titular es requerido';
    if (!formData.marca) newErrors.marca = 'La marca es requerida';
    if (!formData.encargado) newErrors.encargado = 'El encargado es requerido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      onGuardar(formData);
    }
  };

  if (!isOpen) return null;

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
              <h2 className="text-xl font-semibold text-gray-800">Editar Solicitud</h2>
              <p className="text-sm text-gray-500">Expediente: {formData.expediente}</p>
            </div>
          </div>
        </div>

        {/* Formulario en dos columnas */}
        <form onSubmit={handleSubmit} className="pt-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Campo: Expediente */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-file-text text-gray-400 mr-2"></i>
                Expediente *
              </label>
              <input
                type="text"
                name="expediente"
                value={formData.expediente}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${
                  errors.expediente ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.expediente && <p className="text-sm text-red-600">{errors.expediente}</p>}
            </div>

            {/* Campo: Fecha de Solicitud */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-calendar text-gray-400 mr-2"></i>
                Fecha de Solicitud
              </label>
              <input
                type="date"
                name="fechaSolicitud"
                value={formData.fechaSolicitud}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 bg-gray-100 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Campo: Titular */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person text-gray-400 mr-2"></i>
                Titular *
              </label>
              <input
                type="text"
                name="titular"
                value={formData.titular}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${
                  errors.titular ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.titular && <p className="text-sm text-red-600">{errors.titular}</p>}
            </div>

            {/* Campo: Marca */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-building text-gray-400 mr-2"></i>
                Marca *
              </label>
              <input
                type="text"
                name="marca"
                value={formData.marca}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${
                  errors.marca ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.marca && <p className="text-sm text-red-600">{errors.marca}</p>}
            </div>

            {/* Campo: Tipo de Persona */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person-badge text-gray-400 mr-2"></i>
                Tipo de Persona
              </label>
              <select
                name="tipoPersona"
                value={formData.tipoPersona}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Seleccionar</option>
                <option value="Natural">Natural</option>
                <option value="Jurídica">Jurídica</option>
              </select>
            </div>

            {/* Campo: Tipo de Solicitud */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-file-earmark-text text-gray-400 mr-2"></i>
                Tipo de Solicitud
              </label>
              <select
                name="tipoSolicitud"
                value={formData.tipoSolicitud}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500 bg-white"
              >
                <option value="">Seleccionar</option>
                <option value="Registro">Registro</option>
                <option value="Renovación">Renovación</option>
              </select>
            </div>

            {/* Campo: Encargado */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                <i className="bi bi-person-workspace text-gray-400 mr-2"></i>
                Encargado *
              </label>
              <input
                type="text"
                name="encargado"
                value={formData.encargado}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded-lg shadow-sm bg-gray-100 focus:ring-2 focus:ring-blue-500 ${
                  errors.encargado ? 'border-red-500' : 'border-gray-300'
                }`}
              />
              {errors.encargado && <p className="text-sm text-red-600">{errors.encargado}</p>}
            </div>

            {/* Campo: Estado */}
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
                <option value="">Seleccionar</option>
                <option value="En revisión">En revisión</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Pendiente firma">Pendiente firma</option>
                <option value="Finalizado">Finalizado</option>
                <option value="Anulado">Anulado</option>
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
                onClick={onClose}
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

export default EditarVenta;
