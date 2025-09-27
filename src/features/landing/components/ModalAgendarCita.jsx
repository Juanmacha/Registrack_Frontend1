import React, { useState } from "react";
import { FaUser, FaEnvelope, FaPhone, FaCalendarAlt, FaClock, FaCommentDots } from "react-icons/fa";
import solicitudesCitasApiService from "../../dashboard/services/solicitudesCitasApiService.js";
import alertService from "../../../utils/alertService.js";

const ModalAgendarCita = ({ isOpen, onClose }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    email: "",
    telefono: "",
    fecha: "",
    hora: "",
    mensaje: "",
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [errores, setErrores] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    
    // Limpiar error del campo cuando el usuario empiece a escribir
    if (errores[name]) {
      setErrores({ ...errores, [name]: '' });
    }
  };

  const validateForm = () => {
    const errors = {};
    
    if (!formData.nombre.trim()) {
      errors.nombre = 'El nombre es requerido';
    }
    
    if (!formData.email.trim()) {
      errors.email = 'El email es requerido';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      errors.email = 'El formato del email no es válido';
    }
    
    if (!formData.telefono.trim()) {
      errors.telefono = 'El teléfono es requerido';
    }
    
    if (!formData.fecha) {
      errors.fecha = 'La fecha es requerida';
    } else {
      const fecha = new Date(formData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fecha < hoy) {
        errors.fecha = 'La fecha no puede ser pasada';
      }
    }
    
    if (!formData.hora) {
      errors.hora = 'La hora es requerida';
    } else {
      const hora = formData.hora;
      const [horas, minutos] = hora.split(':').map(Number);
      
      if (horas < 7 || horas > 18 || (horas === 18 && minutos > 0)) {
        errors.hora = 'La hora debe estar entre 07:00 y 18:00';
      }
    }
    
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validar formulario
    const errors = validateForm();
    if (Object.keys(errors).length > 0) {
      setErrores(errors);
      return;
    }
    
    setIsLoading(true);
    try {
      console.log('📋 [ModalAgendarCita] Creando solicitud de cita...');
      console.log('📤 [ModalAgendarCita] Datos:', formData);
      
             // Preparar datos para la API
             const solicitudData = {
               fecha_solicitada: formData.fecha,
               hora_solicitada: formData.hora + ":00", // Convertir HH:MM a HH:MM:SS
               tipo: "General", // Tipo por defecto
               modalidad: "Presencial", // Modalidad por defecto
               descripcion: formData.mensaje || 'Sin mensaje adicional',
               // Datos del cliente estructurados
               cliente: {
                 nombre: formData.nombre,
                 email: formData.email,
                 telefono: formData.telefono
               }
             };
      
      console.log('🔗 [ModalAgendarCita] Datos preparados para API:', solicitudData);
      
      // Crear solicitud de cita usando el servicio
      const result = await solicitudesCitasApiService.createSolicitudCita(solicitudData);
      
      if (result.success) {
        await alertService.success(
          "¡Solicitud enviada!",
          result.message || "Tu solicitud de cita ha sido enviada exitosamente. Te contactaremos pronto para confirmar la cita.",
          { 
            confirmButtonText: "Entendido",
            timer: 5000,
            timerProgressBar: true
          }
        );
        
        // Limpiar formulario y cerrar modal
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          fecha: "",
          hora: "",
          mensaje: "",
        });
        setErrores({});
        onClose();
        
        console.log('✅ [ModalAgendarCita] Solicitud creada exitosamente');
      } else {
        await alertService.error(
          "Error al enviar solicitud",
          result.message || "No se pudo enviar la solicitud. Intenta de nuevo.",
          { confirmButtonText: "Reintentar" }
        );
        console.error('❌ [ModalAgendarCita] Error:', result.message);
      }
    } catch (error) {
      console.error('💥 [ModalAgendarCita] Error inesperado:', error);
      await alertService.error(
        "Error de conexión",
        "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.",
        { confirmButtonText: "Entendido" }
      );
    } finally {
      setIsLoading(false);
    }
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errores.nombre ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Ingresa tu nombre completo"
              />
              {errores.nombre && (
                <p className="mt-1 text-xs text-red-600">{errores.nombre}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errores.email ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="tu@email.com"
              />
              {errores.email && (
                <p className="mt-1 text-xs text-red-600">{errores.email}</p>
              )}
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
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errores.telefono ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="3001234567"
              />
              {errores.telefono && (
                <p className="mt-1 text-xs text-red-600">{errores.telefono}</p>
              )}
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
                min={new Date().toISOString().split('T')[0]}
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errores.fecha ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errores.fecha && (
                <p className="mt-1 text-xs text-red-600">{errores.fecha}</p>
              )}
            </div>

            {/* Hora */}
            <div>
              <label className="block text-xs font-medium text-gray-700 mb-1">
                <FaClock className="inline text-gray-400 mr-1" /> Hora de la Cita (07:00 - 18:00) <span className="text-red-500">*</span>
              </label>
              <input
                type="time"
                name="hora"
                value={formData.hora}
                onChange={handleChange}
                required
                min="07:00"
                max="18:00"
                className={`w-full px-3 py-2 border rounded-md shadow-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-sm ${
                  errores.hora ? 'border-red-300' : 'border-gray-300'
                }`}
              />
              {errores.hora && (
                <p className="mt-1 text-xs text-red-600">{errores.hora}</p>
              )}
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
              disabled={isLoading}
              className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className={`px-6 py-2 rounded-md transition-colors flex items-center ${
                isLoading
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Solicitar Cita'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ModalAgendarCita;
