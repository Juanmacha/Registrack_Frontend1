// Utilidades para manejo unificado de autenticación
export const AUTH_KEYS = {
  TOKEN: ['token', 'authToken', 'auth_token'],
  USER: ['user', 'currentUser', 'userData'],
  AUTH_STATUS: 'isAuthenticated'
};

// Obtener token desde cualquier ubicación posible
export const getToken = () => {
  for (const key of AUTH_KEYS.TOKEN) {
    const token = localStorage.getItem(key);
    if (token) {
      console.log(`🔑 [authUtils] Token encontrado en: ${key}`);
      return token;
    }
  }
  console.log('❌ [authUtils] No se encontró token en ninguna ubicación');
  return null;
};

// Obtener datos de usuario desde cualquier ubicación posible
export const getUser = () => {
  for (const key of AUTH_KEYS.USER) {
    const userData = localStorage.getItem(key);
    if (userData) {
      try {
        const user = JSON.parse(userData);
        console.log(`👤 [authUtils] Usuario encontrado en: ${key}`);
        return user;
      } catch (error) {
        console.error(`💥 [authUtils] Error al parsear usuario desde ${key}:`, error);
      }
    }
  }
  console.log('❌ [authUtils] No se encontró usuario en ninguna ubicación');
  return null;
};

// Verificar si está autenticado
export const isAuthenticated = () => {
  const token = getToken();
  const user = getUser();
  const authStatus = localStorage.getItem(AUTH_KEYS.AUTH_STATUS) === 'true';
  
  const authenticated = !!(token && user && authStatus);
  console.log(`🔍 [authUtils] Estado de autenticación:`, {
    hasToken: !!token,
    hasUser: !!user,
    authStatus,
    authenticated
  });
  
  return authenticated;
};

// Guardar datos de autenticación en todas las ubicaciones
export const saveAuthData = (token, userData) => {
  try {
    console.log('💾 [authUtils] Guardando datos de autenticación...');
    
    // Guardar token en todas las ubicaciones
    AUTH_KEYS.TOKEN.forEach(key => {
      localStorage.setItem(key, token);
    });
    
    // Guardar datos de usuario en todas las ubicaciones
    const userString = JSON.stringify(userData);
    AUTH_KEYS.USER.forEach(key => {
      localStorage.setItem(key, userString);
    });
    
    // Marcar como autenticado
    localStorage.setItem(AUTH_KEYS.AUTH_STATUS, 'true');
    
    console.log('✅ [authUtils] Datos de autenticación guardados correctamente');
    return true;
  } catch (error) {
    console.error('💥 [authUtils] Error al guardar datos de autenticación:', error);
    return false;
  }
};

// Limpiar todos los datos de autenticación
export const clearAuthData = () => {
  try {
    console.log('🧹 [authUtils] Limpiando datos de autenticación...');
    
    // Limpiar tokens
    AUTH_KEYS.TOKEN.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Limpiar datos de usuario
    AUTH_KEYS.USER.forEach(key => {
      localStorage.removeItem(key);
    });
    
    // Limpiar estado de autenticación
    localStorage.removeItem(AUTH_KEYS.AUTH_STATUS);
    
    console.log('✅ [authUtils] Datos de autenticación limpiados correctamente');
    return true;
  } catch (error) {
    console.error('💥 [authUtils] Error al limpiar datos de autenticación:', error);
    return false;
  }
};

// Sincronizar datos de autenticación existentes
export const syncAuthData = () => {
  try {
    console.log('🔄 [authUtils] Sincronizando datos de autenticación...');
    
    const token = getToken();
    const user = getUser();
    
    if (token && user) {
      // Si encontramos datos en alguna ubicación, sincronizar a todas
      saveAuthData(token, user);
      return true;
    } else {
      // Si no hay datos válidos, limpiar todo
      clearAuthData();
      return false;
    }
  } catch (error) {
    console.error('💥 [authUtils] Error al sincronizar datos de autenticación:', error);
    return false;
  }
};

// Debug: Mostrar estado completo de autenticación
export const debugAuthState = () => {
  console.log('🔍 [authUtils] Estado completo de autenticación:');
  console.log('📋 localStorage keys:', Object.keys(localStorage));
  
  AUTH_KEYS.TOKEN.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`🔑 ${key}:`, value ? `${value.substring(0, 20)}...` : 'No encontrado');
  });
  
  AUTH_KEYS.USER.forEach(key => {
    const value = localStorage.getItem(key);
    console.log(`👤 ${key}:`, value ? 'Encontrado' : 'No encontrado');
  });
  
  console.log(`✅ isAuthenticated:`, isAuthenticated());
};
