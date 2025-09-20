import React, { createContext, useContext, useState, useEffect } from 'react';

// Crear el contexto de autenticación
const AuthContext = createContext();

// Hook personalizado para usar el contexto de autenticación
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe ser usado dentro de un AuthProvider');
  }
  return context;
};

// Proveedor del contexto de autenticación
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const TOKEN_KEY = "token";
  const USERS_KEY = "usuarios_mock";

  // Función para decodificar JWT
  const decodeToken = (token) => {
    try {
      const [, payload] = token.split(".");
      const decoded = JSON.parse(atob(payload));
      return decoded;
    } catch (error) {
      console.error("Error al decodificar el token:", error);
      return null;
    }
  };

  // Función para generar JWT simple (para desarrollo)
  const generateToken = (userData) => {
    const header = btoa(JSON.stringify({ alg: "HS256", typ: "JWT" }));
    const payload = btoa(JSON.stringify({
      id: userData.id,
      name: userData.firstName ? `${userData.firstName} ${userData.lastName}` : userData.name,
      firstName: userData.firstName,
      lastName: userData.lastName,
      email: userData.email,
      role: userData.role,
      documentType: userData.documentType,
      documentNumber: userData.documentNumber,
      estado: userData.estado,
      exp: Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas
    }));
    const signature = btoa("mock-signature"); // En producción usar una firma real
    return `${header}.${payload}.${signature}`;
  };

  // Verificar si hay un usuario logueado al cargar la aplicación
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const token = localStorage.getItem(TOKEN_KEY);
        if (token) {
          const decoded = decodeToken(token);
          if (decoded && decoded.exp > Math.floor(Date.now() / 1000)) {
            setUser(decoded);
          } else {
            // Token expirado
            localStorage.removeItem(TOKEN_KEY);
            localStorage.removeItem('currentUser'); // Limpiar datos antiguos
          }
        } else {
          // Migrar datos antiguos si existen
          const oldUser = localStorage.getItem('currentUser');
          if (oldUser) {
            const userData = JSON.parse(oldUser);
            const token = generateToken(userData);
            localStorage.setItem(TOKEN_KEY, token);
            setUser(decodeToken(token));
            localStorage.removeItem('currentUser'); // Limpiar datos antiguos
          }
        }
      } catch (error) {
        console.error('Error al verificar el estado de autenticación:', error);
        localStorage.removeItem(TOKEN_KEY);
        localStorage.removeItem('currentUser');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Función para iniciar sesión con email y password
  const login = async (email, password) => {
    try {
      const usuarios = JSON.parse(localStorage.getItem(USERS_KEY)) || [];

      const usuarioEncontrado = usuarios.find(
        user => user.email === email && user.password === password
      );

      if (!usuarioEncontrado) {
        return { success: false, message: "Credenciales inválidas" };
      }

      // Generar token JWT
      const token = generateToken(usuarioEncontrado);
      const userData = decodeToken(token);

      setUser(userData);
      localStorage.setItem(TOKEN_KEY, token);
      
      // Limpiar datos antiguos
      localStorage.removeItem('currentUser');

      return { success: true, user: userData };
    } catch (error) {
      console.error('Error en login:', error);
      return { success: false, message: "Error al iniciar sesión" };
    }
  };

  // Función para cerrar sesión
  const logout = () => {
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem('currentUser'); // Limpiar datos antiguos
  };

  // Función para actualizar datos del usuario
  const updateUser = (updatedUserData) => {
    const updatedUser = { ...user, ...updatedUserData };
    const token = generateToken(updatedUser);
    const decodedUser = decodeToken(token);
    
    setUser(decodedUser);
    localStorage.setItem(TOKEN_KEY, token);
  };

  // Verificar si el usuario está autenticado
  const isAuthenticated = () => {
    return user !== null;
  };

  // Verificar si el usuario tiene un rol específico
  const hasRole = (role) => {
    return user && user.role === role;
  };

  // Verificar si el usuario tiene uno de varios roles
  const hasAnyRole = (roles) => {
    return user && roles.includes(user.role);
  };

  // Funciones compatibles con authData
  const setToken = (token) => {
    localStorage.setItem(TOKEN_KEY, token);
    const decoded = decodeToken(token);
    setUser(decoded);
  };

  const getToken = () => {
    return localStorage.getItem(TOKEN_KEY);
  };

  const removeToken = () => {
    logout();
  };

  const getUser = () => {
    return user;
  };

  const value = {
    user,
    loading,
    login,
    logout,
    updateUser,
    isAuthenticated,
    hasRole,
    hasAnyRole,
    // Funciones compatibles con authData
    setToken,
    getToken,
    removeToken,
    getUser
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Exportar el contexto para uso directo si es necesario
export { AuthContext };
export default AuthContext;