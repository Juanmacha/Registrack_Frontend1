# Guía del Sistema de Roles y Empleados

## Descripción General

Este sistema proporciona una gestión completa de roles y empleados con permisos granulares y funcionalidades avanzadas de administración.

## Estructura de Roles

### Roles del Sistema
- **Administrador**: Acceso completo al sistema
- **Empleado**: Acceso limitado para gestión de clientes y servicios
- **Cliente**: Acceso básico para consulta de servicios propios

### Permisos por Rol

#### Administrador
- ✅ Usuarios: Crear, Leer, Actualizar, Eliminar
- ✅ Empleados: Crear, Leer, Actualizar, Eliminar
- ✅ Clientes: Crear, Leer, Actualizar, Eliminar
- ✅ Ventas: Crear, Leer, Actualizar, Eliminar
- ✅ Pagos: Crear, Leer, Actualizar, Eliminar
- ✅ Citas: Crear, Leer, Actualizar, Eliminar
- ✅ Roles: Crear, Leer, Actualizar, Eliminar
- ✅ Reportes: Crear, Leer, Actualizar, Eliminar
- ✅ Configuración: Crear, Leer, Actualizar, Eliminar

#### Empleado
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

#### Cliente
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

## Estructura de Empleados

### Campos de Empleado
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

### Departamentos Disponibles
- Administración
- Atención al Cliente
- Gestión de Servicios

## Servicios Disponibles

### RoleService

#### Métodos Principales
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

### EmployeeService

#### Métodos Principales
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

## Uso Práctico

### 1. Inicializar el Sistema
```javascript
import { initializeMockData } from './utils/mockDataService.js';

// Inicializar datos al cargar la aplicación
useEffect(() => {
  initializeMockData();
}, []);
```

### 2. Cargar Empleados y Roles
```javascript
import { EmployeeService, RoleService } from './utils/mockDataService.js';

const empleados = EmployeeService.getAll();
const roles = RoleService.getAll();
```

### 3. Cambiar Rol de un Empleado
```javascript
const cambiarRol = (empleadoId, nuevoRol) => {
  const empleadoActualizado = EmployeeService.changeRole(empleadoId, nuevoRol);
  if (empleadoActualizado) {
    console.log(`Rol cambiado a: ${nuevoRol}`);
    // Recargar datos si es necesario
  }
};
```

### 4. Verificar Permisos
```javascript
// Verificar si un rol puede realizar una acción
const puedeCrearUsuarios = RoleService.hasPermission(rolId, 'usuarios', 'crear');

// Verificar permisos de un usuario
const puedeEliminarVentas = RoleService.hasUserPermission(user, 'ventas', 'eliminar');
```

### 5. Obtener Estadísticas
```javascript
const stats = EmployeeService.getStats();
console.log(`Total empleados: ${stats.total}`);
console.log(`Empleados activos: ${stats.activos}`);
console.log(`Por rol:`, stats.porRol);
```

## Componente de Ejemplo

El archivo `empleadosConRoles.jsx` proporciona un ejemplo completo de cómo usar el sistema:

### Características del Componente
- ✅ Estadísticas generales de empleados
- ✅ Visualización de roles con permisos
- ✅ Tabla de empleados filtrable por rol
- ✅ Cambio de roles en tiempo real
- ✅ Verificación de permisos por rol
- ✅ Interfaz moderna y responsive

### Funcionalidades Principales
1. **Dashboard de Estadísticas**: Muestra totales y distribución por rol
2. **Gestión de Roles**: Visualiza permisos y empleados por rol
3. **Tabla de Empleados**: Lista completa con filtros y acciones
4. **Cambio de Roles**: Selector para cambiar roles en tiempo real
5. **Verificación de Permisos**: Muestra qué puede hacer cada rol

## Integración con el Sistema

### 1. En el Router
```javascript
import EmpleadosConRoles from './pages/gestionEmpleados/empleadosConRoles.jsx';

// Agregar la ruta
{
  path: '/admin/empleados-roles',
  element: <EmpleadosConRoles />
}
```

### 2. En el Menú de Navegación
```javascript
{
  name: 'Empleados y Roles',
  href: '/admin/empleados-roles',
  icon: UsersIcon,
  current: pathname === '/admin/empleados-roles'
}
```

### 3. Protección de Rutas
```javascript
// Verificar si el usuario puede acceder
const puedeAcceder = RoleService.hasUserPermission(user, 'empleados', 'leer');
```

## Ventajas del Sistema

### 1. Centralización
- Todos los datos en un solo lugar
- Servicios unificados
- Fácil mantenimiento

### 2. Flexibilidad
- Roles personalizables
- Permisos granulares
- Fácil extensión

### 3. Escalabilidad
- Estructura preparada para crecimiento
- Separación clara de responsabilidades
- APIs consistentes

### 4. Seguridad
- Verificación de permisos
- Control de acceso granular
- Auditoría de cambios

## Próximos Pasos

### 1. Migración de Componentes Existentes
- Actualizar `gestionEmpleados.jsx` para usar el nuevo sistema
- Migrar `gestionRoles.jsx` al sistema centralizado
- Actualizar componentes de autenticación

### 2. Funcionalidades Adicionales
- Historial de cambios de roles
- Notificaciones de cambios
- Reportes de permisos
- Auditoría de acciones

### 3. Optimizaciones
- Caché de permisos
- Validaciones adicionales
- Mejoras de rendimiento

## Conclusión

El sistema de roles y empleados proporciona una base sólida para la gestión de usuarios y permisos en la aplicación. Con su estructura modular y APIs consistentes, facilita el desarrollo y mantenimiento de funcionalidades relacionadas con la administración de usuarios. 