import apiService from '../../../shared/services/apiService.js';
import API_CONFIG from '../../../shared/config/apiConfig.js';
import alertService from '../../../utils/alertService.js';

// Servicio para solicitudes de citas usando la API real
const solicitudesCitasApiService = {
  // Obtener todas las solicitudes de citas (Admin/Empleado)
  getAllSolicitudesCitas: async () => {
    try {
      console.log('📋 [SolicitudesCitasApiService] Obteniendo todas las solicitudes de citas...');
      
      const response = await apiService.get(API_CONFIG.ENDPOINTS.APPOINTMENT_REQUESTS);
      console.log('📥 [SolicitudesCitasApiService] Respuesta recibida:', response);
      
      return {
        success: true,
        data: response.data || response,
        message: 'Solicitudes de citas obtenidas correctamente'
      };
    } catch (error) {
      console.error('💥 [SolicitudesCitasApiService] Error al obtener solicitudes:', error);
      
      let errorMessage = 'Error al obtener las solicitudes de citas';
      
      if (error.response?.status === 401) {
        errorMessage = 'No autorizado para ver las solicitudes';
      } else if (error.response?.status === 403) {
        errorMessage = 'Sin permisos para acceder a las solicitudes';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      }
      
      return {
        success: false,
        data: [],
        message: errorMessage
      };
    }
  },

  // Crear nueva solicitud de cita (Cliente)
  createSolicitudCita: async (solicitudData) => {
    try {
      console.log('📋 [SolicitudesCitasApiService] Creando solicitud de cita...');
      console.log('📤 [SolicitudesCitasApiService] Datos:', solicitudData);
      
      // Transformar datos del frontend al formato esperado por la API
      const requestData = {
        fecha_solicitada: solicitudData.fecha_solicitada || solicitudData.fecha,
        hora_solicitada: solicitudData.hora_solicitada || solicitudData.hora,
        tipo: solicitudData.tipo || 'General',
        modalidad: solicitudData.modalidad || 'Presencial',
        descripcion: solicitudData.descripcion || solicitudData.mensaje || ''
      };
      
      console.log('🔄 [SolicitudesCitasApiService] Enviando solicitud a:', API_CONFIG.ENDPOINTS.CREATE_APPOINTMENT_REQUEST);
      console.log('📤 [SolicitudesCitasApiService] Datos transformados:', requestData);
      
      const response = await apiService.post(API_CONFIG.ENDPOINTS.CREATE_APPOINTMENT_REQUEST, requestData);
      console.log('📥 [SolicitudesCitasApiService] Respuesta recibida:', response);
      
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Solicitud de cita creada exitosamente. Queda pendiente de aprobación.'
      };
    } catch (error) {
      console.error('💥 [SolicitudesCitasApiService] Error al crear solicitud:', error);
      console.error('💥 [SolicitudesCitasApiService] Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message
      });
      
      let errorMessage = 'Error al crear la solicitud de cita';
      
      if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos: ' + (error.response.data?.message || 'Verifica los campos requeridos');
      } else if (error.response?.status === 401) {
        errorMessage = 'Debes estar logueado para solicitar una cita';
      } else if (error.response?.status === 403) {
        errorMessage = 'Sin permisos para crear solicitudes';
      } else if (error.response?.status === 409) {
        errorMessage = 'Conflicto de horarios';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.message) {
        errorMessage = error.message;
      }
      
      return {
        success: false,
        data: null,
        message: errorMessage
      };
    }
  },

  // Obtener mis solicitudes de cita (Cliente)
  getMisSolicitudesCitas: async () => {
    try {
      console.log('📋 [SolicitudesCitasApiService] Obteniendo mis solicitudes de cita...');
      
      const response = await apiService.get(API_CONFIG.ENDPOINTS.MY_APPOINTMENT_REQUESTS);
      console.log('📥 [SolicitudesCitasApiService] Mis solicitudes recibidas:', response);
      
      return {
        success: true,
        data: response.data || response,
        message: 'Mis solicitudes de citas obtenidas correctamente'
      };
    } catch (error) {
      console.error('💥 [SolicitudesCitasApiService] Error al obtener mis solicitudes:', error);
      
      return {
        success: false,
        data: [],
        message: 'Error al obtener mis solicitudes de citas'
      };
    }
  },

  // Gestionar solicitud - Aprobar (Admin/Empleado)
  aprobarSolicitudCita: async (solicitudId, idEmpleado, horaFin, observacion = '') => {
    try {
      console.log('📋 [SolicitudesCitasApiService] Aprobando solicitud ID:', solicitudId);
      
      const gestionData = {
        estado: 'Aprobada',
        observacion_admin: observacion || 'Solicitud de cita aprobada',
        id_empleado_asignado: parseInt(idEmpleado),
        hora_fin: horaFin.includes(':') && horaFin.split(':').length === 2 ? horaFin + ':00' : horaFin
      };
      
      console.log('📤 [SolicitudesCitasApiService] Datos de gestión para aprobar:', gestionData);
      
      return await solicitudesCitasApiService.gestionarSolicitudCita(solicitudId, gestionData);
    } catch (error) {
      console.error('💥 [SolicitudesCitasApiService] Error al aprobar solicitud:', error);
      
      return {
        success: false,
        data: null,
        message: 'Error al aprobar la solicitud'
      };
    }
  },

  // Gestionar solicitud - Rechazar (Admin/Empleado)
  rechazarSolicitudCita: async (solicitudId, motivo = '') => {
    try {
      console.log('📋 [SolicitudesCitasApiService] Rechazando solicitud ID:', solicitudId);
      console.log('📤 [SolicitudesCitasApiService] Motivo:', motivo);
      
      const gestionData = {
        estado: 'Rechazada',
        observacion_admin: motivo || 'Solicitud de cita rechazada'
      };
      
      return await solicitudesCitasApiService.gestionarSolicitudCita(solicitudId, gestionData);
    } catch (error) {
      console.error('💥 [SolicitudesCitasApiService] Error al rechazar solicitud:', error);
      
      return {
        success: false,
        data: null,
        message: 'Error al rechazar la solicitud'
      };
    }
  },

  // Gestionar solicitud (función base)
  gestionarSolicitudCita: async (solicitudId, gestionData) => {
    try {
      console.log('📋 [SolicitudesCitasApiService] Gestionando solicitud ID:', solicitudId);
      console.log('📤 [SolicitudesCitasApiService] Datos de gestión:', gestionData);
      console.log('🔗 [SolicitudesCitasApiService] Endpoint:', API_CONFIG.ENDPOINTS.MANAGE_APPOINTMENT_REQUEST(solicitudId));
      
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.MANAGE_APPOINTMENT_REQUEST(solicitudId), 
        gestionData
      );
      console.log('📥 [SolicitudesCitasApiService] Solicitud gestionada:', response);
      console.log('📊 [SolicitudesCitasApiService] Análisis de respuesta:', {
        hasData: !!response.data,
        hasCitaCreada: !!(response.data?.cita_creada || response.cita_creada),
        citaCreada: response.data?.cita_creada || response.cita_creada,
        solicitud: response.data?.solicitud || response.solicitud,
        message: response.message
      });
      
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Solicitud gestionada exitosamente',
        citaCreada: response.data?.cita_creada || response.cita_creada
      };
    } catch (error) {
      console.error('💥 [SolicitudesCitasApiService] Error al gestionar solicitud:', error);
      console.error('💥 [SolicitudesCitasApiService] Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: API_CONFIG.ENDPOINTS.MANAGE_APPOINTMENT_REQUEST(solicitudId)
      });
      
      let errorMessage = 'Error al gestionar la solicitud';
      
      if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos para gestionar la solicitud: ' + (error.response.data?.message || 'Verifica los campos enviados');
      } else if (error.response?.status === 401) {
        errorMessage = 'No autorizado para gestionar solicitudes';
      } else if (error.response?.status === 403) {
        errorMessage = 'Sin permisos para gestionar solicitudes';
      } else if (error.response?.status === 404) {
        errorMessage = 'Solicitud no encontrada o endpoint no disponible';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor: ' + (error.response.data?.message || 'Contacta al administrador');
      } else if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      }
      
      return {
        success: false,
        data: null,
        message: errorMessage
      };
    }
  },

  // Obtener solicitudes por estado
  getSolicitudesByEstado: async (estado) => {
    try {
      console.log('📋 [SolicitudesCitasApiService] Obteniendo solicitudes por estado:', estado);
      
      const response = await apiService.get(API_CONFIG.ENDPOINTS.APPOINTMENT_REQUESTS);
      console.log('📥 [SolicitudesCitasApiService] Todas las solicitudes:', response);
      
      // Filtrar por estado específico
      const allSolicitudes = response.data || response;
      const solicitudes = Array.isArray(allSolicitudes) 
        ? allSolicitudes.filter(solicitud => 
            solicitud.estado?.toLowerCase() === estado.toLowerCase()
          )
        : [];
      
      console.log(`🔍 [SolicitudesCitasApiService] Solicitudes con estado "${estado}":`, solicitudes);
      
      return {
        success: true,
        data: solicitudes,
        message: `Solicitudes con estado "${estado}" obtenidas correctamente`
      };
    } catch (error) {
      console.error('💥 [SolicitudesCitasApiService] Error al obtener solicitudes por estado:', error);
      
      return {
        success: false,
        data: [],
        message: 'Error al obtener las solicitudes por estado'
      };
    }
  },

  // Validar datos de solicitud de cita según la documentación
  validateSolicitudData: (solicitudData) => {
    const errors = {};
    
    // Validar fecha_solicitada
    if (!solicitudData.fecha_solicitada) {
      errors.fecha_solicitada = 'La fecha es requerida';
    } else {
      const fecha = new Date(solicitudData.fecha_solicitada);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fecha < hoy) {
        errors.fecha_solicitada = 'La fecha no puede ser pasada';
      }
    }
    
    // Validar hora_solicitada
    if (!solicitudData.hora_solicitada) {
      errors.hora_solicitada = 'La hora es requerida';
    } else {
      const hora = solicitudData.hora_solicitada;
      const [horas, minutos] = hora.split(':').map(Number);
      
      if (horas < 7 || horas > 18 || (horas === 18 && minutos > 0)) {
        errors.hora_solicitada = 'La hora debe estar entre 07:00 y 18:00';
      }
    }
    
    // Validar tipo
    if (!solicitudData.tipo || !solicitudData.tipo.trim()) {
      errors.tipo = 'El tipo de cita es requerido';
    }
    
    // Validar modalidad
    if (!solicitudData.modalidad || !solicitudData.modalidad.trim()) {
      errors.modalidad = 'La modalidad es requerida';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  }
};

export default solicitudesCitasApiService;
