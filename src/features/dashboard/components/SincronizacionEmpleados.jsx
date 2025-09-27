import React, { useState } from 'react';
import Swal from 'sweetalert2';
import useSincronizacionEmpleados from '../hooks/useSincronizacionEmpleados.js';

// Componente para manejar la sincronización automática de empleados
const SincronizacionEmpleados = ({ 
  usuarioId, 
  rolAnterior, 
  nuevoRol, 
  onSincronizacionCompleta,
  mostrarNotificacion = true 
}) => {
  const [sincronizando, setSincronizando] = useState(false);
  const { 
    sincronizarCambioRol, 
    requiereSincronizacionEmpleado, 
    obtenerMensajeSincronizacion 
  } = useSincronizacionEmpleados();

  // Función para manejar la sincronización
  const manejarSincronizacion = async () => {
    if (!usuarioId || !nuevoRol) {
      console.error('❌ [SincronizacionEmpleados] Datos insuficientes para sincronización');
      return;
    }

    setSincronizando(true);

    try {
      console.log('🔄 [SincronizacionEmpleados] Iniciando sincronización...');
      
      const resultado = await sincronizarCambioRol(usuarioId, rolAnterior, nuevoRol);
      
      if (resultado.success) {
        console.log('✅ [SincronizacionEmpleados] Sincronización exitosa');
        
        if (mostrarNotificacion) {
          if (resultado.sincronizado) {
            Swal.fire({
              title: '✅ Sincronización Exitosa',
              text: 'El usuario ha sido automáticamente registrado como empleado',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false
            });
          } else {
            Swal.fire({
              title: 'ℹ️ Procesado',
              text: 'Cambio de rol procesado correctamente',
              icon: 'info',
              timer: 2000,
              showConfirmButton: false
            });
          }
        }
        
        // Llamar callback si se proporciona
        if (onSincronizacionCompleta) {
          onSincronizacionCompleta(resultado);
        }
      } else {
        console.error('❌ [SincronizacionEmpleados] Error en sincronización:', resultado.message);
        
        if (mostrarNotificacion) {
          Swal.fire({
            title: '❌ Error de Sincronización',
            text: resultado.message,
            icon: 'error',
            confirmButtonText: 'Entendido'
          });
        }
      }
    } catch (error) {
      console.error('💥 [SincronizacionEmpleados] Error inesperado:', error);
      
      if (mostrarNotificacion) {
        Swal.fire({
          title: '💥 Error Inesperado',
          text: 'Ocurrió un error durante la sincronización',
          icon: 'error',
          confirmButtonText: 'Entendido'
        });
      }
    } finally {
      setSincronizando(false);
    }
  };

  // Función para mostrar información de sincronización
  const mostrarInfoSincronizacion = () => {
    const mensaje = obtenerMensajeSincronizacion(nuevoRol);
    const requiereSincronizacion = requiereSincronizacionEmpleado(nuevoRol);
    
    Swal.fire({
      title: 'ℹ️ Información de Sincronización',
      text: mensaje,
      icon: requiereSincronizacion ? 'info' : 'question',
      showCancelButton: requiereSincronizacion,
      confirmButtonText: requiereSincronizacion ? 'Sincronizar' : 'Entendido',
      cancelButtonText: 'Cancelar'
    }).then((result) => {
      if (result.isConfirmed && requiereSincronizacion) {
        manejarSincronizacion();
      }
    });
  };

  // Si no hay datos suficientes, no renderizar nada
  if (!usuarioId || !nuevoRol) {
    return null;
  }

  return (
    <div className="sincronizacion-empleados">
      {sincronizando && (
        <div className="flex items-center gap-2 text-blue-600 mb-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          <span className="text-sm">Sincronizando empleado...</span>
        </div>
      )}
      
      {requiereSincronizacionEmpleado(nuevoRol) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-3">
          <div className="flex items-center gap-2">
            <i className="bi bi-info-circle text-blue-600"></i>
            <span className="text-sm text-blue-800">
              {obtenerMensajeSincronizacion(nuevoRol)}
            </span>
          </div>
          <button
            onClick={manejarSincronizacion}
            disabled={sincronizando}
            className="mt-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-md hover:bg-blue-700 disabled:opacity-50"
          >
            {sincronizando ? 'Sincronizando...' : 'Sincronizar Ahora'}
          </button>
        </div>
      )}
    </div>
  );
};

export default SincronizacionEmpleados;
