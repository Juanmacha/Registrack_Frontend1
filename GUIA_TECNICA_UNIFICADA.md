# 📚 Guía Técnica Unificada - RegistrackFrontend

## 📋 Índice

1. [🚨 Sistema de Alertas](#sistema-de-alertas)
2. [📊 Datos Mock Centralizados](#datos-mock-centralizados)
3. [👥 Sistema de Roles y Empleados](#sistema-de-roles-y-empleados)
4. [🧪 Testing Unitario](#testing-unitario)
5. [📱 Diseño Responsivo](#diseño-responsivo)
6. [📝 Convenciones del Proyecto](#convenciones-del-proyecto)

---

## 🚨 Sistema de Alertas

### SweetAlert2 - Guía General

#### Instalación
```javascript
import alertService from '../utils/alertService.js';
```

#### Tipos de Alertas Disponibles

**1. Alertas Básicas**
```javascript
// Éxito
alertService.success('¡Éxito!', 'La operación se completó correctamente.');

// Error
alertService.error('Error', 'Ocurrió un error durante la operación.');

// Advertencia
alertService.warning('Advertencia', 'Ten cuidado con esta acción.');

// Información
alertService.info('Información', 'Esta es una alerta informativa.');
```

**2. Confirmaciones**
```javascript
// Pregunta Simple
const result = await alertService.question('¿Estás seguro?', '¿Quieres continuar?');
if (result.isConfirmed) {
  // Usuario confirmó
}

// Confirmación Personalizada
const result = await alertService.confirm(
  'Confirmar acción',
  '¿Estás seguro de que quieres realizar esta acción?',
  'Sí, continuar',
  'No, cancelar'
);
```

**3. Alertas Específicas**
```javascript
// Login
await alertService.loginSuccess('Juan Pérez');
alertService.loginError();

// Registro
await alertService.registerSuccess();
alertService.registerError('El email ya está registrado');

// Logout
const result = await alertService.logoutConfirm();

// Eliminación
const result = await alertService.deleteConfirm('este usuario');
if (result.isConfirmed) {
  alertService.deleteSuccess('el usuario');
}

// Guardado
alertService.saveSuccess('los datos del usuario');
alertService.saveError('Error al guardar los datos');
alertService.validationError('Por favor, completa todos los campos');
```

**4. Alertas Avanzadas**
```javascript
// Alerta de Carga
const loadingAlert = alertService.loading('Procesando datos...');
// ... operación
alertService.close();

// Cerrar Alerta
alertService.close();
```

### Alertas Específicas para Citas

#### Servicio Especializado
```javascript
import citaAlertService from '../../../../utils/citaAlertService.js';
```

#### Alertas de Validación
```javascript
// Fecha No Válida
citaAlertService.fechaNoValida();

// Validación de Campos
citaAlertService.validacionCampos("nombre");
```

#### Alertas de Operaciones Exitosas
```javascript
// Cita Agendada
await citaAlertService.citaAgendada();

// Cita Reprogramada
await citaAlertService.citaReprogramada();

// Cita Anulada
await citaAlertService.citaAnulada();
```

#### Alertas de Confirmación
```javascript
// Confirmar Anulación
const result = await citaAlertService.confirmarAnulacion();
if (result.isConfirmed) {
  // Proceder con la anulación
}

// Confirmar Reprogramación
const result = await citaAlertService.confirmarReprogramacion();
if (result.isConfirmed) {
  // Proceder con la reprogramación
}
```

#### Alertas de Carga
```javascript
// Cargando Agendar
const loading = citaAlertService.cargandoAgendar();
// ... operación
alertService.close();

// Cargando Reprogramar
const loading = citaAlertService.cargandoReprogramar();
// ... operación
alertService.close();

// Cargando Anular
const loading = citaAlertService.cargandoAnular();
// ... operación
alertService.close();
```

#### Alertas de Error
```javascript
// Error al Procesar Cita
citaAlertService.errorProcesarCita();

// Error al Anular Cita
citaAlertService.errorAnularCita();

// Error al Reprogramar Cita
citaAlertService.errorReprogramarCita();
```

#### Alertas Informativas
```javascript
// Información del Calendario
citaAlertService.infoCalendario();

// Cita Próxima
citaAlertService.citaProxima("Juan Pérez", "14:30");

// Cita Vencida
citaAlertService.citaVencida("Juan Pérez");
```

#### Alertas de Gestión del Calendario
```javascript
// Confirmar Limpiar Calendario
const result = await citaAlertService.confirmarLimpiarCalendario();
if (result.isConfirmed) {
  // Limpiar todas las citas
}

// Calendario Limpio
await citaAlertService.calendarioLimpio();
```

#### Alertas de Exportación
```javascript
// Exportación Exitosa
citaAlertService.exportarExitoso();

// Error de Exportación
citaAlertService.errorExportar();
```

### Ejemplo de Implementación Completa
```javascript
import citaAlertService from '../../../../utils/citaAlertService.js';

const handleAgendarCita = async (datosCita) => {
  try {
    // Mostrar alerta de carga
    const loading = citaAlertService.cargandoAgendar();
    
    // Validar datos
    if (!datosCita.nombre) {
      alertService.close();
      citaAlertService.validacionCampos("nombre");
      return;
    }
    
    // Simular operación asíncrona
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Guardar cita
    await guardarCita(datosCita);
    
    // Cerrar carga y mostrar éxito
    alertService.close();
    await citaAlertService.citaAgendada();
    
  } catch (error) {
    alertService.close();
    citaAlertService.errorProcesarCita();
  }
};
```

---

## 📊 Datos Mock Centralizados

### Descripción General
Este sistema centraliza todos los datos mock del proyecto en dos archivos principales:
- `src/utils/mockData.js` - Datos estáticos y constantes
- `src/utils/mockDataService.js` - Servicios para manejar los datos

### Entidades Principales
1. **Usuarios** - Usuarios del sistema (admin, usuario, empleado)
2. **Empleados** - Personal de la empresa
3. **Clientes** - Clientes registrados
4. **Servicios** - Servicios ofrecidos por la empresa
5. **Ventas/Servicios** - Solicitudes de servicios
6. **Pagos** - Transacciones de pago
7. **Citas** - Citas programadas
8. **Roles** - Roles y permisos del sistema

### Inicialización
```javascript
import mockDataService from '../utils/mockDataService';

// Inicializar datos mock (ejecutar al inicio de la app)
mockDataService.initializeMockData();
```

### Servicios Disponibles

#### Servicio de Usuarios
```javascript
import { UserService } from '../utils/mockDataService';

// Obtener todos los usuarios
const usuarios = UserService.getAll();

// Buscar usuario por email
const usuario = UserService.getByEmail('juan.perez@example.com');

// Crear nuevo usuario
const nuevoUsuario = UserService.create({
  firstName: 'Juan',
  lastName: 'Pérez',
  documentType: 'CC',
  documentNumber: '1234567890',
  email: 'juan@example.com',
  password: '123456',
  role: 'usuario'
});

// Autenticar usuario
const usuarioAutenticado = UserService.authenticate('juan@example.com', '123456');
```

#### Servicio de Clientes
```javascript
import { ClientService } from '../utils/mockDataService';

// Obtener todos los clientes
const clientes = ClientService.getAll();

// Buscar cliente por documento
const cliente = ClientService.getByDocument('1001234567');

// Crear nuevo cliente
const nuevoCliente = ClientService.create({
  tipoDocumento: 'CC',
  documento: '1001234567',
  nombre: 'Carlos',
  apellido: 'Pérez',
  email: 'carlos@example.com',
  telefono: '3001234567',
  nitEmpresa: '900123456',
  nombreEmpresa: 'Soluciones S.A.S.',
  marca: 'SolTech',
  tipoPersona: 'Jurídica'
});
```

#### Servicio de Ventas/Servicios
```javascript
import { SalesService } from '../utils/mockDataService';

// Obtener ventas en proceso
const ventasProceso = SalesService.getInProcess();

// Obtener ventas finalizadas
const ventasFinalizadas = SalesService.getCompleted();

// Obtener ventas por cliente
const ventasCliente = SalesService.getByClient('carlos@example.com');

// Crear nueva venta
const nuevaVenta = SalesService.create({
  titular: 'Juan Pérez',
  tipoPersona: 'Natural',
  expediente: 'EXP-00123',
  tipoSolicitud: 'Certificación de Marca',
  marca: 'TechNova',
  encargado: 'Dra. Gómez',
  email: 'juan@example.com',
  telefono: '3001234567'
});

// Actualizar estado de venta
SalesService.update('1', { estado: 'En proceso' });

// Anular venta
SalesService.cancel('1', 'Cliente solicitó cancelación');

// Agregar comentario
SalesService.addComment('1', 'Documentos recibidos correctamente');
```

#### Servicio de Pagos
```javascript
import { PaymentService } from '../utils/mockDataService';

// Obtener todos los pagos
const pagos = PaymentService.getAll();

// Obtener pagos por orden de servicio
const pagosOrden = PaymentService.getByOrder('1');

// Crear nuevo pago
const nuevoPago = PaymentService.create({
  monto: 150000.00,
  metodo_pago: 'Transferencia',
  estado: true,
  id_orden_servicio: '1'
});
```

#### Servicio de Citas
```javascript
import { AppointmentService } from '../utils/mockDataService';

// Obtener todas las citas
const citas = AppointmentService.getAll();

// Obtener citas por cliente
const citasCliente = AppointmentService.getByClient('1010101010');

// Crear nueva cita
const nuevaCita = AppointmentService.create({
  nombre: 'Juan',
  apellido: 'Pérez',
  cedula: '1010101010',
  telefono: '3001234567',
  fecha: '2025-02-15',
  horaInicio: '09:00',
  horaFin: '10:00',
  detalle: 'Consulta sobre certificación de marca',
  tipoCita: 'Consulta',
  asesor: 'Dra. Gómez'
});

// Cancelar cita
AppointmentService.cancel('1', 'Cliente solicitó reprogramación');
```

#### Servicio de Servicios
```javascript
import { ServiceService } from '../utils/mockDataService';

// Obtener todos los servicios
const servicios = ServiceService.getAll();

// Obtener servicios visibles en landing
const serviciosVisibles = ServiceService.getVisible();

// Obtener servicio por ID
const servicio = ServiceService.getById('1');

// Toggle visibilidad
ServiceService.toggleVisibility('1');
```

### Búsqueda Global
```javascript
import { SearchService } from '../utils/mockDataService';

// Búsqueda en todas las entidades
const resultados = SearchService.globalSearch('Juan Pérez');
console.log(resultados);
// {
//   usuarios: [...],
//   empleados: [...],
//   clientes: [...],
//   ventas: [...],
//   pagos: [...]
// }
```

### Verificación de Permisos
```javascript
import { RoleService } from '../utils/mockDataService';

const usuario = UserService.getByEmail('admin@example.com');

// Verificar si puede crear usuarios
const puedeCrearUsuarios = RoleService.hasPermission(usuario, 'usuarios', 'crear');

// Verificar si puede leer ventas
const puedeLeerVentas = RoleService.hasPermission(usuario, 'ventas', 'leer');
```

### Relaciones Entre Entidades
```javascript
// Cliente → Ventas
const cliente = ClientService.getByEmail('carlos@example.com');
const ventasCliente = SalesService.getByClient(cliente.email);

// Venta → Pagos
const venta = SalesService.getById('1');
const pagosVenta = PaymentService.getByOrder(venta.id);

// Cliente → Citas
const cliente = ClientService.getByDocument('1001234567');
const citasCliente = AppointmentService.getByClient(cliente.documento);

// Usuario → Permisos
const usuario = UserService.getByEmail('admin@example.com');
const puedeCrear = RoleService.hasPermission(usuario, 'usuarios', 'crear');
```

### Funciones de Utilidad
```javascript
import { 
  TIPOS_DOCUMENTO, 
  ROLES, 
  ESTADOS_PROCESO, 
  METODOS_PAGO 
} from '../utils/mockDataService';

// Usar constantes
const tipoDoc = TIPOS_DOCUMENTO.CEDULA;
const rol = ROLES.ADMIN;
const estado = ESTADOS_PROCESO.EN_PROCESO;
const metodoPago = METODOS_PAGO.TRANSFERENCIA;
```

---

## 👥 Sistema de Roles y Empleados

### Descripción General
Este sistema proporciona una gestión completa de roles y empleados con permisos granulares y funcionalidades avanzadas de administración.

### Estructura de Roles

#### Roles del Sistema
- **Administrador**: Acceso completo al sistema
- **Empleado**: Acceso limitado para gestión de clientes y servicios
- **Cliente**: Acceso básico para consulta de servicios propios

#### Permisos por Rol

**Administrador**
- ✅ Usuarios: Crear, Leer, Actualizar, Eliminar
- ✅ Empleados: Crear, Leer, Actualizar, Eliminar
- ✅ Clientes: Crear, Leer, Actualizar, Eliminar
- ✅ Ventas: Crear, Leer, Actualizar, Eliminar
- ✅ Pagos: Crear, Leer, Actualizar, Eliminar
- ✅ Citas: Crear, Leer, Actualizar, Eliminar
- ✅ Roles: Crear, Leer, Actualizar, Eliminar
- ✅ Reportes: Crear, Leer, Actualizar, Eliminar
- ✅ Configuración: Crear, Leer, Actualizar, Eliminar

**Empleado**
- ❌ Usuarios: Crear, Eliminar
- ✅ Usuarios: Leer
- ❌ Usuarios: Actualizar
- ❌ Empleados: Crear, Actualizar, Eliminar
- ✅ Empleados: Leer
- ✅ Clientes: Crear, Leer, Actualizar
- ❌ Clientes: Eliminar
- ✅ Ventas: Crear, Leer, Actualizar
- ❌ Ventas: Eliminar
- ✅ Pagos: Crear, Leer, Actualizar
- ❌ Pagos: Eliminar
- ✅ Citas: Crear, Leer, Actualizar
- ❌ Citas: Eliminar
- ❌ Roles: Todas las operaciones
- ❌ Reportes: Crear, Actualizar, Eliminar
- ✅ Reportes: Leer
- ❌ Configuración: Todas las operaciones

**Cliente**
- ❌ Usuarios: Todas las operaciones
- ❌ Empleados: Todas las operaciones
- ❌ Clientes: Todas las operaciones
- ❌ Ventas: Crear, Actualizar, Eliminar
- ✅ Ventas: Leer
- ❌ Pagos: Crear, Actualizar, Eliminar
- ✅ Pagos: Leer
- ✅ Citas: Crear, Leer
- ❌ Citas: Actualizar, Eliminar
- ❌ Roles: Todas las operaciones
- ❌ Reportes: Todas las operaciones
- ❌ Configuración: Todas las operaciones

### Estructura de Empleados

#### Campos de Empleado
```javascript
{
  id: "string",
  tipoDocumento: "Cédula de Ciudadanía",
  documento: "123456789",
  nombre: "Juan",
  apellidos: "Pérez",
  email: "juan@example.com",
  rol: "Administrador", // o "Empleado" o "Cliente"
  estado: "Activo",
  fechaContratacion: "2024-01-15",
  departamento: "Administración",
  telefono: "3001234567",
  direccion: "Calle 123 #45-67, Medellín"
}
```

#### Departamentos Disponibles
- Administración
- Atención al Cliente
- Gestión de Servicios

### Servicios Disponibles

#### RoleService
```javascript
// Obtener todos los roles
RoleService.getAll()

// Obtener rol por ID
RoleService.getById(id)

// Obtener rol por nombre
RoleService.getByNombre(nombre)

// Crear nuevo rol
RoleService.create(rolData)

// Actualizar rol
RoleService.update(id, rolData)

// Eliminar rol
RoleService.delete(id)

// Obtener roles disponibles para empleados
RoleService.getRolesDisponibles()

// Obtener roles disponibles para usuarios
RoleService.getRolesDisponiblesUsuarios()

// Obtener empleados por rol
RoleService.getEmpleadosByRol(rolNombre)

// Verificar permisos de un rol específico
RoleService.hasPermission(rolId, resource, action)

// Verificar permisos de un usuario
RoleService.hasUserPermission(user, resource, action)
```

#### EmployeeService
```javascript
// Obtener todos los empleados
EmployeeService.getAll()

// Obtener empleado por documento
EmployeeService.getByDocument(documento)

// Obtener empleado por email
EmployeeService.getByEmail(email)

// Obtener empleados por rol
EmployeeService.getByRol(rol)

// Crear nuevo empleado
EmployeeService.create(employeeData)

// Actualizar empleado
EmployeeService.update(id, employeeData)

// Eliminar empleado
EmployeeService.delete(id)

// Cambiar rol de empleado
EmployeeService.changeRole(id, nuevoRol)

// Obtener estadísticas de empleados
EmployeeService.getStats()
```

### Uso Práctico

#### 1. Inicializar el Sistema
```javascript
import { initializeMockData } from './utils/mockDataService.js';

// Inicializar datos al cargar la aplicación
useEffect(() => {
  initializeMockData();
}, []);
```

#### 2. Cargar Empleados y Roles
```javascript
import { EmployeeService, RoleService } from './utils/mockDataService.js';

const empleados = EmployeeService.getAll();
const roles = RoleService.getAll();
```

#### 3. Cambiar Rol de un Empleado
```javascript
const cambiarRol = (empleadoId, nuevoRol) => {
  const empleadoActualizado = EmployeeService.changeRole(empleadoId, nuevoRol);
  if (empleadoActualizado) {
    console.log(`Rol cambiado a: ${nuevoRol}`);
    // Recargar datos si es necesario
  }
};
```

#### 4. Verificar Permisos
```javascript
// Verificar si un rol puede realizar una acción
const puedeCrearUsuarios = RoleService.hasPermission(rolId, 'usuarios', 'crear');

// Verificar permisos de un usuario
const puedeEliminarVentas = RoleService.hasUserPermission(user, 'ventas', 'eliminar');
```

#### 5. Obtener Estadísticas
```javascript
const stats = EmployeeService.getStats();
console.log(`Total empleados: ${stats.total}`);
console.log(`Empleados activos: ${stats.activos}`);
console.log(`Por rol:`, stats.porRol);
```

---

## 🧪 Testing Unitario

### ¿Qué son los Tests Unitarios?
Los **tests unitarios** son pruebas automatizadas que verifican que cada parte individual (unidad) de tu código funcione correctamente de forma aislada.

#### Beneficios
1. **Detectar Errores Temprano** - Encuentras bugs antes de que lleguen a producción
2. **Refactorizar con Confianza** - Puedes cambiar código sabiendo que los tests te avisarán si algo se rompe
3. **Documentar Comportamiento** - Los tests sirven como documentación viva de cómo debe funcionar tu código
4. **Mejorar Diseño** - Te obligan a escribir código más modular y testeable

### Configuración Inicial

#### 1. Instalar Dependencias
```bash
npm install --save-dev jest @testing-library/react @testing-library/jest-dom @testing-library/user-event babel-jest jest-environment-jsdom identity-obj-proxy
```

#### 2. Configuración de Jest
El archivo `jest.config.js` ya está configurado con:
- Entorno jsdom para simular el navegador
- Mocks para librerías externas
- Configuración de coverage
- Transformaciones de Babel

#### 3. Setup de Tests
El archivo `src/setupTests.js` incluye:
- Mocks de localStorage
- Mocks de librerías externas (SweetAlert2, react-router-dom, etc.)
- Configuración global para tests

### Escribiendo Tests

#### Estructura Básica
```javascript
describe('NombreDelServicio', () => {
  describe('nombreDelMetodo', () => {
    test('debe hacer algo específico', () => {
      // Arrange (Preparar)
      const input = 'test@example.com';
      
      // Act (Actuar)
      const result = ValidationService.isValidEmail(input);
      
      // Assert (Verificar)
      expect(result).toBe(true);
    });
  });
});
```

#### Patrón AAA (Arrange-Act-Assert)
```javascript
test('debe validar email correcto', () => {
  // Arrange: Preparar datos de prueba
  const email = 'test@example.com';
  
  // Act: Ejecutar la función que queremos probar
  const isValid = ValidationService.isValidEmail(email);
  
  // Assert: Verificar que el resultado es el esperado
  expect(isValid).toBe(true);
});
```

### Ejemplos Prácticos

#### 1. Tests de Validación
```javascript
describe('ValidationService', () => {
  test('debe validar emails correctos', () => {
    expect(ValidationService.isValidEmail('test@example.com')).toBe(true);
    expect(ValidationService.isValidEmail('usuario@dominio.co')).toBe(true);
  });

  test('debe rechazar emails incorrectos', () => {
    expect(ValidationService.isValidEmail('invalid-email')).toBe(false);
    expect(ValidationService.isValidEmail('test@')).toBe(false);
  });
});
```

#### 2. Tests de Servicios
```javascript
describe('UserService', () => {
  test('getByEmail debe encontrar usuario', () => {
    // Arrange
    const mockUsers = [
      { id: '1', email: 'juan@example.com' }
    ];
    localStorageMock.getItem.mockReturnValue(JSON.stringify(mockUsers));
    
    // Act
    const user = UserService.getByEmail('juan@example.com');
    
    // Assert
    expect(user).toEqual(mockUsers[0]);
  });
});
```

#### 3. Tests de Componentes React
```javascript
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

test('debe mostrar formulario de login', () => {
  render(<LoginForm />);
  
  expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  expect(screen.getByLabelText(/contraseña/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /iniciar sesión/i })).toBeInTheDocument();
});

test('debe validar campos requeridos', async () => {
  const user = userEvent.setup();
  render(<LoginForm />);
  
  const submitButton = screen.getByRole('button', { name: /iniciar sesión/i });
  await user.click(submitButton);
  
  expect(screen.getByText(/el email es requerido/i)).toBeInTheDocument();
});
```

### Best Practices

#### 1. Nombres Descriptivos
```javascript
// ❌ Mal
test('test1', () => {});

// ✅ Bien
test('debe validar email con formato correcto', () => {});
test('debe rechazar email sin @', () => {});
test('debe manejar email vacío', () => {});
```

#### 2. Un Test por Comportamiento
```javascript
// ❌ Mal - Múltiples assertions en un test
test('debe validar emails', () => {
  expect(ValidationService.isValidEmail('test@example.com')).toBe(true);
  expect(ValidationService.isValidEmail('invalid')).toBe(false);
  expect(ValidationService.isValidEmail('')).toBe(false);
});

// ✅ Bien - Un test por caso
test('debe validar email correcto', () => {
  expect(ValidationService.isValidEmail('test@example.com')).toBe(true);
});

test('debe rechazar email inválido', () => {
  expect(ValidationService.isValidEmail('invalid')).toBe(false);
});

test('debe manejar email vacío', () => {
  expect(ValidationService.isValidEmail('')).toBe(false);
});
```

#### 3. Mocks y Stubs
```javascript
// Mock de localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock de funciones externas
jest.mock('sweetalert2', () => ({
  fire: jest.fn(() => Promise.resolve({ isConfirmed: true })),
}));
```

#### 4. Limpieza entre Tests
```javascript
beforeEach(() => {
  jest.clearAllMocks();
  localStorageMock.getItem.mockReturnValue(null);
});

afterEach(() => {
  jest.clearAllMocks();
});
```

### Coverage y Métricas

#### Ejecutar Tests con Coverage
```bash
npm run test:coverage
```

#### Umbrales de Coverage
- **Branches**: 70% - Cobertura de ramas condicionales
- **Functions**: 70% - Cobertura de funciones
- **Lines**: 70% - Cobertura de líneas de código
- **Statements**: 70% - Cobertura de declaraciones

### Comandos Disponibles
```bash
# Ejecutar todos los tests
npm test

# Ejecutar tests en modo watch (desarrollo)
npm run test:watch

# Ejecutar tests con coverage
npm run test:coverage

# Ejecutar tests en CI/CD
npm run test:ci
```

### Estructura de Tests
```
src/
├── utils/
│   ├── __tests__/
│   │   ├── validationService.test.js
│   │   ├── mockDataService.test.js
│   │   └── alertService.test.js
│   ├── validationService.js
│   ├── mockDataService.js
│   └── alertService.js
├── features/
│   ├── auth/
│   │   ├── __tests__/
│   │   │   ├── authService.test.js
│   │   │   └── login.test.jsx
│   │   └── services/
│   └── dashboard/
└── setupTests.js
```

### Herramientas Útiles

#### Jest Matchers
```javascript
expect(value).toBe(expected);           // Igualdad estricta
expect(value).toEqual(expected);        // Igualdad profunda
expect(value).toBeTruthy();             // Verdadero
expect(value).toBeFalsy();              // Falso
expect(value).toContain(item);          // Contiene elemento
expect(value).toHaveLength(length);     // Longitud específica
expect(fn).toHaveBeenCalled();          // Función fue llamada
expect(fn).toHaveBeenCalledWith(arg);  // Función llamada con argumento
```

#### React Testing Library
```javascript
// Queries
getByText('texto');           // Por texto
getByRole('button');          // Por rol
getByLabelText('Email');      // Por label
getByTestId('submit-btn');    // Por test-id

// Eventos
userEvent.click(button);
userEvent.type(input, 'texto');
userEvent.selectOptions(select, 'option');
```

### Casos Especiales

#### Tests Asíncronos
```javascript
test('debe cargar datos del servidor', async () => {
  const user = userEvent.setup();
  
  render(<DataComponent />);
  
  await user.click(screen.getByRole('button'));
  
  await waitFor(() => {
    expect(screen.getByText('Datos cargados')).toBeInTheDocument();
  });
});
```

#### Tests con Promesas
```javascript
test('debe manejar errores de API', async () => {
  fetch.mockRejectedValueOnce(new Error('API Error'));
  
  render(<ApiComponent />);
  
  await waitFor(() => {
    expect(screen.getByText('Error al cargar datos')).toBeInTheDocument();
  });
});
```

---

## 📱 Diseño Responsivo

### Breakpoints Implementados

#### 1. Móviles Pequeños (320px - 480px)
```css
@media (max-width: 480px) {
  /* Estilos específicos para móviles */
}
```

#### 2. Tablets (481px - 768px)
```css
@media (min-width: 481px) and (max-width: 768px) {
  /* Estilos específicos para tablets */
}
```

#### 3. Tablets Grandes y Laptops (769px - 1024px)
```css
@media (min-width: 769px) and (max-width: 1024px) {
  /* Estilos específicos para laptops */
}
```

#### 4. Laptops y Desktops (1025px - 1440px)
```css
@media (min-width: 1025px) and (max-width: 1440px) {
  /* Estilos específicos para desktop */
}
```

#### 5. Pantallas Grandes (1441px+)
```css
@media (min-width: 1441px) {
  /* Estilos específicos para pantallas grandes */
}
```

### Clases CSS Disponibles

#### Gráficas del Dashboard
```css
.dashboard-chart-container  /* Contenedor principal de gráficas */
.dashboard-chart           /* Gráfica individual */
```

**Tamaños responsivos:**
- Móvil: 280x280px
- Tablet: 350x350px
- Laptop: 400x400px
- Desktop: 450x450px
- Pantalla grande: 500x500px

#### Tablas Responsivas
```css
.table-responsive          /* Contenedor de tabla con scroll */
.table-scroll             /* Scroll horizontal para tablas */
```

#### Modales Responsivos
```css
.modal-responsive         /* Overlay del modal */
.modal-content-responsive /* Contenido del modal */
```

#### Sidebar Responsivo
```css
.sidebar-responsive       /* Sidebar principal */
.sidebar-mobile          /* Sidebar para móviles */
.sidebar-tablet          /* Sidebar para tablets */
.sidebar-laptop          /* Sidebar para laptops */
.sidebar-desktop         /* Sidebar para desktop */
.sidebar-large           /* Sidebar para pantallas grandes */
```

#### Cards Responsivas
```css
.card-responsive         /* Cards con efectos hover */
```

#### Botones Responsivos
```css
.btn-responsive          /* Botones con efectos */
.btn-hover-responsive   /* Botones con hover específico */
```

### Utilidades Responsivas

#### Clases de Visibilidad
```css
.hidden-mobile          /* Ocultar en móviles */
.mobile-only            /* Mostrar solo en móviles */
.hidden-tablet          /* Ocultar en tablets */
.tablet-only            /* Mostrar solo en tablets */
```

#### Animaciones Responsivas
```css
.slide-in-mobile        /* Animación de deslizamiento para móviles */
.fade-in-tablet         /* Animación de fade para tablets */
```

#### Efectos Hover
```css
.hover-responsive       /* Efectos hover solo en dispositivos con mouse */
```

### Ejemplos de Uso

#### 1. Gráfica del Dashboard
```jsx
<div className="dashboard-chart-container">
  <div className="dashboard-chart">
    <Doughnut data={data} options={options} />
  </div>
</div>
```

#### 2. Tabla Responsiva
```jsx
<div className="table-responsive">
  <table className="table-auto w-full">
    {/* Contenido de la tabla */}
  </table>
</div>
```

#### 3. Modal Responsivo
```jsx
<div className="modal-responsive">
  <div className="modal-content-responsive">
    {/* Contenido del modal */}
  </div>
</div>
```

#### 4. Card con Efectos
```jsx
<div className="card-responsive hover-responsive">
  <h3>Título</h3>
  <p>Contenido</p>
</div>
```

#### 5. Botón Responsivo
```jsx
<button className="btn-responsive btn-hover-responsive bg-blue-600 text-white">
  Botón Responsivo
</button>
```

#### 6. Contenido Condicional
```jsx
<div className="hidden-mobile">
  <p>Este contenido solo se muestra en pantallas grandes</p>
</div>

<div className="mobile-only">
  <p>Este contenido solo se muestra en móviles</p>
</div>
```

### Casos de Uso Específicos

#### Dashboard
- **Gráficas**: Se adaptan automáticamente según el tamaño de pantalla
- **Tablas**: Scroll horizontal en dispositivos pequeños
- **Sidebar**: Se colapsa en móviles, se expande en hover en desktop

#### Landing Page
- **Hero Section**: Títulos y subtítulos se ajustan
- **Cards de servicios**: Grid responsivo
- **Navbar**: Menú hamburguesa en móviles

#### Formularios
- **Campos**: Se apilan verticalmente en móviles
- **Botones**: Tamaños optimizados para touch
- **Modales**: Ancho adaptativo

### Mejores Prácticas

#### 1. Mobile-First
```css
/* Empezar con estilos móviles */
.mi-componente {
  /* Estilos base (móvil) */
}

/* Luego agregar breakpoints */
@media (min-width: 768px) {
  .mi-componente {
    /* Estilos desktop */
  }
}
```

#### 2. Contenido Condicional
```jsx
// Usar clases de visibilidad
<div className="hidden-mobile">
  <p>Contenido solo para desktop</p>
</div>
```

#### 3. Imágenes Responsivas
```jsx
<img 
  src="/images/logo.png" 
  className="w-full h-auto max-w-md"
  alt="Logo"
/>
```

#### 4. Texto Responsivo
```jsx
<h1 className="text-2xl md:text-4xl lg:text-6xl">
  Título Responsivo
</h1>
```

### Animaciones y Transiciones

#### Hover Solo en Desktop
```css
@media (hover: hover) {
  .mi-elemento:hover {
    transform: scale(1.05);
  }
}
```

#### Animaciones Optimizadas
```css
/* Reducir animaciones si el usuario lo prefiere */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    transition-duration: 0.01ms !important;
  }
}
```

### Performance

#### Optimizaciones Implementadas
1. **Reduced Motion**: Respeta preferencias del usuario
2. **Hover Detection**: Solo aplica hover en dispositivos con mouse
3. **Efficient Transitions**: Transiciones optimizadas
4. **Print Styles**: Estilos específicos para impresión

#### Monitoreo
- Usar Lighthouse para auditar performance
- Probar en dispositivos reales
- Optimizar imágenes para diferentes tamaños

---

## 📝 Convenciones del Proyecto

### Estructura de Archivos

#### Nomenclatura
- **Componentes**: PascalCase (ej: `FormularioBase.jsx`)
- **Archivos de servicios**: camelCase (ej: `authService.js`)
- **Carpetas**: kebab-case (ej: `gestion-ventas-servicios`)

#### Organización
```
src/
├── features/           # Funcionalidades principales
│   ├── auth/          # Autenticación
│   ├── dashboard/     # Panel de administración
│   └── landing/       # Página principal
├── shared/            # Componentes compartidos
├── utils/             # Utilidades y constantes
└── routes/            # Configuración de rutas
```

### Rutas

#### Convención
- **Rutas públicas**: kebab-case
- **Rutas de admin**: `/admin/` + kebab-case
- **Rutas de formularios**: `/formulario/` + kebab-case

#### Ejemplos
```javascript
/pages/busqueda
/pages/presentacion-oposicion
/pages/cesion-marca
/admin/gestion-usuarios
/formulario/certificacion
```

### Nombres de Servicios

#### Estandarizados
- "Búsqueda de Antecedentes"
- "Certificación de Marca"
- "Renovación de Marca"
- "Presentación de Oposición"
- "Cesión de Marca"
- "Ampliación de Alcance"

### Imports

#### Reglas
1. **Siempre usar rutas relativas**
2. **No usar rutas absolutas hardcodeadas**
3. **Usar alias cuando sea posible**

#### Ejemplos Correctos
```javascript
import Component from '../components/Component';
import { SERVICIOS } from '../../utils/constants';
```

#### Ejemplos Incorrectos
```javascript
import Component from "/Users/username/project/src/components/Component";
```

### Estilos

#### CSS Classes
- **Tailwind CSS** como framework principal
- **Bootstrap** para componentes específicos
- **Clases personalizadas** en camelCase

### Estados de Proceso

#### Formato Estandarizado
```javascript
{
  id: "1",
  name: "Solicitud Recibida",
  order: 1,
  status_key: "recibida"
}
```

### Autenticación

#### Roles
- `admin`: Administrador del sistema
- `usuario`: Usuario regular
- `empleado`: Empleado de la empresa

### Tipos de Documento

#### Estandarizados
- "Cédula de Ciudadanía"
- "Pasaporte"
- "DNI"
- "Tarjeta de Identidad"
- "NIT"

### Scripts Disponibles

```bash
npm run dev      # Desarrollo
npm run build    # Producción
npm run lint     # Linting
npm run preview  # Vista previa
```

### Notas Importantes

1. **Mantener consistencia** en nombres y rutas
2. **Usar constantes** del archivo `utils/constants.js`
3. **Documentar cambios** importantes
4. **Seguir las convenciones** establecidas

---

## 🎯 Conclusión

Esta guía técnica unificada proporciona toda la información necesaria para trabajar con el proyecto RegistrackFrontend. Cada sección está diseñada para ser independiente pero complementaria, permitiendo una referencia rápida y completa de todas las funcionalidades técnicas del sistema.

### Beneficios de la Unificación

1. **Documentación Centralizada**: Toda la información técnica en un solo lugar
2. **Fácil Navegación**: Índice claro y secciones bien organizadas
3. **Mantenimiento Simplificado**: Un solo archivo para actualizar
4. **Referencia Rápida**: Búsqueda eficiente de información específica
5. **Consistencia**: Estilo y formato uniforme en toda la documentación

### Próximos Pasos

1. **Revisar y actualizar** la guía según nuevos cambios
2. **Agregar ejemplos** adicionales según necesidades
3. **Integrar feedback** del equipo de desarrollo
4. **Mantener sincronización** con el código fuente

---

*Esta guía se actualiza regularmente según las necesidades del proyecto.*
