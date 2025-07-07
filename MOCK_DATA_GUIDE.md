# Guía de Datos Mock Centralizados - RegistrackFrontend

## 📋 **Descripción General**

Este sistema centraliza todos los datos mock del proyecto en dos archivos principales:
- `src/utils/mockData.js` - Datos estáticos y constantes
- `src/utils/mockDataService.js` - Servicios para manejar los datos

## 🏗️ **Estructura del Sistema**

### **Entidades Principales:**
1. **Usuarios** - Usuarios del sistema (admin, usuario, empleado)
2. **Empleados** - Personal de la empresa
3. **Clientes** - Clientes registrados
4. **Servicios** - Servicios ofrecidos por la empresa
5. **Ventas/Servicios** - Solicitudes de servicios
6. **Pagos** - Transacciones de pago
7. **Citas** - Citas programadas
8. **Roles** - Roles y permisos del sistema

## 🚀 **Cómo Usar el Sistema**

### **1. Inicialización**

```javascript
import mockDataService from '../utils/mockDataService';

// Inicializar datos mock (ejecutar al inicio de la app)
mockDataService.initializeMockData();
```

### **2. Usar Servicios Específicos**

#### **Servicio de Usuarios:**
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

#### **Servicio de Clientes:**
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

#### **Servicio de Ventas/Servicios:**
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

#### **Servicio de Pagos:**
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

#### **Servicio de Citas:**
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

#### **Servicio de Servicios:**
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

### **3. Búsqueda Global**

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

### **4. Verificación de Permisos**

```javascript
import { RoleService } from '../utils/mockDataService';

const usuario = UserService.getByEmail('admin@example.com');

// Verificar si puede crear usuarios
const puedeCrearUsuarios = RoleService.hasPermission(usuario, 'usuarios', 'crear');

// Verificar si puede leer ventas
const puedeLeerVentas = RoleService.hasPermission(usuario, 'ventas', 'leer');
```

## 🔄 **Migración de Archivos Existentes**

### **Paso 1: Actualizar imports**

Reemplazar imports de archivos individuales:

```javascript
// ANTES
import dataClientes from './services/dataClientes';
import dataUsuarios from './services/dataUsuarios';

// DESPUÉS
import { ClientService, UserService } from '../../utils/mockDataService';
```

### **Paso 2: Actualizar uso de datos**

```javascript
// ANTES
const clientes = dataClientes;

// DESPUÉS
const clientes = ClientService.getAll();
```

### **Paso 3: Actualizar operaciones CRUD**

```javascript
// ANTES
const nuevoCliente = { ...clienteData, id: Date.now() };
clientes.push(nuevoCliente);
localStorage.setItem('clientes', JSON.stringify(clientes));

// DESPUÉS
const nuevoCliente = ClientService.create(clienteData);
```

## 📊 **Relaciones Entre Entidades**

### **Cliente → Ventas**
```javascript
const cliente = ClientService.getByEmail('carlos@example.com');
const ventasCliente = SalesService.getByClient(cliente.email);
```

### **Venta → Pagos**
```javascript
const venta = SalesService.getById('1');
const pagosVenta = PaymentService.getByOrder(venta.id);
```

### **Cliente → Citas**
```javascript
const cliente = ClientService.getByDocument('1001234567');
const citasCliente = AppointmentService.getByClient(cliente.documento);
```

### **Usuario → Permisos**
```javascript
const usuario = UserService.getByEmail('admin@example.com');
const puedeCrear = RoleService.hasPermission(usuario, 'usuarios', 'crear');
```

## 🛠️ **Funciones de Utilidad**

### **Constantes Disponibles:**
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

### **Funciones de Búsqueda:**
```javascript
import { 
  getServicioById,
  getUsuarioByEmail,
  getClienteByDocumento 
} from '../utils/mockDataService';

const servicio = getServicioById('1');
const usuario = getUsuarioByEmail('juan@example.com');
const cliente = getClienteByDocumento('1001234567');
```

## 🔧 **Configuración y Personalización**

### **Agregar Nuevos Datos:**
1. Editar `src/utils/mockData.js`
2. Agregar datos a las constantes correspondientes
3. Reinicializar con `initializeMockData()`

### **Modificar Estructura:**
1. Actualizar las constantes en `mockData.js`
2. Actualizar los servicios en `mockDataService.js`
3. Actualizar los componentes que usen esos datos

## 📝 **Buenas Prácticas**

1. **Siempre usar los servicios** en lugar de acceder directamente a localStorage
2. **Validar datos** antes de crear o actualizar
3. **Usar constantes** para valores fijos
4. **Manejar errores** en las operaciones CRUD
5. **Documentar cambios** en la estructura de datos

## 🚨 **Consideraciones Importantes**

- Los datos se almacenan en localStorage del navegador
- Los cambios son persistentes durante la sesión
- Para resetear datos, ejecutar `initializeMockData()`
- Los IDs se generan automáticamente con `Date.now()`
- Las fechas se manejan en formato ISO

## 📚 **Ejemplos Completos**

### **Ejemplo: Crear Cliente y Venta**
```javascript
import { ClientService, SalesService } from '../utils/mockDataService';

// Crear cliente
const cliente = ClientService.create({
  tipoDocumento: 'CC',
  documento: '1001234567',
  nombre: 'María',
  apellido: 'García',
  email: 'maria@example.com',
  telefono: '3001234567',
  nitEmpresa: '900123456',
  nombreEmpresa: 'Empresa ABC',
  marca: 'MarcaABC',
  tipoPersona: 'Jurídica'
});

// Crear venta para el cliente
const venta = SalesService.create({
  titular: cliente.nombreEmpresa,
  tipoPersona: cliente.tipoPersona,
  expediente: 'EXP-00125',
  tipoSolicitud: 'Certificación de Marca',
  marca: cliente.marca,
  encargado: 'Dr. Pérez',
  email: cliente.email,
  telefono: cliente.telefono
});

console.log('Cliente creado:', cliente);
console.log('Venta creada:', venta);
```

### **Ejemplo: Dashboard con Datos Relacionados**
```javascript
import { 
  ClientService, 
  SalesService, 
  PaymentService,
  AppointmentService 
} from '../utils/mockDataService';

// Obtener estadísticas del dashboard
const dashboardData = {
  totalClientes: ClientService.getAll().length,
  ventasProceso: SalesService.getInProcess().length,
  ventasFinalizadas: SalesService.getCompleted().length,
  pagosPendientes: PaymentService.getAll().filter(p => !p.estado).length,
  citasHoy: AppointmentService.getAll().filter(c => {
    const hoy = new Date().toISOString().split('T')[0];
    return c.start.startsWith(hoy);
  }).length
};

console.log('Dashboard:', dashboardData);
``` 