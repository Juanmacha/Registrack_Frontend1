// Tests unitarios para mockDataService
import { 
  UserService, 
  SaleService, 
  ValidationService,
  initializeMockData 
} from '../mockDataService.js';

// Mock localStorage para tests
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

describe('mockDataService', () => {
  beforeEach(() => {
    // Limpiar mocks antes de cada test
    jest.clearAllMocks();
    localStorageMock.getItem.mockReturnValue(null);
  });

  describe('UserService', () => {
    test('getAll debe retornar usuarios del localStorage', () => {
      const mockUsers = [
        { id: '1', firstName: 'Juan', email: 'juan@example.com' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers));
      
      const users = UserService.getAll();
      expect(users).toEqual(mockUsers);
    });

    test('getByEmail debe encontrar usuario por email', () => {
      const mockUsers = [
        { id: '1', firstName: 'Juan', email: 'juan@example.com' },
        { id: '2', firstName: 'Ana', email: 'ana@example.com' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers));
      
      const user = UserService.getByEmail('juan@example.com');
      expect(user).toEqual(mockUsers[0]);
    });

    test('getByEmail debe retornar null si no encuentra usuario', () => {
      const mockUsers = [
        { id: '1', firstName: 'Juan', email: 'juan@example.com' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers));
      
      const user = UserService.getByEmail('noexiste@example.com');
      expect(user).toBeUndefined();
    });

    test('authenticate debe validar credenciales correctas', () => {
      const mockUsers = [
        { 
          id: '1', 
          firstName: 'Juan', 
          email: 'juan@example.com',
          password: '123456'
        }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers));
      
      const user = UserService.authenticate('juan@example.com', '123456');
      expect(user).toEqual(mockUsers[0]);
    });

    test('authenticate debe rechazar credenciales incorrectas', () => {
      const mockUsers = [
        { 
          id: '1', 
          firstName: 'Juan', 
          email: 'juan@example.com',
          password: '123456'
        }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers));
      
      const user = UserService.authenticate('juan@example.com', 'password-incorrecto');
      expect(user).toBeUndefined();
    });
  });

  describe('SaleService', () => {
    test('getInProcess debe retornar ventas en proceso', () => {
      const mockVentas = [
        { id: '1', estado: 'En revisión', marca: 'Marca1' },
        { id: '2', estado: 'En proceso', marca: 'Marca2' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockVentas));
      
      const ventas = SaleService.getInProcess();
      expect(ventas).toEqual(mockVentas);
    });

    test('getCompleted debe retornar ventas finalizadas', () => {
      const mockVentas = [
        { id: '1', estado: 'Finalizado', marca: 'Marca1' },
        { id: '2', estado: 'Cancelado', marca: 'Marca2' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockVentas));
      
      const ventas = SaleService.getCompleted();
      expect(ventas).toEqual(mockVentas);
    });

    test('create debe crear nueva venta', () => {
      const mockVentas = [];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockVentas));
      
      const nuevaVenta = {
        titular: 'Juan Pérez',
        email: 'juan@example.com',
        marca: 'MiMarca',
        tipoSolicitud: 'Certificación de Marca'
      };
      
      const ventaCreada = SaleService.create(nuevaVenta);
      
      expect(ventaCreada).toHaveProperty('id');
      expect(ventaCreada).toHaveProperty('fechaSolicitud');
      expect(ventaCreada.titular).toBe('Juan Pérez');
      expect(ventaCreada.email).toBe('juan@example.com');
      expect(ventaCreada.marca).toBe('MiMarca');
    });

    test('update debe actualizar venta existente', () => {
      const mockVentas = [
        { id: '1', estado: 'En revisión', marca: 'Marca1' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockVentas));
      
      const ventaActualizada = SaleService.update('1', { estado: 'En proceso' });
      
      expect(ventaActualizada.estado).toBe('En proceso');
      expect(ventaActualizada.marca).toBe('Marca1'); // No debe cambiar
    });

    test('update debe retornar null si no encuentra la venta', () => {
      const mockVentas = [
        { id: '1', estado: 'En revisión', marca: 'Marca1' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockVentas));
      
      const ventaActualizada = SaleService.update('999', { estado: 'En proceso' });
      
      expect(ventaActualizada).toBeNull();
    });

    test('delete debe eliminar venta', () => {
      const mockVentas = [
        { id: '1', estado: 'En revisión', marca: 'Marca1' },
        { id: '2', estado: 'En proceso', marca: 'Marca2' }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockVentas));
      
      const resultado = SaleService.delete('1');
      
      expect(resultado).toBe(true);
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'ventas_proceso_mock',
        JSON.stringify([{ id: '2', estado: 'En proceso', marca: 'Marca2' }])
      );
    });

    test('cancel debe cancelar venta con motivo', () => {
      const mockVentas = [
        { id: '1', estado: 'En revisión', marca: 'Marca1', comentarios: [] }
      ];
      localStorageMock.getItem.mockReturnValue(JSON.stringify(mockVentas));
      
      const ventaCancelada = SaleService.cancel('1', 'Cliente solicitó cancelación');
      
      expect(ventaCancelada.estado).toBe('Cancelado');
      expect(ventaCancelada.comentarios).toHaveLength(1);
      expect(ventaCancelada.comentarios[0].texto).toContain('Cliente solicitó cancelación');
    });
  });

  describe('ValidationService', () => {
    test('isValidEmail debe validar emails correctos', () => {
      expect(ValidationService.isValidEmail('test@example.com')).toBe(true);
      expect(ValidationService.isValidEmail('usuario@dominio.co')).toBe(true);
    });

    test('isValidEmail debe rechazar emails incorrectos', () => {
      expect(ValidationService.isValidEmail('invalid-email')).toBe(false);
      expect(ValidationService.isValidEmail('test@')).toBe(false);
    });

    test('isValidDocument debe validar cédulas', () => {
      expect(ValidationService.isValidDocument('Cédula de Ciudadanía', '1234567890')).toBe(true);
    });

    test('isValidDocument debe rechazar cédulas incorrectas', () => {
      expect(ValidationService.isValidDocument('Cédula de Ciudadanía', '12345')).toBe(false);
    });

    test('validateRequiredFields debe detectar campos faltantes', () => {
      const data = { nombre: 'Juan', email: '' };
      const requiredFields = ['nombre', 'email'];
      
      const errors = ValidationService.validateRequiredFields(data, requiredFields);
      
      expect(errors.email).toBe('El campo email es requerido');
      expect(errors.nombre).toBeUndefined();
    });
  });

  describe('initializeMockData', () => {
    test('debe inicializar datos mock si localStorage está vacío', () => {
      localStorageMock.getItem.mockReturnValue(null);
      
      initializeMockData();
      
      // Verificar que se llamó setItem para cada tipo de dato
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'usuarios_mock',
        expect.any(String)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'empleados_mock',
        expect.any(String)
      );
      expect(localStorageMock.setItem).toHaveBeenCalledWith(
        'clientes_mock',
        expect.any(String)
      );
    });

    test('no debe inicializar si ya existen datos', () => {
      localStorageMock.getItem.mockReturnValue(JSON.stringify([{ id: '1' }]));
      
      initializeMockData();
      
      // No debe llamar setItem si ya hay datos
      expect(localStorageMock.setItem).not.toHaveBeenCalled();
    });
  });
}); 