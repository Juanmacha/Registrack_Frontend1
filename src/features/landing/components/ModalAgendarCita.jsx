import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaCommentDots } from "react-icons/fa";
import Swal from "sweetalert2";

const ModalAgendarCita = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fecha: "",
    hora: "",
    mensaje: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Basic validation
    for (const key in formData) {
      if (formData.hasOwnProperty(key) && key !== 'mensaje' && formData[key] === '') {
        Swal.fire({
          icon: 'error',
          title: 'Campo obligatorio',
          text: `El campo ${key} es obligatorio.`
        });
        return;
      }
    }
    console.log("Datos del formulario:", formData);
    Swal.fire({
      icon: 'success',
      title: 'Solicitud enviada',
      text: 'Tu solicitud de cita ha sido enviada con éxito. Pronto nos contactaremos contigo.',
      timer: 3000,
      showConfirmButton: false
    });
    onClose();
    setFormData({ nombre: "", email: "", telefono: "", fecha: "", hora: "", mensaje: "" });
  };

  if (!isOpen) return null;

  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-gray-50 px-4 py-3 border-b border-gray-200 flex items-center justify-between z-10">
            <div className="flex items-center space-x-3">
                <div className="bg-blue-100 p-1.5 rounded-full">
                    <FaCalendarAlt className="text-blue-600 text-lg" />
                </div>
                <div>
                    <h2 className="text-lg font-semibold text-gray-800">Agendar Nueva Cita</h2>
                    <p className="text-xs text-gray-500">Llena los campos para registrar una cita</p>
                </div>
            </div>
            <button
                type="button"
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 text-2xl"
            >
                ×
            </button>
        </div>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Nombre */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <FaUser className="inline text-gray-400 mr-1" /> Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <FaEnvelope className="inline text-gray-400 mr-1" /> Correo Electrónico <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Teléfono */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <FaPhone className="inline text-gray-400 mr-1" /> Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="telefono"
                value={formData.telefono}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Fecha */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <FaCalendarAlt className="inline text-gray-400 mr-1" /> Fecha de la Cita <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                name="fecha"
                value={formData.fecha}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>

            {/* Hora */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <FaClock className="inline text-gray-400 mr-1" /> Hora de la Cita <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              />
            </div>
            
            {/* Mensaje */}
            <div className="md:col-span-2">
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <FaCommentDots className="inline text-gray-400 mr-1" /> Mensaje (Opcional)
              </label>
              <textarea
                name="mensaje"
                value={formData.mensaje}
                onChange={handleChange}
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm"
              ></textarea>
            </div>
          </div>

          {/* Botones */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Solicitar Cita
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgendarCita;
