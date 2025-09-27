import React, { useState } from "react";
import solicitudesCitasApiService from "../../dashboard/services/solicitudesCitasApiService.js";
import alertService from "../../../utils/alertService.js";

const SolicitudCitaLanding = () => {
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
      console.log('📋 [SolicitudCitaLanding] Creando solicitud de cita...');
      console.log('📤 [SolicitudCitaLanding] Datos:', formData);
      
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
      
      console.log('🔗 [SolicitudCitaLanding] Datos preparados para API:', solicitudData);
      
      // Crear solicitud de cita
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
        
        // Limpiar formulario
        setFormData({
          nombre: "",
          email: "",
          telefono: "",
          fecha: "",
          hora: "",
          mensaje: "",
        });
        setErrores({});
        
        console.log('✅ [SolicitudCitaLanding] Solicitud creada exitosamente');
      } else {
        await alertService.error(
          "Error al enviar solicitud",
          result.message || "No se pudo enviar la solicitud. Intenta de nuevo.",
          { confirmButtonText: "Reintentar" }
        );
        console.error('❌ [SolicitudCitaLanding] Error:', result.message);
      }
    } catch (error) {
      console.error('💥 [SolicitudCitaLanding] Error inesperado:', error);
      await alertService.error(
        "Error de conexión",
        "No se pudo conectar con el servidor. Verifica tu conexión e intenta de nuevo.",
        { confirmButtonText: "Entendido" }
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section id="solicitud-cita" className="py-12 bg-gray-100">
      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">
          Solicitud de Cita
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Nombre */}
          <div>
            <label htmlFor="nombre" className="block text-sm font-medium text-gray-700">
              Nombre Completo
            </label>
            <input
              type="text"
              id="nombre"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errores.nombre ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Ingresa tu nombre completo"
            />
            {errores.nombre && (
              <p className="mt-1 text-sm text-red-600">{errores.nombre}</p>
            )}
          </div>

          {/* Email */}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errores.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="tu@email.com"
            />
            {errores.email && (
              <p className="mt-1 text-sm text-red-600">{errores.email}</p>
            )}
          </div>

          {/* Teléfono */}
          <div>
            <label htmlFor="telefono" className="block text-sm font-medium text-gray-700">
              Teléfono
            </label>
            <input
              type="tel"
              id="telefono"
              name="telefono"
              value={formData.telefono}
              onChange={handleChange}
              required
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errores.telefono ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="3001234567"
            />
            {errores.telefono && (
              <p className="mt-1 text-sm text-red-600">{errores.telefono}</p>
            )}
          </div>

          {/* Fecha */}
          <div>
            <label htmlFor="fecha" className="block text-sm font-medium text-gray-700">
              Fecha de la Cita
            </label>
            <input
              type="date"
              id="fecha"
              name="fecha"
              value={formData.fecha}
              onChange={handleChange}
              required
              min={new Date().toISOString().split('T')[0]}
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errores.fecha ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errores.fecha && (
              <p className="mt-1 text-sm text-red-600">{errores.fecha}</p>
            )}
          </div>

          {/* Hora */}
          <div>
            <label htmlFor="hora" className="block text-sm font-medium text-gray-700">
              Hora de la Cita (07:00 - 18:00)
            </label>
            <input
              type="time"
              id="hora"
              name="hora"
              value={formData.hora}
              onChange={handleChange}
              required
              min="07:00"
              max="18:00"
              className={`mt-1 block w-full rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 ${
                errores.hora ? 'border-red-300' : 'border-gray-300'
              }`}
            />
            {errores.hora && (
              <p className="mt-1 text-sm text-red-600">{errores.hora}</p>
            )}
          </div>

          {/* Mensaje */}
          <div>
            <label htmlFor="mensaje" className="block text-sm font-medium text-gray-700">
              Mensaje (Opcional)
            </label>
            <textarea
              id="mensaje"
              name="mensaje"
              value={formData.mensaje}
              onChange={handleChange}
              rows="4"
              className="mt-1 block w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
            ></textarea>
          </div>

          {/* Botón de Enviar */}
          <div>
            <button
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 flex items-center justify-center ${
                isLoading
                  ? 'bg-blue-400 text-white cursor-not-allowed'
                  : 'bg-blue-600 text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
              }`}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Enviando...
                </>
              ) : (
                'Enviar Solicitud'
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
};

export default SolicitudCitaLanding;