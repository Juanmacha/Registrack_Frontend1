# Instrucciones para Probar la Sincronización

## Problema Identificado
El usuario reporta que cuando realiza una solicitud como cliente, no se refleja automáticamente en:
1. La tabla de ventas de servicios en procesos
2. La página "Mis Procesos"

## Solución Implementada
Se ha implementado un sistema de sincronización en tiempo real usando:
- `DataChangeNotifier` para notificar cambios
- `useSalesSync` hook para escuchar cambios
- Sincronización automática entre componentes

## Pasos para Probar

### 1. Acceder a la Página de Prueba
Abre tu navegador y ve a: `http://localhost:5173/test-sync`

### 2. Verificar el Estado Actual
- En la página de prueba verás dos paneles:
  - **Todas las Ventas en Proceso**: Muestra todas las ventas del sistema
  - **Procesos del Usuario**: Muestra solo las ventas del email especificado

### 3. Probar la Sincronización
1. **Cambia el email de prueba** si quieres (por defecto es `test@example.com`)
2. **Haz clic en "Crear Venta de Prueba"**
3. **Observa los paneles** - deberían actualizarse automáticamente
4. **Verifica en la consola del navegador** los logs de depuración

### 4. Verificar Logs de Depuración
Abre las herramientas de desarrollador (F12) y ve a la pestaña Console. Deberías ver logs como:
```
[DataChangeNotifier] Notificando cambio de venta: create
[useDataSync] Recibida notificación: sale - create
[useDataSync] sale changed: create
```

### 5. Probar en Páginas Reales
1. **Ve a la tabla de ventas**: `http://localhost:5173/admin/ventasServiciosProceso`
2. **Ve a Mis Procesos**: `http://localhost:5173/misprocesos`
3. **Crea una solicitud real** desde el landing page
4. **Verifica que aparezca automáticamente** en ambas páginas

## Posibles Problemas y Soluciones

### Problema: No aparece automáticamente
**Solución**: 
- Verifica que los logs de depuración aparezcan en la consola
- Si no hay logs, el problema está en la notificación
- Si hay logs pero no se actualiza, el problema está en el hook

### Problema: Solo aparece en una página
**Solución**:
- Verifica que ambas páginas estén usando el hook `useSalesSync`
- Asegúrate de que el email del usuario coincida en ambas páginas

### Problema: No se actualiza al crear desde el landing
**Solución**:
- Verifica que `crearVenta` esté usando `SaleService.create`
- Asegúrate de que el usuario esté autenticado

## Archivos Clave para Verificar

### 1. Notificación de Cambios
- `src/utils/mockDataService.js` - `DataChangeNotifier` y `SaleService.create`

### 2. Hook de Sincronización
- `src/utils/hooks/useDataSync.js` - `useSalesSync`

### 3. Componentes que Usan Sincronización
- `src/features/dashboard/pages/gestionVentasServicios/components/tablaVentasProceso.jsx`
- `src/features/dashboard/pages/misProcesos/MisProcesos.jsx`

### 4. Servicio de Creación
- `src/features/dashboard/pages/gestionVentasServicios/services/ventasService.js` - `crearVenta`

## Comandos Útiles

### Reiniciar el Servidor
```bash
npm run dev
```

### Limpiar Datos de Prueba
En la página de prueba, haz clic en "Limpiar Datos"

### Verificar Logs
1. Abre las herramientas de desarrollador (F12)
2. Ve a la pestaña Console
3. Busca logs que empiecen con `[DataChangeNotifier]` o `[useDataSync]`

## Estado Esperado
✅ **Funcionando Correctamente**: 
- Al crear una venta, aparece automáticamente en ambas páginas
- Los logs de depuración muestran la notificación y actualización
- No se requiere refrescar manualmente la página

❌ **Problema Detectado**:
- Las ventas no aparecen automáticamente
- Los logs no aparecen en la consola
- Se requiere refrescar manualmente para ver los cambios

## Contacto
Si encuentras problemas, verifica:
1. Que el servidor esté funcionando en `http://localhost:5173`
2. Que no haya errores en la consola del navegador
3. Que los logs de depuración aparezcan correctamente 