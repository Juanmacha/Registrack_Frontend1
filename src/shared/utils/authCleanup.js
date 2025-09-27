// Utilidades para limpieza de autenticación
// Este archivo centraliza la lógica de limpieza de datos de autenticación

// Lista de todas las claves de autenticación que pueden existir en localStorage
const AUTH_KEYS = [
  'token', 'authToken', 'auth_token',
  'user', 'currentUser', 'userData',
  'isAuthenticated'
];

/**
 * Limpia todos los datos de autenticación del localStorage
 * @param {boolean} verbose - Si true, muestra logs detallados
 */
export const clearAllAuthData = (verbose = true) => {
  if (verbose) {
    console.log('🧹 [AuthCleanup] Iniciando limpieza de datos de autenticación...');
  }
  
  let cleanedCount = 0;
  
  AUTH_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      localStorage.removeItem(key);
      cleanedCount++;
      if (verbose) {
        console.log(`🗑️ [AuthCleanup] Removido: ${key}`);
      }
    }
  });
  
  if (verbose) {
    console.log(`✅ [AuthCleanup] Limpieza completada. ${cleanedCount} elementos removidos.`);
  }
  
  return cleanedCount;
};

/**
 * Verifica si hay datos de autenticación en localStorage
 * @returns {boolean} true si hay datos de autenticación
 */
export const hasAuthData = () => {
  return AUTH_KEYS.some(key => localStorage.getItem(key) !== null);
};

/**
 * Obtiene todas las claves de autenticación que existen en localStorage
 * @returns {string[]} Array de claves que existen
 */
export const getExistingAuthKeys = () => {
  return AUTH_KEYS.filter(key => localStorage.getItem(key) !== null);
};

/**
 * Muestra un resumen del estado de autenticación en localStorage
 */
export const debugAuthState = () => {
  console.log('🔍 [AuthCleanup] Estado de autenticación:');
  console.log('📋 localStorage keys:', Object.keys(localStorage));
  
  AUTH_KEYS.forEach(key => {
    const value = localStorage.getItem(key);
    if (value) {
      if (key.includes('token')) {
        console.log(`🔑 ${key}:`, value.substring(0, 20) + '...');
      } else {
        console.log(`👤 ${key}:`, 'Encontrado');
      }
    } else {
      console.log(`❌ ${key}:`, 'No encontrado');
    }
  });
  
  const existingKeys = getExistingAuthKeys();
  console.log(`📊 Total de claves de autenticación encontradas: ${existingKeys.length}/${AUTH_KEYS.length}`);
};

/**
 * Limpia datos de autenticación y redirige al login
 * @param {string} redirectPath - Ruta a la que redirigir (por defecto '/login')
 * @param {number} delay - Delay en milisegundos antes de redirigir (por defecto 1000)
 */
export const clearAuthAndRedirect = (redirectPath = '/login', delay = 1000) => {
  clearAllAuthData();
  
  setTimeout(() => {
    window.location.href = redirectPath;
  }, delay);
};

export default {
  clearAllAuthData,
  hasAuthData,
  getExistingAuthKeys,
  debugAuthState,
  clearAuthAndRedirect
};
