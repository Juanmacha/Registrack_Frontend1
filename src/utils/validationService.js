// Servicio de validación centralizado para RegistrackFrontend
import { TIPOS_DOCUMENTO, ROLES, ESTADOS_PROCESO } from './mockData.js';

export const ValidationService = {
  // Validar email
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validar documento
  isValidDocument(documentType, documentNumber) {
    if (!documentType || !documentNumber) return false;
    
    // Validaciones específicas por tipo de documento
    switch (documentType) {
      case TIPOS_DOCUMENTO.CEDULA:
        return documentNumber.length === 10 && /^\d+$/.test(documentNumber);
      case TIPOS_DOCUMENTO.TI:
        return documentNumber.length >= 10 && documentNumber.length <= 11;
      case TIPOS_DOCUMENTO.NIT:
        return documentNumber.length >= 9 && documentNumber.length <= 10;
      case TIPOS_DOCUMENTO.PASAPORTE:
        return documentNumber.length >= 6;
      default:
        return documentNumber.length >= 5;
    }
  },

  // Validar teléfono
  isValidPhone(phone) {
    const phoneRegex = /^[\d\s\-\+\(\)]+$/;
    return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 7;
  },

  // Validar campos requeridos
  validateRequiredFields(data, requiredFields) {
    const errors = {};
    requiredFields.forEach(field => {
      if (!data[field] || data[field].toString().trim() === '') {
        errors[field] = `El campo ${field} es requerido`;
      }
    });
    return errors;
  },

  // Validar usuario
  validateUser(userData) {
    const errors = {};
    
    // Campos requeridos
    const requiredFields = ['firstName', 'lastName', 'email', 'documentType', 'documentNumber', 'role'];
    const requiredErrors = this.validateRequiredFields(userData, requiredFields);
    Object.assign(errors, requiredErrors);
    
    // Validar email
    if (userData.email && !this.isValidEmail(userData.email)) {
      errors.email = 'El email no tiene un formato válido';
    }
    
    // Validar documento
    if (userData.documentType && userData.documentNumber && 
        !this.isValidDocument(userData.documentType, userData.documentNumber)) {
      errors.documentNumber = 'El número de documento no es válido para el tipo seleccionado';
    }
    
    // Validar rol
    if (userData.role && !Object.values(ROLES).includes(userData.role)) {
      errors.role = 'El rol seleccionado no es válido';
    }
    
    return errors;
  },

  // Validar venta/solicitud
  validateSale(saleData) {
    const errors = {};
    
    // Campos requeridos
    const requiredFields = ['titular', 'email', 'marca', 'tipoSolicitud'];
    const requiredErrors = this.validateRequiredFields(saleData, requiredFields);
    Object.assign(errors, requiredErrors);
    
    // Validar email
    if (saleData.email && !this.isValidEmail(saleData.email)) {
      errors.email = 'El email no tiene un formato válido';
    }
    
    // Validar estado
    if (saleData.estado && !Object.values(ESTADOS_PROCESO).includes(saleData.estado)) {
      errors.estado = 'El estado seleccionado no es válido';
    }
    
    return errors;
  },

  // Validar cita
  validateAppointment(appointmentData) {
    const errors = {};
    
    // Campos requeridos
    const requiredFields = ['nombre', 'apellido', 'cedula', 'fecha', 'horaInicio', 'horaFin', 'asesor'];
    const requiredErrors = this.validateRequiredFields(appointmentData, requiredFields);
    Object.assign(errors, requiredErrors);
    
    // Validar documento
    if (appointmentData.cedula && !this.isValidDocument(TIPOS_DOCUMENTO.CEDULA, appointmentData.cedula)) {
      errors.cedula = 'El número de cédula no es válido';
    }
    
    // Validar teléfono
    if (appointmentData.telefono && !this.isValidPhone(appointmentData.telefono)) {
      errors.telefono = 'El número de teléfono no es válido';
    }
    
    // Validar fecha
    if (appointmentData.fecha) {
      const fecha = new Date(appointmentData.fecha);
      const hoy = new Date();
      hoy.setHours(0, 0, 0, 0);
      
      if (fecha < hoy) {
        errors.fecha = 'La fecha no puede ser anterior a hoy';
      }
    }
    
    // Validar horarios
    if (appointmentData.horaInicio && appointmentData.horaFin) {
      const inicio = new Date(`2000-01-01T${appointmentData.horaInicio}`);
      const fin = new Date(`2000-01-01T${appointmentData.horaFin}`);
      
      if (inicio >= fin) {
        errors.horaFin = 'La hora de fin debe ser posterior a la hora de inicio';
      }
    }
    
    return errors;
  },

  // Validar cliente
  validateClient(clientData) {
    const errors = {};
    
    // Campos requeridos
    const requiredFields = ['nombre', 'apellido', 'documento', 'email', 'telefono'];
    const requiredErrors = this.validateRequiredFields(clientData, requiredFields);
    Object.assign(errors, requiredErrors);
    
    // Validar email
    if (clientData.email && !this.isValidEmail(clientData.email)) {
      errors.email = 'El email no tiene un formato válido';
    }
    
    // Validar documento
    if (clientData.documento && !this.isValidDocument(TIPOS_DOCUMENTO.CEDULA, clientData.documento)) {
      errors.documento = 'El número de documento no es válido';
    }
    
    // Validar teléfono
    if (clientData.telefono && !this.isValidPhone(clientData.telefono)) {
      errors.telefono = 'El número de teléfono no es válido';
    }
    
    return errors;
  },

  // Verificar si hay errores
  hasErrors(errors) {
    return Object.keys(errors).length > 0;
  },

  // Obtener mensaje de error
  getErrorMessage(errors) {
    return Object.values(errors).join(', ');
  }
};

export default ValidationService; 