import { useState, useEffect } from 'react';
import { getToken, getUser, isAuthenticated, saveAuthData, clearAuthData, syncAuthData } from '../../../shared/utils/authUtils.js';

const useAuth = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = () => {
    try {
      console.log('🔍 [useAuth] Verificando autenticación...');
      
      // Sincronizar datos de autenticación existentes
      const synced = syncAuthData();
      
      if (synced) {
        const token = getToken();
        const userData = getUser();
        
        if (token && userData) {
          setIsAuthenticated(true);
          setUser(userData);
          console.log('✅ [useAuth] Usuario autenticado correctamente');
        } else {
          setIsAuthenticated(false);
          setUser(null);
          console.log('❌ [useAuth] Datos de autenticación incompletos');
        }
      } else {
        setIsAuthenticated(false);
        setUser(null);
        console.log('❌ [useAuth] Usuario no autenticado');
      }
    } catch (error) {
      console.error('💥 [useAuth] Error checking auth:', error);
      setIsAuthenticated(false);
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const login = (token, userData) => {
    try {
      console.log('💾 [useAuth] Guardando datos de autenticación...');
      
      // Usar utilidades unificadas para guardar
      const success = saveAuthData(token, userData);
      
      if (success) {
        setIsAuthenticated(true);
        setUser(userData);
        console.log('✅ [useAuth] Datos de autenticación guardados correctamente');
      } else {
        console.error('❌ [useAuth] Error al guardar datos de autenticación');
      }
    } catch (error) {
      console.error('💥 [useAuth] Error saving auth data:', error);
    }
  };

  const logout = () => {
    try {
      console.log('🧹 [useAuth] Limpiando datos de autenticación...');
      
      // Usar utilidades unificadas para limpiar
      const success = clearAuthData();
      
      if (success) {
        setIsAuthenticated(false);
        setUser(null);
        console.log('✅ [useAuth] Datos de autenticación limpiados correctamente');
      } else {
        console.error('❌ [useAuth] Error al limpiar datos de autenticación');
      }
    } catch (error) {
      console.error('💥 [useAuth] Error clearing auth data:', error);
    }
  };

  const refreshAuth = () => {
    checkAuth();
  };

  return {
    isAuthenticated,
    isLoading,
    user,
    login,
    logout,
    refreshAuth
  };
};

export default useAuth;
