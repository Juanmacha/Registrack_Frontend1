import apiService from '../../../shared/services/apiService.js';
import API_CONFIG from '../../../shared/config/apiConfig.js';
import alertService from '../../../utils/alertService.js';

// Servicio para citas usando la API real
const citasApiService = {
  // Función de prueba para verificar conectividad
  testConnection: async () => {
    try {
      console.log('🧪 [CitasApiService] Probando conectividad con la API...');
      const response = await apiService.get(API_CONFIG.ENDPOINTS.APPOINTMENTS);
      console.log('🧪 [CitasApiService] Respuesta de prueba:', response);
      return { success: true, data: response };
    } catch (error) {
      console.error('🧪 [CitasApiService] Error en prueba de conectividad:', error);
      return { success: false, error: error };
    }
  },

  // Función para verificar si hay citas en la base de datos
  checkCitasExists: async () => {
    try {
      console.log('🔍 [CitasApiService] Verificando si existen citas...');
      const response = await apiService.get(API_CONFIG.ENDPOINTS.APPOINTMENTS);
      console.log('🔍 [CitasApiService] Respuesta completa:', response);
      
      let citasCount = 0;
      let citasData = [];
      
      if (response.data?.citas && Array.isArray(response.data.citas)) {
        citasData = response.data.citas;
        citasCount = response.data.citas.length;
      } else if (Array.isArray(response.data)) {
        citasData = response.data;
        citasCount = response.data.length;
      }
      
      console.log('📊 [CitasApiService] Estadísticas de citas:', {
        totalCitas: citasCount,
        hasData: citasCount > 0,
        firstCita: citasCount > 0 ? citasData[0] : null,
        allCitas: citasData
      });
      
      return {
        success: true,
        count: citasCount,
        data: citasData,
        hasCitas: citasCount > 0
      };
    } catch (error) {
      console.error('🔍 [CitasApiService] Error al verificar citas:', error);
      return { success: false, count: 0, hasCitas: false, error: error };
    }
  },
  // Obtener todas las citas
  getAllCitas: async () => {
    try {
      console.log('📅 [CitasApiService] Obteniendo todas las citas...');
      
      const response = await apiService.get(API_CONFIG.ENDPOINTS.APPOINTMENTS);
      console.log('📥 [CitasApiService] Respuesta recibida:', response);
      console.log('📊 [CitasApiService] Estructura de respuesta:', {
        hasData: !!response.data,
        dataType: typeof response.data,
        isArray: Array.isArray(response.data),
        dataLength: Array.isArray(response.data) ? response.data.length : 'N/A',
        hasCitas: !!(response.data?.citas),
        citasLength: Array.isArray(response.data?.citas) ? response.data.citas.length : 'N/A'
      });
      
      // Determinar qué datos usar
      let citasData = response.data;
      if (response.data?.citas && Array.isArray(response.data.citas)) {
        citasData = response.data.citas;
      } else if (!Array.isArray(response.data)) {
        citasData = [];
      }
      
      console.log('📋 [CitasApiService] Datos finales de citas:', citasData);
      
      return {
        success: true,
        data: citasData,
        message: response.message || 'Citas obtenidas correctamente'
      };
    } catch (error) {
      console.error('💥 [CitasApiService] Error al obtener citas:', error);
      
      let errorMessage = 'Error al obtener las citas';
      
      if (error.response?.status === 401) {
        errorMessage = 'No autorizado para ver las citas';
      } else if (error.response?.status === 403) {
        errorMessage = 'Sin permisos para acceder a las citas';
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

  // Crear nueva cita
  createCita: async (citaData) => {
    try {
      console.log('📅 [CitasApiService] Creando cita...');
      console.log('📤 [CitasApiService] Datos:', citaData);
      
      // Validar datos antes de enviar
      console.log('🔍 [CitasApiService] Validando datos recibidos:', citaData);
      const validation = citasApiService.validateCitaData(citaData);
      console.log('🔍 [CitasApiService] Resultado de validación:', validation);
      
      if (!validation.isValid) {
        console.log('❌ [CitasApiService] Validación falló:', validation.errors);
        return {
          success: false,
          data: null,
          message: 'Datos inválidos: ' + Object.values(validation.errors).join(', ')
        };
      }
      
      console.log('✅ [CitasApiService] Validación exitosa');
      
      // Transformar datos al formato esperado por la API
      const requestData = {
        fecha: citaData.fecha,
        hora_inicio: citaData.hora_inicio,
        hora_fin: citaData.hora_fin,
        tipo: citaData.tipo,
        modalidad: citaData.modalidad,
        id_cliente: citaData.id_cliente,
        id_empleado: citaData.id_empleado,
        estado: citaData.estado || 'Programada',
        observacion: citaData.observacion || '',
        // Incluir datos del cliente si están disponibles
        ...(citaData.cliente && {
          cliente_nombre: citaData.cliente.nombre,
          cliente_apellido: citaData.cliente.apellido,
          cliente_documento: citaData.cliente.documento,
          cliente_telefono: citaData.cliente.telefono
        })
      };
      
      console.log('🔄 [CitasApiService] Enviando solicitud a:', API_CONFIG.ENDPOINTS.APPOINTMENTS);
      console.log('📤 [CitasApiService] Datos transformados:', requestData);
      console.log('📤 [CitasApiService] Datos transformados (JSON):', JSON.stringify(requestData, null, 2));
      
      const response = await apiService.post(API_CONFIG.ENDPOINTS.APPOINTMENTS, requestData);
      console.log('📥 [CitasApiService] Respuesta recibida:', response);
      console.log('📊 [CitasApiService] Status:', response.status);
      console.log('📊 [CitasApiService] Data:', response.data);
      
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Cita creada exitosamente'
      };
    } catch (error) {
      console.error('💥 [CitasApiService] Error al crear cita:', error);
      console.error('💥 [CitasApiService] Error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
        message: error.message,
        url: API_CONFIG.ENDPOINTS.APPOINTMENTS
      });
      
      // Log detallado del error de la API
      if (error.response?.data) {
        console.error('💥 [CitasApiService] Error data completo:', JSON.stringify(error.response.data, null, 2));
        if (error.response.data.error) {
          console.error('💥 [CitasApiService] Error específico:', error.response.data.error);
        }
        if (error.response.data.message) {
          console.error('💥 [CitasApiService] Mensaje de error:', error.response.data.message);
        }
      }
      
      let errorMessage = 'Error al crear la cita';
      
      if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos para la cita: ' + (error.response.data?.message || JSON.stringify(error.response.data));
      } else if (error.response?.status === 401) {
        errorMessage = 'Debes estar logueado para crear una cita';
      } else if (error.response?.status === 403) {
        errorMessage = 'Sin permisos para crear citas';
      } else if (error.response?.status === 409) {
        errorMessage = 'Conflicto de horarios - El empleado ya tiene una cita en ese horario';
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

  // Reprogramar cita
  reprogramarCita: async (citaId, nuevosDatos) => {
    try {
      console.log('📅 [CitasApiService] Reprogramando cita ID:', citaId);
      console.log('📤 [CitasApiService] Nuevos datos:', nuevosDatos);
      
      // Validar datos antes de enviar
      const validation = citasApiService.validateCitaData(nuevosDatos);
      if (!validation.isValid) {
        return {
          success: false,
          data: null,
          message: 'Datos inválidos: ' + Object.values(validation.errors).join(', ')
        };
      }
      
      const requestData = {
        fecha: nuevosDatos.fecha,
        hora_inicio: nuevosDatos.hora_inicio,
        hora_fin: nuevosDatos.hora_fin,
        observacion: nuevosDatos.observacion || ''
      };
      
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.RESCHEDULE_APPOINTMENT(citaId), 
        requestData
      );
      console.log('📥 [CitasApiService] Cita reprogramada:', response);
      
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Cita reprogramada exitosamente'
      };
    } catch (error) {
      console.error('💥 [CitasApiService] Error al reprogramar cita:', error);
      
      let errorMessage = 'Error al reprogramar la cita';
      
      if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos para reprogramar la cita';
      } else if (error.response?.status === 401) {
        errorMessage = 'No autorizado para reprogramar citas';
      } else if (error.response?.status === 403) {
        errorMessage = 'Sin permisos para reprogramar citas';
      } else if (error.response?.status === 404) {
        errorMessage = 'Cita no encontrada';
      } else if (error.response?.status === 409) {
        errorMessage = 'Conflicto de horarios - El empleado ya tiene una cita en ese horario';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor';
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

  // Anular cita
  anularCita: async (citaId, motivo) => {
    try {
      console.log('📅 [CitasApiService] Anulando cita ID:', citaId);
      console.log('📤 [CitasApiService] Motivo:', motivo);
      
      const requestData = {
        observacion: motivo || 'Cita anulada'
      };
      
      const response = await apiService.put(
        API_CONFIG.ENDPOINTS.CANCEL_APPOINTMENT(citaId), 
        requestData
      );
      console.log('📥 [CitasApiService] Cita anulada:', response);
      
      return {
        success: true,
        data: response.data || response,
        message: response.message || 'Cita anulada exitosamente'
      };
    } catch (error) {
      console.error('💥 [CitasApiService] Error al anular cita:', error);
      
      let errorMessage = 'Error al anular la cita';
      
      if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos para anular la cita';
      } else if (error.response?.status === 401) {
        errorMessage = 'No autorizado para anular citas';
      } else if (error.response?.status === 403) {
        errorMessage = 'Sin permisos para anular citas';
      } else if (error.response?.status === 404) {
        errorMessage = 'Cita no encontrada';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor';
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

  // Descargar reporte de citas en Excel
  downloadReporteExcel: async () => {
    try {
      console.log('📅 [CitasApiService] Descargando reporte Excel...');
      
      const response = await apiService.get(API_CONFIG.ENDPOINTS.APPOINTMENTS_REPORT);
      console.log('📥 [CitasApiService] Reporte descargado:', response);
      
      // La respuesta debería ser un blob o datos para descarga
      return {
        success: true,
        data: response,
        message: 'Reporte descargado exitosamente'
      };
    } catch (error) {
      console.error('💥 [CitasApiService] Error al descargar reporte:', error);
      
      let errorMessage = 'Error al descargar el reporte';
      
      if (error.response?.status === 401) {
        errorMessage = 'No autorizado para descargar reportes';
      } else if (error.response?.status === 403) {
        errorMessage = 'Sin permisos para descargar reportes';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor';
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

  // Validar datos de cita según la documentación
  validateCitaData: (citaData) => {
    const errors = {};
    
    // Validar fecha
    if (!citaData.fecha) {
      errors.fecha = 'La fecha es requerida';
    } else {
      const fecha = new Date(citaData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fecha < hoy) {
        errors.fecha = 'La fecha no puede ser pasada';
      }
    }
    
    // Validar hora_inicio
    if (!citaData.hora_inicio) {
      errors.hora_inicio = 'La hora de inicio es requerida';
    } else {
      const hora = citaData.hora_inicio;
      const [horas, minutos] = hora.split(':').map(Number);
      
      if (horas < 7 || horas > 18 || (horas === 18 && minutos > 0)) {
        errors.hora_inicio = 'La hora debe estar entre 07:00 y 18:00';
      }
    }
    
    // Validar hora_fin
    if (!citaData.hora_fin) {
      errors.hora_fin = 'La hora de fin es requerida';
    } else {
      const hora = citaData.hora_fin;
      const [horas, minutos] = hora.split(':').map(Number);
      
      if (horas < 7 || horas > 18 || (horas === 18 && minutos > 0)) {
        errors.hora_fin = 'La hora debe estar entre 07:00 y 18:00';
      }
      
      // Validar que hora_fin sea mayor que hora_inicio
      if (citaData.hora_inicio && citaData.hora_fin) {
        const inicio = new Date(`2000-01-01T${citaData.hora_inicio}`);
        const fin = new Date(`2000-01-01T${citaData.hora_fin}`);
        
        if (fin <= inicio) {
          errors.hora_fin = 'La hora de fin debe ser mayor que la hora de inicio';
        }
      }
    }
    
    // Validar tipo
    if (!citaData.tipo || !citaData.tipo.trim()) {
      errors.tipo = 'El tipo de cita es requerido';
    }
    
    // Validar modalidad
    if (!citaData.modalidad || !citaData.modalidad.trim()) {
      errors.modalidad = 'La modalidad es requerida';
    }
    
    // Validar id_cliente
    if (!citaData.id_cliente || citaData.id_cliente <= 0) {
      errors.id_cliente = 'El cliente es requerido';
    }
    
    // Validar id_empleado
    if (!citaData.id_empleado || citaData.id_empleado <= 0) {
      errors.id_empleado = 'El empleado es requerido';
    }
    
    return {
      isValid: Object.keys(errors).length === 0,
      errors: errors
    };
  }
};

export default citasApiService;