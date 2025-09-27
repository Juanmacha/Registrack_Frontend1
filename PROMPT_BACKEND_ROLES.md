# 🚀 PROMPT PARA IMPLEMENTAR GESTIÓN DE ROLES EN EL BACKEND

## 📋 DESCRIPCIÓN DEL PROBLEMA

Necesito modificar mi API de gestión de roles para que sea compatible con un frontend que maneja permisos granulares por módulo y acción. Actualmente mi API maneja permisos como arrays simples, pero el frontend necesita una estructura más detallada.

## 🔧 CAMBIOS NECESARIOS

### 1. MODIFICAR EL CONTROLADOR DE ROLES

- Agregar funciones de transformación entre el formato del frontend y la API
- El frontend envía permisos como objeto anidado: `{usuarios: {crear: true, leer: true, actualizar: false, eliminar: false}}`
- La API debe transformar esto a: `permisos: ["gestion_usuarios"], privilegios: ["crear", "leer"]`

### 2. FUNCIONES DE TRANSFORMACIÓN REQUERIDAS

- `transformPermisosToAPI()`: Convierte permisos del frontend al formato de la API
- `extractPrivilegios()`: Extrae las acciones activas de todos los módulos
- `transformRoleToFrontend()`: Convierte rol de la API al formato del frontend

### 3. MÓDULOS DISPONIBLES

- `usuarios`, `empleados`, `clientes`, `ventas`, `pagos`, `citas`, `roles`, `reportes`, `configuracion`
- Cada módulo tiene acciones: `crear`, `leer`, `actualizar`, `eliminar`

### 4. ENDPOINTS A MODIFICAR

- `GET /api/gestion-roles` (devolver en formato frontend)
- `POST /api/gestion-roles` (aceptar formato frontend)
- `PUT /api/gestion-roles/:id` (aceptar formato frontend)
- `GET /api/gestion-roles/:id` (devolver en formato frontend)

## 📊 ESTRUCTURAS DE DATOS

### ESTRUCTURA DE RESPUESTA ESPERADA (API → Frontend)

```json
{
  "id": "4",
  "nombre": "Supervisor", 
  "estado": "Activo",
  "permisos": {
    "usuarios": {
      "crear": true, 
      "leer": true, 
      "actualizar": false, 
      "eliminar": false
    },
    "clientes": {
      "crear": true, 
      "leer": true, 
      "actualizar": true, 
      "eliminar": false
    }
  }
}
```

### ESTRUCTURA DE ENTRADA ESPERADA (Frontend → API)

```json
{
  "nombre": "Supervisor",
  "estado": "Activo", 
  "permisos": {
    "usuarios": {
      "crear": true, 
      "leer": true, 
      "actualizar": false, 
      "eliminar": false
    }
  }
}
```

## 🔧 CÓDIGO A IMPLEMENTAR

### Función para transformar permisos del frontend a la API

```javascript
const transformPermisosToAPI = (permisosFrontend) => {
  const permisos = [];
  const privilegios = [];
  
  const modulos = ['usuarios', 'empleados', 'clientes', 'ventas', 'pagos', 'citas', 'roles', 'reportes', 'configuracion'];
  
  modulos.forEach(modulo => {
    if (permisosFrontend[modulo] && Object.values(permisosFrontend[modulo]).some(perm => perm === true)) {
      permisos.push(`gestion_${modulo}`);
      
      Object.keys(permisosFrontend[modulo]).forEach(accion => {
        if (permisosFrontend[modulo][accion] === true && !privilegios.includes(accion)) {
          privilegios.push(accion);
        }
      });
    }
  });
  
  return { permisos, privilegios };
};
```

### Función para transformar rol de la API al frontend

```javascript
const transformRoleToFrontend = (rolAPI) => {
  const permisos = {};
  const modulos = ['usuarios', 'empleados', 'clientes', 'ventas', 'pagos', 'citas', 'roles', 'reportes', 'configuracion'];
  
  // Inicializar todos los módulos
  modulos.forEach(modulo => {
    permisos[modulo] = {
      crear: false,
      leer: false,
      actualizar: false,
      eliminar: false
    };
  });
  
  // Procesar permisos de la API
  if (rolAPI.permisos) {
    rolAPI.permisos.forEach(perm => {
      const modulo = perm.replace('gestion_', '');
      if (permisos[modulo] && rolAPI.privilegios) {
        rolAPI.privilegios.forEach(priv => {
          if (permisos[modulo].hasOwnProperty(priv)) {
            permisos[modulo][priv] = true;
          }
        });
      }
    });
  }
  
  return {
    id: rolAPI.id_rol?.toString() || rolAPI.id?.toString(),
    nombre: rolAPI.nombre?.charAt(0).toUpperCase() + rolAPI.nombre?.slice(1),
    estado: rolAPI.estado ? 'Activo' : 'Inactivo',
    permisos: permisos
  };
};
```

### Ejemplo de controlador modificado

```javascript
// GET /api/gestion-roles
const getAllRoles = async (req, res) => {
  try {
    const roles = await roleService.getAll();
    const transformedRoles = roles.map(role => transformRoleToFrontend(role));
    
    res.json({
      success: true,
      data: transformedRoles
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// POST /api/gestion-roles
const createRole = async (req, res) => {
  try {
    const { nombre, permisos } = req.body;
    
    // Transformar permisos del frontend al formato de la API
    const { permisos: permisosAPI, privilegios } = transformPermisosToAPI(permisos);
    
    const rol = await roleService.create({
      nombre: nombre.toLowerCase(),
      permisos: permisosAPI,
      privilegios: privilegios
    });
    
    const transformedRole = transformRoleToFrontend(rol);
    
    res.json({
      success: true,
      data: transformedRole
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// PUT /api/gestion-roles/:id
const updateRole = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, permisos } = req.body;
    
    // Transformar permisos del frontend al formato de la API
    const { permisos: permisosAPI, privilegios } = transformPermisosToAPI(permisos);
    
    const rol = await roleService.update(id, {
      nombre: nombre.toLowerCase(),
      permisos: permisosAPI,
      privilegios: privilegios
    });
    
    const transformedRole = transformRoleToFrontend(rol);
    
    res.json({
      success: true,
      data: transformedRole
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// GET /api/gestion-roles/:id
const getRoleById = async (req, res) => {
  try {
    const { id } = req.params;
    const rol = await roleService.getById(id);
    
    if (!rol) {
      return res.status(404).json({ 
        success: false, 
        error: 'Rol no encontrado' 
      });
    }
    
    const transformedRole = transformRoleToFrontend(rol);
    
    res.json({
      success: true,
      data: transformedRole
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: error.message 
    });
  }
};

// PATCH /api/gestion-roles/:id/state
const changeRoleState = async (req, res) => {
  try {
    const { id } = req.params;
    const { estado } = req.body;
    
    const rol = await roleService.changeState(id, estado);
    const transformedRole = transformRoleToFrontend(rol);
    
    res.json({
      success: true,
      data: transformedRole
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
};
```

## 📁 ARCHIVOS A MODIFICAR

1. **Controlador de roles** (`src/controllers/rol.controller.js` o similar)
2. **Modelo de roles** (`src/models/Rol.js` o similar) - si es necesario
3. **Rutas de roles** (`src/routes/rol.routes.js` o similar)

## 🔍 VALIDACIONES A AGREGAR

```javascript
// Validar estructura de permisos del frontend
const validateFrontendPermissions = (permisos) => {
  const modulosValidos = ['usuarios', 'empleados', 'clientes', 'ventas', 'pagos', 'citas', 'roles', 'reportes', 'configuracion'];
  const accionesValidas = ['crear', 'leer', 'actualizar', 'eliminar'];
  
  if (typeof permisos !== 'object') {
    throw new Error('Los permisos deben ser un objeto');
  }
  
  Object.keys(permisos).forEach(modulo => {
    if (!modulosValidos.includes(modulo)) {
      throw new Error(`Módulo inválido: ${modulo}`);
    }
    
    if (typeof permisos[modulo] !== 'object') {
      throw new Error(`Los permisos del módulo ${modulo} deben ser un objeto`);
    }
    
    Object.keys(permisos[modulo]).forEach(accion => {
      if (!accionesValidas.includes(accion)) {
        throw new Error(`Acción inválida en ${modulo}: ${accion}`);
      }
      
      if (typeof permisos[modulo][accion] !== 'boolean') {
        throw new Error(`El permiso ${modulo}.${accion} debe ser un booleano`);
      }
    });
  });
};
```

## 🚀 LOGGING PARA DEBUGGING

```javascript
// Agregar logging en las funciones de transformación
const transformPermisosToAPI = (permisosFrontend) => {
  console.log('🔄 [Backend] Transformando permisos del frontend:', JSON.stringify(permisosFrontend, null, 2));
  
  const permisos = [];
  const privilegios = [];
  
  // ... código de transformación ...
  
  const result = { permisos, privilegios };
  console.log('✅ [Backend] Permisos transformados:', JSON.stringify(result, null, 2));
  
  return result;
};
```

## ⚠️ CONSIDERACIONES IMPORTANTES

1. **Mantener compatibilidad**: No romper la funcionalidad existente
2. **Validaciones robustas**: Validar todos los datos de entrada
3. **Logging detallado**: Para facilitar el debugging
4. **Manejo de errores**: Respuestas consistentes de error
5. **Capitalización**: Los nombres de roles deben capitalizarse correctamente

## 📋 CHECKLIST DE IMPLEMENTACIÓN

- [ ] Implementar función `transformPermisosToAPI()`
- [ ] Implementar función `transformRoleToFrontend()`
- [ ] Modificar endpoint `GET /api/gestion-roles`
- [ ] Modificar endpoint `POST /api/gestion-roles`
- [ ] Modificar endpoint `PUT /api/gestion-roles/:id`
- [ ] Modificar endpoint `GET /api/gestion-roles/:id`
- [ ] Modificar endpoint `PATCH /api/gestion-roles/:id/state`
- [ ] Agregar validaciones de entrada
- [ ] Agregar logging para debugging
- [ ] Probar todos los endpoints
- [ ] Verificar compatibilidad con frontend

## 🎯 RESULTADO ESPERADO

Después de implementar estos cambios, la API debería:

1. ✅ Aceptar permisos en formato granular del frontend
2. ✅ Devolver roles en formato compatible con el frontend
3. ✅ Mantener la funcionalidad existente
4. ✅ Proporcionar logging detallado para debugging
5. ✅ Validar correctamente todos los datos de entrada

---

**¡Implementa estos cambios y luego avísame para continuar con la conexión del frontend!** 🚀
