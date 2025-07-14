// Tests unitarios para ValidationService
import { ValidationService } from '../validationService.js';

describe('ValidationService', () => {
  describe('isValidEmail', () => {
    test('debe validar emails correctos', () => {
      expect(ValidationService.isValidEmail('test@example.com')).toBe(true);
      expect(ValidationService.isValidEmail('usuario@dominio.co')).toBe(true);
      expect(ValidationService.isValidEmail('test.email@subdomain.domain.com')).toBe(true);
    });

    test('debe rechazar emails incorrectos', () => {
      expect(ValidationService.isValidEmail('invalid-email')).toBe(false);
      expect(ValidationService.isValidEmail('test@')).toBe(false);
      expect(ValidationService.isValidEmail('@domain.com')).toBe(false);
      expect(ValidationService.isValidEmail('test@domain')).toBe(false);
    });

    test('debe manejar casos edge', () => {
      expect(ValidationService.isValidEmail('')).toBe(false);
      expect(ValidationService.isValidEmail(null)).toBe(false);
      expect(ValidationService.isValidEmail(undefined)).toBe(false);
    });
  });

  describe('isValidDocument', () => {
    test('debe validar cédulas correctas', () => {
      expect(ValidationService.isValidDocument('Cédula de Ciudadanía', '1234567890')).toBe(true);
      expect(ValidationService.isValidDocument('Cédula de Ciudadanía', '9876543210')).toBe(true);
    });

    test('debe rechazar cédulas incorrectas', () => {
      expect(ValidationService.isValidDocument('Cédula de Ciudadanía', '12345')).toBe(false); // Muy corta
      expect(ValidationService.isValidDocument('Cédula de Ciudadanía', '123456789012345')).toBe(false); // Muy larga
      expect(ValidationService.isValidDocument('Cédula de Ciudadanía', 'abc123def')).toBe(false); // Con letras
    });

    test('debe validar pasaportes', () => {
      expect(ValidationService.isValidDocument('Pasaporte', 'AB123456')).toBe(true);
      expect(ValidationService.isValidDocument('Pasaporte', '123456789')).toBe(true);
    });
  });

  describe('isValidPhone', () => {
    test('debe validar teléfonos correctos', () => {
      expect(ValidationService.isValidPhone('3001234567')).toBe(true);
      expect(ValidationService.isValidPhone('+57 300 123 4567')).toBe(true);
      expect(ValidationService.isValidPhone('(300) 123-4567')).toBe(true);
    });

    test('debe rechazar teléfonos incorrectos', () => {
      expect(ValidationService.isValidPhone('123')).toBe(false); // Muy corto
      expect(ValidationService.isValidPhone('abcdefghij')).toBe(false); // Solo letras
    });
  });

  describe('validateRequiredFields', () => {
    test('debe validar campos requeridos', () => {
      const data = {
        nombre: 'Juan',
        email: 'juan@example.com',
        telefono: '3001234567'
      };
      const requiredFields = ['nombre', 'email', 'telefono'];
      
      const errors = ValidationService.validateRequiredFields(data, requiredFields);
      expect(errors).toEqual({});
    });

    test('debe detectar campos faltantes', () => {
      const data = {
        nombre: 'Juan',
        email: '', // Campo vacío
        telefono: '3001234567'
      };
      const requiredFields = ['nombre', 'email', 'telefono'];
      
      const errors = ValidationService.validateRequiredFields(data, requiredFields);
      expect(errors.email).toBe('El campo email es requerido');
    });

    test('debe detectar campos undefined', () => {
      const data = {
        nombre: 'Juan',
        email: undefined, // Campo undefined
        telefono: '3001234567'
      };
      const requiredFields = ['nombre', 'email', 'telefono'];
      
      const errors = ValidationService.validateRequiredFields(data, requiredFields);
      expect(errors.email).toBe('El campo email es requerido');
    });
  });

  describe('validateUser', () => {
    test('debe validar usuario correcto', () => {
      const userData = {
        firstName: 'Juan',
        lastName: 'Pérez',
        email: 'juan@example.com',
        documentType: 'Cédula de Ciudadanía',
        documentNumber: '1234567890',
        role: 'Cliente'
      };
      
      const errors = ValidationService.validateUser(userData);
      expect(errors).toEqual({});
    });

    test('debe detectar errores en usuario', () => {
      const userData = {
        firstName: '', // Campo vacío
        lastName: 'Pérez',
        email: 'invalid-email', // Email inválido
        documentType: 'Cédula de Ciudadanía',
        documentNumber: '123', // Documento muy corto
        role: 'RolInvalido' // Rol inválido
      };
      
      const errors = ValidationService.validateUser(userData);
      expect(errors.firstName).toBe('El campo firstName es requerido');
      expect(errors.email).toBe('El email no tiene un formato válido');
      expect(errors.documentNumber).toBe('El número de documento no es válido para el tipo seleccionado');
      expect(errors.role).toBe('El rol seleccionado no es válido');
    });
  });

  describe('validateSale', () => {
    test('debe validar venta correcta', () => {
      const saleData = {
        titular: 'Juan Pérez',
        email: 'juan@example.com',
        marca: 'MiMarca',
        tipoSolicitud: 'Certificación de Marca'
      };
      
      const errors = ValidationService.validateSale(saleData);
      expect(errors).toEqual({});
    });

    test('debe detectar errores en venta', () => {
      const saleData = {
        titular: '', // Campo vacío
        email: 'invalid-email', // Email inválido
        marca: 'MiMarca',
        tipoSolicitud: 'Certificación de Marca',
        estado: 'EstadoInvalido' // Estado inválido
      };
      
      const errors = ValidationService.validateSale(saleData);
      expect(errors.titular).toBe('El campo titular es requerido');
      expect(errors.email).toBe('El email no tiene un formato válido');
      expect(errors.estado).toBe('El estado seleccionado no es válido');
    });
  });

  describe('hasErrors', () => {
    test('debe detectar cuando hay errores', () => {
      const errors = { email: 'Email inválido', nombre: 'Campo requerido' };
      expect(ValidationService.hasErrors(errors)).toBe(true);
    });

    test('debe detectar cuando no hay errores', () => {
      const errors = {};
      expect(ValidationService.hasErrors(errors)).toBe(false);
    });
  });

  describe('getErrorMessage', () => {
    test('debe concatenar mensajes de error', () => {
      const errors = { 
        email: 'Email inválido', 
        nombre: 'Campo requerido' 
      };
      const message = ValidationService.getErrorMessage(errors);
      expect(message).toBe('Email inválido, Campo requerido');
    });

    test('debe manejar objeto vacío', () => {
      const errors = {};
      const message = ValidationService.getErrorMessage(errors);
      expect(message).toBe('');
    });
  });
}); 