// Servicio para manejar la lógica de edición de ventas
import { actualizarVenta } from './ventasService';

// Función para editar una venta
export const editarVenta = (id, datosActualizados) => {
  try {
    const resultado = actualizarVenta(id, datosActualizados);
    return resultado;
  } catch (error) {
    console.error('Error al editar la venta:', error);
    throw error;
  }
};