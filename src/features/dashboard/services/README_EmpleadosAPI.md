# Servicio de API para Empleados

## Descripción
Este servicio proporciona una interfaz completa para interactuar con la API de empleados de Registrack, siguiendo el mismo patrón que el servicio de citas.

## Características

### ✅ Funcionalidades Implementadas
- **Conexión con API real**: Integración completa con los endpoints de empleados
- **Fallback a datos mock**: Sistema de respaldo en caso de errores de API
- **CRUD completo**: Crear, leer, actualizar y eliminar empleados
- **Gestión de estados**: Cambiar estado activo/inactivo de empleados
- **Reportes Excel**: Descarga de reportes desde la API
- **Validaciones robustas**: Validación de datos antes de enviar a la API
- **Manejo de errores**: Mensajes descriptivos y logging detallado
- **Indicadores de carga**: UI responsiva con estados de carga

### 🔧 Endpoints Utilizados
```javascript
// Configuración en apiConfig.js
EMPLOYEES: '/api/gestion-empleados',
EMPLOYEE_BY_ID: (id) => `/api/gestion-empleados/${id}`,
EMPLOYEE_ESTADO: (id) => `/api/gestion-empleados/${id}/estado`,
EMPLOYEES_REPORT: '/api/gestion-empleados/reporte/excel'
```

## Uso del Servicio

### 1. Importar el Servicio
```javascript
import empleadosApiService from '../services/empleadosApiService.js';
```

### 2. Funciones Disponibles

#### Obtener Todos los Empleados
```javascript
const response = await empleadosApiService.getAllEmpleados();
if (response.success) {
  console.log('Empleados:', response.data);
} else {
  console.error('Error:', response.message);
}
```

#### Obtener Empleado por ID
```javascript
const response = await empleadosApiService.getEmpleadoById(1);
if (response.success) {
  console.log('Empleado:', response.data);
}
```

#### Crear Empleado
```javascript
const nuevoEmpleado = {
  id_usuario: 5,
  estado: true
};

const response = await empleadosApiService.createEmpleado(nuevoEmpleado);
if (response.success) {
  console.log('Empleado creado:', response.data);
}
```

#### Actualizar Empleado
```javascript
const datosActualizacion = {
  id_usuario: 5,
  estado: false
};

const response = await empleadosApiService.updateEmpleado(1, datosActualizacion);
if (response.success) {
  console.log('Empleado actualizado:', response.data);
}
```

#### Cambiar Estado del Empleado
```javascript
const response = await empleadosApiService.changeEmpleadoEstado(1, false);
if (response.success) {
  console.log('Estado cambiado:', response.data);
}
```

#### Eliminar Empleado
```javascript
const response = await empleadosApiService.deleteEmpleado(1);
if (response.success) {
  console.log('Empleado eliminado');
}
```

#### Descargar Reporte Excel
```javascript
const response = await empleadosApiService.downloadReporteExcel();
if (response.success) {
  // El archivo se descarga automáticamente
  console.log('Reporte descargado');
}
```

### 3. Validaciones

El servicio incluye validaciones automáticas:

```javascript
// Validación de datos de empleado
const validation = empleadosApiService.validateEmpleadoData(empleadoData);
if (!validation.isValid) {
  console.log('Errores:', validation.errors);
}
```

**Campos validados:**
- `id_usuario`: Debe ser un número mayor a 0
- `estado`: Debe ser boolean (true/false)

## Integración en Componentes

### Componente Principal (empleados.jsx)

El componente principal incluye:

1. **Estado de modo**: Alternar entre API y datos mock
2. **Indicadores de carga**: Spinner durante operaciones
3. **Manejo de errores**: Notificaciones de éxito/error
4. **Fallback automático**: Cambio a datos mock en caso de error

```javascript
const [useApi, setUseApi] = useState(true); // true = API, false = Mock
const [loading, setLoading] = useState(false);

// Función para cargar empleados
const cargarEmpleados = async () => {
  setLoading(true);
  try {
    if (useApi) {
      const response = await empleadosApiService.getAllEmpleados();
      // Procesar respuesta...
    } else {
      // Usar datos mock
    }
  } catch (error) {
    // Manejo de errores con fallback
  } finally {
    setLoading(false);
  }
};
```

### Botón de Alternancia

```javascript
<button
  onClick={() => setUseApi(!useApi)}
  className={`px-3 py-1 text-xs rounded-md border ${
    useApi 
      ? 'bg-green-100 text-green-700 border-green-300' 
      : 'bg-yellow-100 text-yellow-700 border-yellow-300'
  }`}
>
  {useApi ? '🌐 API' : '📊 Mock'}
</button>
```

## Estructura de Respuesta

### Respuesta Exitosa
```javascript
{
  success: true,
  data: [...], // Array de empleados o objeto individual
  message: "Operación exitosa"
}
```

### Respuesta de Error
```javascript
{
  success: false,
  data: null,
  message: "Descripción del error"
}
```

## Transformación de Datos

El servicio transforma automáticamente los datos de la API al formato esperado por el frontend:

```javascript
// Datos de la API
{
  id_empleado: 1,
  id_usuario: 5,
  estado: true,
  usuario: {
    nombre: "Juan",
    apellido: "Pérez",
    documento: "12345678",
    correo: "juan@email.com",
    rol: "empleado"
  }
}

// Transformado para el frontend
{
  id: 1,
  id_usuario: 5,
  nombre: "Juan",
  apellidos: "Pérez",
  documento: "12345678",
  correo: "juan@email.com",
  rol: "empleado",
  estado: "activo"
}
```

## Logging y Debugging

El servicio incluye logging detallado para facilitar el debugging:

```javascript
console.log('🔄 [EmpleadosApiService] Operación iniciada...');
console.log('📤 [EmpleadosApiService] Datos enviados:', data);
console.log('📥 [EmpleadosApiService] Respuesta recibida:', response);
console.log('✅ [EmpleadosApiService] Operación exitosa');
console.error('💥 [EmpleadosApiService] Error:', error);
```

## Manejo de Errores

### Códigos de Error HTTP
- **400**: Datos inválidos
- **401**: No autorizado
- **403**: Sin permisos
- **404**: Empleado no encontrado
- **409**: Conflicto (usuario ya asociado)
- **500**: Error interno del servidor

### Fallback Automático
En caso de error de API, el sistema automáticamente:
1. Muestra mensaje de error al usuario
2. Cambia a datos mock como fallback
3. Continúa funcionando sin interrupciones

## Pruebas

### Probar Conectividad
```javascript
const testConnection = async () => {
  const response = await empleadosApiService.testConnection();
  console.log('Conexión:', response.success ? 'OK' : 'Error');
};
```

### Verificar Existencia de Datos
```javascript
const checkData = async () => {
  const response = await empleadosApiService.checkEmpleadosExists();
  console.log('Empleados encontrados:', response.count);
};
```

## Configuración

### Variables de Entorno
Asegúrate de que la configuración de API esté correcta:

```javascript
// apiConfig.js
BASE_URL: 'https://api-registrack-2.onrender.com'
```

### Permisos
- Solo usuarios con rol **administrador** pueden acceder a los endpoints de empleados
- El token JWT debe estar presente en todas las peticiones

## Notas Importantes

1. **Autenticación**: Todas las operaciones requieren token JWT válido
2. **Permisos**: Solo administradores pueden gestionar empleados
3. **Fallback**: El sistema siempre tiene datos mock como respaldo
4. **Logging**: Revisa la consola para debugging detallado
5. **Validación**: Los datos se validan antes de enviar a la API

## Próximos Pasos

- [ ] Implementar paginación en la API
- [ ] Agregar filtros avanzados
- [ ] Implementar búsqueda en tiempo real
- [ ] Agregar validaciones del lado del servidor
- [ ] Implementar cache de datos
