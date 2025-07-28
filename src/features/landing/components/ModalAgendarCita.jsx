import React, { useState, useContext } from 'react';
import alertService from '../../../utils/alertService.js';
import { AuthContext } from '../../../shared/contexts/authContext.jsx';
import { mockDataService } from '../../../utils/mockDataService.js';

const ModalAgendarCita = ({ isOpen, onClose }) => {
  const { user } = useContext(AuthContext);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    tipoDocumento: '',
    numeroDocumento: '',
    nombre: '',
    email: '',
    telefono: '',
    tipoSolicitud: '',
    mensaje: ''
  });
  const [errors, setErrors] = useState({});

  // Verificar si el usuario está autenticado
  if (!user) {
    alertService.warning('¡Atención!', 'Debes iniciar sesión para agendar una cita.', { confirmButtonText: 'Entiendo', showCancelButton: false });
    onClose();
    return null;
  }

  if (!isOpen) return null;

  const validate = () => {
    const validationErrors = {};
    
    if (!form.tipoDocumento) validationErrors.tipoDocumento = 'Requerido';
    if (!form.numeroDocumento) validationErrors.numeroDocumento = 'Requerido';
    if (!form.nombre) validationErrors.nombre = 'Requerido';
    if (!form.email) validationErrors.email = 'Requerido';
    if (!form.telefono) validationErrors.telefono = 'Requerido';
    if (!form.tipoSolicitud) validationErrors.tipoSolicitud = 'Requerido';
    if (!form.mensaje) validationErrors.mensaje = 'Requerido';
    
    // Validación de email
    if (form.email && !/\S+@\S+\.\S+/.test(form.email)) {
      validationErrors.email = 'Email inválido';
    }
    
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleChange = (event) => {
    if (!event || !event.target) return;
    
    const { name, value } = event.target;
    setForm(prevForm => ({ ...prevForm, [name]: value }));
    setErrors(prevErrors => ({ ...prevErrors, [name]: '' }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!validate()) return;
    
    setLoading(true);
    
    try {
      // Crear la solicitud de cita
      const solicitudData = {
        tipoDocumento: form.tipoDocumento,
        numeroDocumento: form.numeroDocumento,
        nombre: form.nombre,
        email: form.email,
        telefono: form.telefono,
        tipoSolicitud: form.tipoSolicitud,
        mensaje: form.mensaje,
        usuarioId: user?.id || null,
        usuarioEmail: user?.email || form.email
      };
      
      const nuevaSolicitud = mockDataService.SolicitudCitaService.create(solicitudData);
      
      if (nuevaSolicitud) {
        await alertService.success(
          '¡Solicitud enviada!', 
          'Tu solicitud de cita ha sido enviada correctamente. Pronto nos contactaremos contigo para confirmar la fecha y hora.'
        );
        
        setForm({ 
          tipoDocumento: '', 
          numeroDocumento: '',
          nombre: '', 
          email: '', 
          telefono: '', 
          tipoSolicitud: '',
          mensaje: '' 
        });
        onClose();
      } else {
        throw new Error('No se pudo crear la solicitud');
      }
    } catch (error) {
      console.error('Error al crear solicitud de cita:', error);
      await alertService.error('Error', 'Hubo un problema al enviar tu solicitud. Por favor, intenta de nuevo.');
    } finally {
      setLoading(false);
    }
  };

  // Manejar click en el backdrop
  const handleBackdropClick = (event) => {
    if (event.target === event.currentTarget) {
      onClose();
    }
  };

  return (
    <div 
      className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-50 p-4"
      onClick={handleBackdropClick}
    >
      <div 
        className="bg-white rounded-lg shadow-xl max-w-md w-full max-h-[90vh] overflow-y-auto"
        onClick={(event) => event.stopPropagation()}
      >
        {/* Encabezado */}
        <div className="bg-blue-50 px-6 py-4 border-b border-gray-200 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="bg-blue-100 p-2 rounded-full">
              <i className="bi bi-calendar-event text-blue-600 text-xl"></i>
            </span>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Solicitar Cita</h2>
              <p className="text-sm text-gray-500">Completa la información para solicitar tu cita</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 text-2xl"
            disabled={loading}
          >
            ×
          </button>
        </div>
        
        {/* Contenido del formulario */}
        <div className="p-6">
          <form className="space-y-4" onSubmit={handleSubmit}>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de documento *
              </label>
              <select 
                name="tipoDocumento" 
                value={form.tipoDocumento} 
                onChange={handleChange} 
                disabled={loading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar tipo de documento</option>
                <option value="Cédula de ciudadanía">Cédula de ciudadanía</option>
                <option value="Cédula de extranjería">Cédula de extranjería</option>
                <option value="Pasaporte">Pasaporte</option>
                <option value="NIT">NIT</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.tipoDocumento && (
                <span className="text-xs text-red-600 mt-1 block">{errors.tipoDocumento}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Número de documento *
              </label>
              <input 
                type="text"
                name="numeroDocumento" 
                value={form.numeroDocumento} 
                onChange={handleChange} 
                disabled={loading}
                placeholder="Ingresa tu número de documento"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed" 
              />
              {errors.numeroDocumento && (
                <span className="text-xs text-red-600 mt-1 block">{errors.numeroDocumento}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Nombre completo *
              </label>
              <input 
                type="text"
                name="nombre" 
                value={form.nombre} 
                onChange={handleChange} 
                disabled={loading}
                placeholder="Ingresa tu nombre completo"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed" 
              />
              {errors.nombre && (
                <span className="text-xs text-red-600 mt-1 block">{errors.nombre}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Correo electrónico *
              </label>
              <input 
                type="email"
                name="email" 
                value={form.email} 
                onChange={handleChange} 
                disabled={loading}
                placeholder="ejemplo@correo.com"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed" 
              />
              {errors.email && (
                <span className="text-xs text-red-600 mt-1 block">{errors.email}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Teléfono *
              </label>
              <input 
                type="tel"
                name="telefono" 
                value={form.telefono} 
                onChange={handleChange} 
                disabled={loading}
                placeholder="Ej: 300 123 4567"
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed" 
              />
              {errors.telefono && (
                <span className="text-xs text-red-600 mt-1 block">{errors.telefono}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Tipo de solicitud *
              </label>
              <select 
                name="tipoSolicitud" 
                value={form.tipoSolicitud} 
                onChange={handleChange} 
                disabled={loading}
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option value="">Seleccionar tipo de solicitud</option>
                <option value="Consulta general">Consulta general</option>
                <option value="Asesoría de marca">Asesoría de marca</option>
                <option value="Registro de marca">Registro de marca</option>
                <option value="Renovación de marca">Renovación de marca</option>
                <option value="Oposición">Oposición</option>
                <option value="Cesión de marca">Cesión de marca</option>
                <option value="Otro">Otro</option>
              </select>
              {errors.tipoSolicitud && (
                <span className="text-xs text-red-600 mt-1 block">{errors.tipoSolicitud}</span>
              )}
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Mensaje o motivo *
              </label>
              <textarea 
                name="mensaje" 
                value={form.mensaje} 
                onChange={handleChange} 
                disabled={loading}
                rows={4} 
                placeholder="Describe brevemente el motivo de tu solicitud..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-base focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors disabled:bg-gray-100 disabled:cursor-not-allowed resize-none" 
              />
              {errors.mensaje && (
                <span className="text-xs text-red-600 mt-1 block">{errors.mensaje}</span>
              )}
            </div>
            
            <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
              <button 
                type="button" 
                onClick={onClose} 
                disabled={loading}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Cancelar
              </button>
              <button 
                type="submit" 
                disabled={loading}
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {loading && (
                  <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                )}
                {loading ? 'Enviando...' : 'Solicitar cita'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ModalAgendarCita;