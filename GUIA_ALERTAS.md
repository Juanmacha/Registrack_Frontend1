# Guía de Alertas SweetAlert2

## Instalación

SweetAlert2 ya está instalado en el proyecto. Para usarlo, simplemente importa el servicio de alertas:

```javascript
import alertService from '../utils/alertService.js';
```

## Tipos de Alertas Disponibles

### 1. Alertas Básicas

#### Éxito
```javascript
alertService.success('¡Éxito!', 'La operación se completó correctamente.');
```

#### Error
```javascript
alertService.error('Error', 'Ocurrió un error durante la operación.');
```

#### Advertencia
```javascript
alertService.warning('Advertencia', 'Ten cuidado con esta acción.');
```

#### Información
```javascript
alertService.info('Información', 'Esta es una alerta informativa.');
```

### 2. Confirmaciones

#### Pregunta Simple
```javascript
const result = await alertService.question('¿Estás seguro?', '¿Quieres continuar?');
if (result.isConfirmed) {
  // Usuario confirmó
}
```

#### Confirmación Personalizada
```javascript
const result = await alertService.confirm(
  'Confirmar acción',
  '¿Estás seguro de que quieres realizar esta acción?',
  'Sí, continuar',
  'No, cancelar'
);
if (result.isConfirmed) {
  // Usuario confirmó
}
```

### 3. Alertas Específicas

#### Login Exitoso
```javascript
await alertService.loginSuccess('Juan Pérez');
```

#### Login Fallido
```javascript
alertService.loginError();
```

#### Registro Exitoso
```javascript
await alertService.registerSuccess();
```

#### Registro Fallido
```javascript
alertService.registerError('El email ya está registrado');
```

#### Logout
```javascript
const result = await alertService.logoutConfirm();
if (result.isConfirmed) {
  // Cerrar sesión
}
```

#### Eliminación
```javascript
const result = await alertService.deleteConfirm('este usuario');
if (result.isConfirmed) {
  // Eliminar elemento
  alertService.deleteSuccess('el usuario');
}
```

#### Guardado Exitoso
```javascript
alertService.saveSuccess('los datos del usuario');
```

#### Error de Guardado
```javascript
alertService.saveError('Error al guardar los datos');
```

#### Error de Validación
```javascript
alertService.validationError('Por favor, completa todos los campos');
```

#### Acceso Denegado
```javascript
alertService.accessDenied();
```

#### Sesión Expirada
```javascript
alertService.sessionExpired();
```

### 4. Alertas Avanzadas

#### Alerta de Carga
```javascript
const loadingAlert = alertService.loading('Procesando datos...');

// Realizar operación asíncrona
try {
  await someAsyncOperation();
  alertService.close();
  alertService.success('Completado', 'Operación exitosa');
} catch (error) {
  alertService.close();
  alertService.error('Error', 'Operación fallida');
}
```

#### Cerrar Alerta
```javascript
alertService.close();
```

## Ejemplos de Uso en Componentes

### Login Component
```javascript
const handleLogin = async () => {
  try {
    const loadingAlert = alertService.loading("Iniciando sesión...");
    
    const user = await authenticateUser(credentials);
    
    alertService.close();
    
    if (user) {
      await alertService.loginSuccess(`${user.firstName} ${user.lastName}`);
      navigate("/dashboard");
    } else {
      alertService.loginError();
    }
  } catch (error) {
    alertService.close();
    alertService.error("Error", "Error al iniciar sesión");
  }
};
```

### Eliminación con Confirmación
```javascript
const handleDelete = async (userId) => {
  const result = await alertService.deleteConfirm('este usuario');
  
  if (result.isConfirmed) {
    try {
      const loadingAlert = alertService.loading('Eliminando usuario...');
      
      await deleteUser(userId);
      
      alertService.close();
      alertService.deleteSuccess('el usuario');
      
      // Actualizar lista
      refreshUserList();
    } catch (error) {
      alertService.close();
      alertService.error('Error', 'No se pudo eliminar el usuario');
    }
  }
};
```

### Validación de Formulario
```javascript
const handleSubmit = async (formData) => {
  // Validar campos
  if (!formData.name || !formData.email) {
    alertService.validationError('Por favor, completa todos los campos requeridos');
    return;
  }
  
  if (formData.password.length < 6) {
    alertService.validationError('La contraseña debe tener al menos 6 caracteres');
    return;
  }
  
  try {
    const loadingAlert = alertService.loading('Guardando datos...');
    
    await saveUser(formData);
    
    alertService.close();
    alertService.saveSuccess('los datos del usuario');
    
    navigate('/users');
  } catch (error) {
    alertService.close();
    alertService.saveError('Error al guardar los datos');
  }
};
```

### Logout con Confirmación
```javascript
const handleLogout = async () => {
  const result = await alertService.logoutConfirm();
  
  if (result.isConfirmed) {
    // Limpiar localStorage
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    
    await alertService.success('Sesión cerrada', 'Has cerrado sesión correctamente');
    
    navigate('/login');
  }
};
```

## Personalización

### Opciones Adicionales
Puedes pasar opciones adicionales a cualquier alerta:

```javascript
alertService.success('Título', 'Mensaje', {
  timer: 3000,
  timerProgressBar: true,
  showConfirmButton: false
});
```

### Configuración Global
La configuración personalizada incluye:
- Colores de botones personalizados
- Bordes redondeados
- Sombras
- Estilos de texto
- Backdrop personalizado

## Mejores Prácticas

1. **Siempre maneja errores**: Usa try-catch para operaciones que pueden fallar
2. **Cierra alertas de carga**: Siempre cierra las alertas de carga después de completar operaciones
3. **Usa confirmaciones para acciones destructivas**: Siempre pide confirmación antes de eliminar
4. **Proporciona feedback claro**: Usa mensajes específicos y útiles
5. **Mantén consistencia**: Usa los mismos tipos de alertas para acciones similares

## Componente de Ejemplo

Se ha creado un componente de ejemplo en `src/components/AlertExamples.jsx` que muestra todos los tipos de alertas disponibles. Puedes usarlo como referencia para implementar alertas en tus componentes.

## Notas Importantes

- Todas las alertas son asíncronas y devuelven una Promise
- Las alertas de confirmación devuelven un objeto con `isConfirmed`
- Las alertas de carga deben cerrarse manualmente con `alertService.close()`
- El diseño es responsive y se adapta a diferentes tamaños de pantalla 