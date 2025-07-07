# Alertas del Módulo de Gestión de Citas

## Servicio de Alertas Específico

Se ha creado un servicio especializado para las alertas del módulo de citas (`src/utils/citaAlertService.js`) que proporciona alertas específicas y contextuales para todas las operaciones relacionadas con citas.

## Alertas Disponibles

### 1. Alertas de Validación

#### Fecha No Válida
```javascript
citaAlertService.fechaNoValida();
```
- **Uso**: Cuando se intenta agendar una cita en una fecha anterior a hoy
- **Tipo**: Warning
- **Mensaje**: "No puedes agendar citas en fechas anteriores a hoy."

#### Validación de Campos
```javascript
citaAlertService.validacionCampos("nombre");
```
- **Uso**: Cuando falta completar un campo requerido
- **Tipo**: Validation Error
- **Mensaje**: "Por favor, completa el campo: [campo]"

### 2. Alertas de Operaciones Exitosas

#### Cita Agendada
```javascript
await citaAlertService.citaAgendada();
```
- **Uso**: Cuando se agenda una nueva cita exitosamente
- **Tipo**: Success
- **Mensaje**: "La cita ha sido agendada correctamente."

#### Cita Reprogramada
```javascript
await citaAlertService.citaReprogramada();
```
- **Uso**: Cuando se reprograma una cita existente
- **Tipo**: Success
- **Mensaje**: "La cita ha sido reprogramada correctamente."

#### Cita Anulada
```javascript
await citaAlertService.citaAnulada();
```
- **Uso**: Cuando se anula una cita
- **Tipo**: Success
- **Mensaje**: "La cita ha sido anulada correctamente."

### 3. Alertas de Confirmación

#### Confirmar Anulación
```javascript
const result = await citaAlertService.confirmarAnulacion();
if (result.isConfirmed) {
  // Proceder con la anulación
}
```
- **Uso**: Antes de anular una cita
- **Tipo**: Confirmation
- **Mensaje**: "¿Estás seguro de que quieres anular esta cita? Esta acción no se puede deshacer."

#### Confirmar Reprogramación
```javascript
const result = await citaAlertService.confirmarReprogramacion();
if (result.isConfirmed) {
  // Proceder con la reprogramación
}
```
- **Uso**: Antes de reprogramar una cita
- **Tipo**: Confirmation
- **Mensaje**: "¿Estás seguro de que quieres reprogramar esta cita?"

### 4. Alertas de Carga

#### Cargando Agendar
```javascript
const loading = citaAlertService.cargandoAgendar();
// ... operación
alertService.close();
```
- **Uso**: Durante el proceso de agendar una cita
- **Mensaje**: "Agendando cita..."

#### Cargando Reprogramar
```javascript
const loading = citaAlertService.cargandoReprogramar();
// ... operación
alertService.close();
```
- **Uso**: Durante el proceso de reprogramar una cita
- **Mensaje**: "Reprogramando cita..."

#### Cargando Anular
```javascript
const loading = citaAlertService.cargandoAnular();
// ... operación
alertService.close();
```
- **Uso**: Durante el proceso de anular una cita
- **Mensaje**: "Anulando cita..."

### 5. Alertas de Error

#### Error al Procesar Cita
```javascript
citaAlertService.errorProcesarCita();
```
- **Uso**: Cuando falla el proceso de agendar/reprogramar una cita
- **Tipo**: Error
- **Mensaje**: "Error al procesar la cita. Por favor, intenta de nuevo."

#### Error al Anular Cita
```javascript
citaAlertService.errorAnularCita();
```
- **Uso**: Cuando falla el proceso de anular una cita
- **Tipo**: Error
- **Mensaje**: "Error al anular la cita. Por favor, intenta de nuevo."

#### Error al Reprogramar Cita
```javascript
citaAlertService.errorReprogramarCita();
```
- **Uso**: Cuando falla el proceso de reprogramar una cita
- **Tipo**: Error
- **Mensaje**: "Error al reprogramar la cita. Por favor, intenta de nuevo."

### 6. Alertas Informativas

#### Información del Calendario
```javascript
citaAlertService.infoCalendario();
```
- **Uso**: Para mostrar información sobre el funcionamiento del calendario
- **Tipo**: Info
- **Mensaje**: Explica los colores y funcionalidades del calendario

#### Cita Próxima
```javascript
citaAlertService.citaProxima("Juan Pérez", "14:30");
```
- **Uso**: Para recordar citas próximas
- **Tipo**: Info
- **Mensaje**: "Recordatorio: [nombre] tiene una cita programada a las [hora]."

#### Cita Vencida
```javascript
citaAlertService.citaVencida("Juan Pérez");
```
- **Uso**: Para alertar sobre citas que han vencido
- **Tipo**: Warning
- **Mensaje**: "La cita de [nombre] ha vencido. Por favor, reprograma o anula la cita."

### 7. Alertas de Gestión del Calendario

#### Confirmar Limpiar Calendario
```javascript
const result = await citaAlertService.confirmarLimpiarCalendario();
if (result.isConfirmed) {
  // Limpiar todas las citas
}
```
- **Uso**: Antes de eliminar todas las citas del calendario
- **Tipo**: Confirmation
- **Mensaje**: "¿Estás seguro de que quieres eliminar todas las citas del calendario? Esta acción no se puede deshacer."

#### Calendario Limpio
```javascript
await citaAlertService.calendarioLimpio();
```
- **Uso**: Después de limpiar todas las citas
- **Tipo**: Success
- **Mensaje**: "Todas las citas han sido eliminadas del calendario."

### 8. Alertas de Exportación

#### Exportación Exitosa
```javascript
citaAlertService.exportarExitoso();
```
- **Uso**: Cuando se exportan las citas exitosamente
- **Tipo**: Success
- **Mensaje**: "Las citas han sido exportadas correctamente."

#### Error de Exportación
```javascript
citaAlertService.errorExportar();
```
- **Uso**: Cuando falla la exportación de citas
- **Tipo**: Error
- **Mensaje**: "Error al exportar las citas. Por favor, intenta de nuevo."

## Ejemplo de Implementación Completa

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

const handleAnularCita = async (idCita) => {
  try {
    // Confirmar anulación
    const result = await citaAlertService.confirmarAnulacion();
    
    if (result.isConfirmed) {
      // Mostrar carga
      const loading = citaAlertService.cargandoAnular();
      
      // Simular operación
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Anular cita
      await anularCita(idCita);
      
      // Mostrar éxito
      alertService.close();
      await citaAlertService.citaAnulada();
    }
  } catch (error) {
    alertService.close();
    citaAlertService.errorAnularCita();
  }
};
```

## Beneficios del Servicio Especializado

1. **Consistencia**: Todas las alertas de citas tienen el mismo estilo y comportamiento
2. **Mantenibilidad**: Fácil modificar mensajes y comportamientos centralizados
3. **Reutilización**: Alertas específicas que se pueden usar en cualquier parte del módulo
4. **Experiencia de Usuario**: Mensajes claros y contextuales
5. **Escalabilidad**: Fácil agregar nuevas alertas específicas para citas

## Integración con el Sistema General

El servicio de alertas de citas extiende el servicio general de alertas, manteniendo la consistencia visual y funcional mientras proporciona funcionalidades específicas para el módulo de citas. 