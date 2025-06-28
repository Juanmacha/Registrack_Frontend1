// Servicio para manejar la lógica de eliminación/anulación de ventas
import { actualizarVenta } from './ventasService';

// Función para anular una venta
export const anularVenta = (id) => {
  try {
    const resultado = actualizarVenta(id, { estado: 'Anulado' });
    return resultado;
  } catch (error) {
    console.error('Error al anular la venta:', error);
    throw error;
  }
};