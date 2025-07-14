# Correcciones Críticas para Mock Data - RegistrackFrontend

## 🚨 **PROBLEMAS CRÍTICOS IDENTIFICADOS**

### **1. Inconsistencias en Claves de localStorage**

#### ❌ **Problema Actual:**
```javascript
// En componentes - Claves incorrectas
localStorage.getItem("usuarios") // ❌ Debería ser "usuarios_mock"
localStorage.getItem("roles_mock") // ❌ Inconsistente
localStorage.getItem("citas") // ❌ Debería ser "citas_mock"
```

#### ✅ **Solución Implementada:**
```javascript
// Usar LocalStorageService centralizado
import { LocalStorageService } from '../utils/mockDataService';

// En lugar de acceso directo
const usuarios = LocalStorageService.get('usuarios_mock');
```

### **2. Duplicación de Roles**

#### ❌ **Problema Anterior:**
```javascript
// Dos definiciones diferentes
export const ROLES = {
  ADMIN: "Administrador",
  USUARIO: "Cliente", 
  EMPLEADO: "Empleado"
};

export const ROLES_SISTEMA = {
  ADMINISTRADOR: "Administrador",
  EMPLEADO: "Empleado", 
  CLIENTE: "Cliente"
};
```

#### ✅ **Solución Implementada:**
```javascript
// Una sola definición unificada
export const ROLES = {
  ADMINISTRADOR: "Administrador",
  EMPLEADO: "Empleado", 
  CLIENTE: "Cliente"
};
```

### **3. Referencias Hardcodeadas**

#### ❌ **Problema Anterior:**
```javascript
// Roles hardcodeados en authService
const rolePermissions = {
  "Administrador": { /* ... */ },
  "Empleado": { /* ... */ },
  "Cliente": { /* ... */ }
};
```

#### ✅ **Solución Implementada:**
```javascript
// Usar constantes ROLES
import { ROLES } from '../utils/mockData';

const rolePermissions = {
  [ROLES.ADMINISTRADOR]: { /* ... */ },
  [ROLES.EMPLEADO]: { /* ... */ },
  [ROLES.CLIENTE]: { /* ... */ }
};
```

## 🔧 **CORRECCIONES NECESARIAS EN COMPONENTES**

### **1. profile.jsx**
```javascript
// ❌ ANTES
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

// ✅ DESPUÉS
import { LocalStorageService } from '../utils/mockDataService';
const usuarios = LocalStorageService.get('usuarios_mock') || [];
```

### **2. FormularioUsuario.jsx**
```javascript
// ❌ ANTES
const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];
const roles = JSON.parse(localStorage.getItem("roles_mock")) || [];

// ✅ DESPUÉS
import { LocalStorageService } from '../utils/mockDataService';
const usuarios = LocalStorageService.get('usuarios_mock') || [];
const roles = LocalStorageService.get('roles_mock') || [];
```

### **3. calendario.jsx**
```javascript
// ❌ ANTES
const storedEvents = JSON.parse(localStorage.getItem("citas")) || [];

// ✅ DESPUÉS
import { LocalStorageService } from '../utils/mockDataService';
const storedEvents = LocalStorageService.get('citas_mock') || [];
```

## 📋 **CHECKLIST DE CORRECCIONES**

### **✅ Completadas:**
- [x] Unificación de roles en `mockData.js`
- [x] Creación de `LocalStorageService` centralizado
- [x] Corrección de referencias en `authServiceUpdated.js`
- [x] Actualización de funciones de almacenamiento

### **❌ Pendientes:**
- [ ] Corregir `src/features/auth/pages/profile.jsx`
- [ ] Corregir `src/features/dashboard/pages/gestionUsuarios/components/FormularioUsuario.jsx`
- [ ] Corregir `src/features/dashboard/pages/gestionEmpleados/components/crearEmpleado.jsx`
- [ ] Corregir `src/features/dashboard/pages/gestionEmpleados/components/editarEmpleado.jsx`
- [ ] Corregir `src/features/dashboard/pages/gestionCitas/calendario.jsx`
- [ ] Corregir `src/features/auth/pages/forgotPassword.jsx`
- [ ] Corregir `src/features/landing/components/hero.jsx`

## 🛠️ **SERVICIO DE LOCALSTORAGE CENTRALIZADO**

### **Funciones Disponibles:**
```javascript
import { LocalStorageService } from '../utils/mockDataService';

// Obtener datos
const data = LocalStorageService.get('usuarios_mock');

// Guardar datos
LocalStorageService.set('usuarios_mock', newData);

// Eliminar datos
LocalStorageService.remove('usuarios_mock');

// Verificar existencia
if (LocalStorageService.has('usuarios_mock')) {
  // ...
}

// Limpiar todos los datos mock
LocalStorageService.clearMockData();
```

### **Claves Estándar:**
```javascript
const STORAGE_KEYS = {
  USUARIOS: 'usuarios_mock',
  EMPLEADOS: 'empleados_mock',
  CLIENTES: 'clientes_mock',
  VENTAS_PROCESO: 'ventas_proceso_mock',
  VENTAS_FINALIZADAS: 'ventas_finalizadas_mock',
  PAGOS: 'pagos_mock',
  CITAS: 'citas_mock',
  ROLES: 'roles_mock',
  SERVICIOS: 'servicios_mock'
};
```

## 🚀 **BENEFICIOS DE LAS CORRECCIONES**

### **1. Consistencia de Datos**
- Todas las claves de localStorage siguen el mismo patrón
- Eliminación de duplicaciones en definiciones de roles
- Validación centralizada de datos

### **2. Mantenibilidad**
- Un solo lugar para cambiar claves de localStorage
- Servicios centralizados para operaciones comunes
- Mejor manejo de errores

### **3. Escalabilidad**
- Fácil agregar nuevas entidades
- Patrón consistente para todos los servicios
- Preparado para migración a API real

## 📝 **PRÓXIMOS PASOS**

### **1. Aplicar Correcciones en Componentes**
```bash
# Buscar todos los usos de localStorage directo
grep -r "localStorage.getItem" src/ --exclude-dir=node_modules
grep -r "localStorage.setItem" src/ --exclude-dir=node_modules
```

### **2. Validar Consistencia**
```bash
# Verificar que no hay referencias a roles antiguos
grep -r "ROLES_SISTEMA" src/ --exclude-dir=node_modules
grep -r "ADMIN\|USUARIO\|EMPLEADO" src/ --exclude-dir=node_modules
```

### **3. Testing**
- Verificar que todos los componentes funcionan correctamente
- Probar operaciones CRUD en todas las entidades
- Validar que la autenticación funciona con roles unificados

## ⚠️ **ADVERTENCIAS**

### **1. Compatibilidad**
- Los datos existentes en localStorage pueden necesitar migración
- Considerar función de migración para datos antiguos

### **2. Testing**
- Probar exhaustivamente después de aplicar correcciones
- Verificar que no se pierden datos durante la migración

### **3. Documentación**
- Actualizar documentación de componentes
- Crear guías de migración para desarrolladores

---

**Estado**: 🔄 En Progreso  
**Fecha**: 2025-01-27  
**Versión**: 1.1.0 