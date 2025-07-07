# Credenciales de Prueba - Sistema Actualizado

## Usuarios Administradores

### 1. Juan Pérez (Administrador)
- **Email**: `juan.perez@example.com`
- **Contraseña**: `123456`
- **Rol**: Administrador
- **Acceso**: Dashboard completo

### 2. Laura Torres (Administrador)
- **Email**: `laura.torres@example.com`
- **Contraseña**: `securepass`
- **Rol**: Administrador
- **Acceso**: Dashboard completo

### 3. Santiago Guerrero (Administrador)
- **Email**: `santiago.guerrero@example.com`
- **Contraseña**: `santi123`
- **Rol**: Administrador
- **Acceso**: Dashboard completo

## Usuarios Empleados

### 1. María García (Empleado)
- **Email**: `maria.garcia@example.com`
- **Contraseña**: `empleado123`
- **Rol**: Empleado
- **Acceso**: Dashboard con permisos limitados

### 2. Carlos Rodríguez (Empleado)
- **Email**: `carlos.rodriguez@example.com`
- **Contraseña**: `carlos123`
- **Rol**: Empleado
- **Acceso**: Dashboard con permisos limitados

## Usuarios Clientes

### 1. Carlos López (Cliente)
- **Email**: `carlos.lopez@example.com`
- **Contraseña**: `cliente123`
- **Rol**: Cliente
- **Acceso**: Solo página principal

### 2. Ana Martínez (Cliente)
- **Email**: `ana.martinez@example.com`
- **Contraseña**: `ana123`
- **Rol**: Cliente
- **Acceso**: Solo página principal

## Funcionalidades por Rol

### Administrador
✅ Acceso completo al dashboard
✅ Gestión de usuarios
✅ Gestión de empleados
✅ Gestión de clientes
✅ Gestión de ventas y servicios
✅ Gestión de pagos
✅ Gestión de citas
✅ Gestión de roles
✅ Reportes y configuración

### Empleado
✅ Acceso al dashboard
❌ Gestión de usuarios
❌ Gestión de empleados
✅ Gestión de clientes
✅ Gestión de ventas y servicios
✅ Gestión de pagos
✅ Gestión de citas
❌ Gestión de roles
✅ Lectura de reportes
❌ Configuración del sistema

### Cliente
❌ Acceso al dashboard
❌ Gestión de usuarios
❌ Gestión de empleados
❌ Gestión de clientes
❌ Gestión de ventas y servicios
✅ Ver sus propios pagos
✅ Crear citas
❌ Gestión de roles
❌ Reportes
❌ Configuración

## Instrucciones de Uso

1. **Para probar como Administrador**:
   - Usa cualquiera de las credenciales de administrador
   - Serás redirigido automáticamente al dashboard
   - Tendrás acceso completo a todas las funcionalidades

2. **Para probar como Empleado**:
   - Usa las credenciales de empleado
   - Serás redirigido al dashboard
   - Tendrás acceso limitado según los permisos

3. **Para probar como Cliente**:
   - Usa las credenciales de cliente
   - Serás redirigido a la página principal
   - Solo podrás ver tus propios datos

4. **Para registrar un nuevo usuario**:
   - Ve a la página de registro
   - Completa el formulario
   - El nuevo usuario tendrá rol "Cliente" por defecto

## Notas Importantes

- Todos los datos son mock (simulados)
- Los cambios se guardan en localStorage
- Al recargar la página, los datos se reinicializan
- El sistema está completamente funcional para pruebas 