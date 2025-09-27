import { useCallback } from 'react';
import empleadosApiService from '../services/empleadosApiService.js';

// Hook personalizado para manejar la sincronización entre usuarios y empleados
const useSincronizacionEmpleados = () => {
  
  // Función para sincronizar cuando se cambia el rol de un usuario
  const sincronizarCambioRol = useCallback(async (usuarioId, rolAnterior, nuevoRol) => {
    try {
      console.log('🔄 [useSincronizacionEmpleados] Sincronizando cambio de rol...');
      console.log('👤 [useSincronizacionEmpleados] Usuario ID:', usuarioId);
      console.log('🔄 [useSincronizacionEmpleados] Rol anterior:', rolAnterior, '→ Nuevo rol:', nuevoRol);
      
      // Notificar al servicio de empleados sobre el cambio de rol
      const resultado = await empleadosApiService.notificarCambioRolUsuario(
        usuarioId, 
        rolAnterior, 
        nuevoRol
      );
      
      if (resultado.success) {
        console.log('✅ [useSincronizacionEmpleados] Sincronización exitosa:', resultado.message);
        
        // Si se sincronizó como empleado, mostrar notificación
        if (resultado.sincronizado) {
          console.log('🎉 [useSincronizacionEmpleados] Usuario sincronizado como empleado');
          return {
            success: true,
            message: 'Usuario sincronizado como empleado correctamente',
            sincronizado: true
          };
        } else {
          return {
            success: true,
            message: 'Cambio de rol procesado correctamente',
            sincronizado: false
          };
        }
      } else {
        console.error('❌ [useSincronizacionEmpleados] Error en sincronización:', resultado.message);
        return {
          success: false,
          message: 'Error al sincronizar cambio de rol: ' + resultado.message,
          sincronizado: false
        };
      }
    } catch (error) {
      console.error('💥 [useSincronizacionEmpleados] Error al sincronizar cambio de rol:', error);
      return {
        success: false,
        message: 'Error al sincronizar cambio de rol',
        sincronizado: false
      };
    }
  }, []);

  // Función para verificar si un rol requiere sincronización como empleado
  const requiereSincronizacionEmpleado = useCallback((rol) => {
    const rolesEmpleados = ['empleado', 'Empleado', 'administrador', 'Administrador'];
    return rolesEmpleados.includes(rol);
  }, []);

  // Función para obtener mensaje de sincronización
  const obtenerMensajeSincronizacion = useCallback((rol) => {
    if (requiereSincronizacionEmpleado(rol)) {
      return `El usuario será automáticamente registrado como empleado con rol "${rol}"`;
    }
    return `El usuario no requiere registro como empleado`;
  }, [requiereSincronizacionEmpleado]);

  return {
    sincronizarCambioRol,
    requiereSincronizacionEmpleado,
    obtenerMensajeSincronizacion
  };
};

export default useSincronizacionEmpleados;
