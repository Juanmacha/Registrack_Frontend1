import { useState, useEffect } from "react";
import { DataChangeNotifier } from "../mockDataService.js";

/**
 * Hook personalizado para sincronizar datos entre componentes
 * @param {string} dataType - Tipo de datos a sincronizar ('sale', 'user', etc.)
 * @param {Function} dataFetcher - Función para obtener los datos actualizados
 * @param {Array} dependencies - Dependencias adicionales para el useEffect
 * @returns {Array} [data, refreshData] - Datos actuales y función para refrescar manualmente
 */
export const useDataSync = (dataType, dataFetcher, dependencies = []) => {
  const [data, setData] = useState(() => dataFetcher());
  const [lastUpdate, setLastUpdate] = useState(Date.now());

  // Función para refrescar datos
  const refreshData = () => {
    const newData = dataFetcher();
    setData(newData);
    setLastUpdate(Date.now());
  };

  // Efecto para manejar cambios de datos
  useEffect(() => {
    console.log(`🔧 [useDataSync] Configurando listener para ${dataType}`);
    const unsubscribe = DataChangeNotifier.subscribe(
      (changedDataType, action, changedData) => {
        console.log(
          `🔧 [useDataSync] Recibida notificación: ${changedDataType} - ${action}`,
          changedData
        );
        // Solo actualizar si el tipo de datos coincide
        if (changedDataType === dataType) {
          console.log(
            `🔧 [useDataSync] ${dataType} changed:`,
            action,
            changedData
          );
          refreshData();
        } else {
          console.log(
            `🔧 [useDataSync] Ignorando notificación de tipo ${changedDataType} (esperado: ${dataType})`
          );
        }
      }
    );

    return unsubscribe;
  }, [dataType, ...dependencies]);

  // Efecto para refrescar datos cuando cambian las dependencias
  useEffect(() => {
    refreshData();
  }, dependencies);

  return [data, refreshData, lastUpdate];
};

/**
 * Hook específico para sincronizar ventas
 * @param {Function} dataFetcher - Función para obtener ventas
 * @param {Array} dependencies - Dependencias adicionales
 * @returns {Array} [ventas, refreshVentas, lastUpdate]
 */
export const useSalesSync = (dataFetcher, dependencies = []) => {
  return useDataSync("sale", dataFetcher, dependencies);
};

/**
 * Hook específico para sincronizar usuarios
 * @param {Function} dataFetcher - Función para obtener usuarios
 * @param {Array} dependencies - Dependencias adicionales
 * @returns {Array} [usuarios, refreshUsuarios, lastUpdate]
 */
export const useUsersSync = (dataFetcher, dependencies = []) => {
  return useDataSync("user", dataFetcher, dependencies);
};

/**
 * Hook específico para sincronizar citas
 * @param {Function} dataFetcher - Función para obtener citas
 * @param {Array} dependencies - Dependencias adicionales
 * @returns {Array} [citas, refreshCitas, lastUpdate]
 */
export const useAppointmentsSync = (dataFetcher, dependencies = []) => {
  return useDataSync("appointment", dataFetcher, dependencies);
};

/**
 * Hook específico para sincronizar empleados
 * @param {Function} dataFetcher - Función para obtener empleados
 * @param {Array} dependencies - Dependencias adicionales
 * @returns {Array} [empleados, refreshEmpleados, lastUpdate]
 */
export const useEmployeesSync = (dataFetcher, dependencies = []) => {
  return useDataSync("employee", dataFetcher, dependencies);
};

/**
 * Hook específico para sincronizar clientes
 * @param {Function} dataFetcher - Función para obtener clientes
 * @param {Array} dependencies - Dependencias adicionales
 * @returns {Array} [clientes, refreshClientes, lastUpdate]
 */
export const useClientsSync = (dataFetcher, dependencies = []) => {
  return useDataSync("client", dataFetcher, dependencies);
};
