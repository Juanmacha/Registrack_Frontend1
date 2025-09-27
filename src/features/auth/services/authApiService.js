import apiService from '../../../shared/services/apiService.js';
import { clearAllAuthData } from '../../../shared/utils/authCleanup.js';
import API_CONFIG from '../../../shared/config/apiConfig.js';

// Servicio de autenticación que consume la API real
const authApiService = {
  // Iniciar sesión
  login: async (credentials) => {
    try {
      console.log('🔐 Intentando login con:', {
        email: credentials.email,
        endpoint: API_CONFIG.ENDPOINTS.LOGIN,
        url: `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`
      });

      const response = await apiService.post(API_CONFIG.ENDPOINTS.LOGIN, {
        correo: credentials.email,
        contrasena: credentials.password
      });

      console.log('📥 Respuesta del servidor:', response);

      if (response.success || response.mensaje) {
        // Guardar token y datos del usuario
        const token = response.data?.token || response.token;
        let user = response.data?.usuario || response.usuario || response.user;
        
        // ✅ Los roles ahora están correctos en la base de datos
        // No se necesita corrección adicional
        
        console.log('✅ Login exitoso, guardando datos:', { 
          token: token ? 'Presente' : 'Ausente', 
          user: user ? 'Presente' : 'Ausente',
          tokenValue: token,
          userValue: user
        });
        
        if (token && user) {
          // Limpiar datos de autenticación anteriores antes de guardar los nuevos
          console.log('🧹 [AuthApiService] Limpiando datos de autenticación anteriores...');
          clearAllAuthData(false); // Limpiar sin logs verbosos
          
          // Guardar nuevos datos de autenticación
          console.log('💾 [AuthApiService] Guardando nuevos datos de autenticación...');
          localStorage.setItem('authToken', token);
          localStorage.setItem('token', token); // Para compatibilidad
          localStorage.setItem('currentUser', JSON.stringify(user));
          localStorage.setItem('user', JSON.stringify(user)); // Para compatibilidad
          localStorage.setItem('userData', JSON.stringify(user)); // Para compatibilidad
          localStorage.setItem('isAuthenticated', 'true');

          return {
            success: true,
            token,
            user,
            message: response.message || response.mensaje || 'Login exitoso'
          };
        } else {
          console.log('❌ Token o usuario faltante:', { token, user });
          return {
            success: false,
            message: 'Error: Token o datos de usuario no encontrados en la respuesta'
          };
        }
      } else {
        console.log('❌ Login falló, respuesta:', response);
        return {
          success: false,
          message: response.error || 'Error en el login'
        };
      }
    } catch (error) {
      console.error('💥 Error completo en login:', error);
      console.error('Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        stack: error.stack
      });
      
      let errorMessage = 'Error de conexión con el servidor';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.response?.status === 401) {
        errorMessage = 'Credenciales incorrectas';
      } else if (error.response?.status === 404) {
        errorMessage = 'Usuario no encontrado';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Error interno del servidor';
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  // Registrar usuario
  register: async (userData) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.REGISTER, {
        tipo_documento: userData.tipoDocumento || 'CC',
        documento: userData.documento,
        nombre: userData.nombre,
        apellido: userData.apellido,
        correo: userData.email,
        contrasena: userData.password,
        id_rol: userData.roleId || 3 // Por defecto cliente
      });

      if (response.success || response.mensaje) {
        return {
          success: true,
          user: response.usuario || response.user,
          message: response.mensaje || 'Usuario registrado correctamente'
        };
      } else {
        return {
          success: false,
          message: response.error || 'Error en el registro'
        };
      }
    } catch (error) {
      console.error('Error en registro:', error);
      
      let errorMessage = 'Error de conexión con el servidor';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.response?.status === 400) {
        errorMessage = 'Datos inválidos o usuario ya existe';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Error interno del servidor';
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  // Recuperar contraseña - Implementación con nueva API
  forgotPassword: async (email) => {
    console.log('🔐 [AuthApiService] Iniciando forgotPassword para:', email);
    console.log('🔗 [AuthApiService] Endpoint:', API_CONFIG.ENDPOINTS.FORGOT_PASSWORD);
    console.log('🌐 [AuthApiService] URL completa:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORGOT_PASSWORD}`);
    
    try {
      console.log('📤 [AuthApiService] Enviando petición...');
      const response = await apiService.postPublic(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, {
        correo: email
      });
      console.log('📥 [AuthApiService] Respuesta recibida:', response);

      return {
        success: true,
        message: response.mensaje || response.message || 'Código de recuperación enviado'
      };
    } catch (error) {
      console.log('💥 [AuthApiService] Error capturado:', error);
      console.log('💥 [AuthApiService] Error details:', {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data
      });
      
      // Manejar diferentes tipos de errores
      let errorMessage = 'Error al enviar solicitud';
      
      if (error.response?.status === 404) {
        errorMessage = 'El email no está registrado en el sistema.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Error interno del servidor. Por favor, intenta de nuevo más tarde.';
      } else if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      } else if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.message.includes('Failed to fetch')) {
        errorMessage = 'No se pudo conectar con el servidor. Verifica tu conexión a internet.';
      }
      
      return {
        success: false,
        message: errorMessage
      };
    }
  },

  // Restablecer contraseña
  resetPassword: async (token, newPassword) => {
    try {
      const response = await apiService.post(API_CONFIG.ENDPOINTS.RESET_PASSWORD, {
        token,
        newPassword
      });

      return {
        success: response.success || response.mensaje ? true : false,
        message: response.mensaje || response.error || 'Contraseña restablecida'
      };
    } catch (error) {
      console.error('Error en restablecimiento de contraseña:', error);
      
      let errorMessage = 'Error de conexión con el servidor';
      
      if (error.response?.data?.error) {
        errorMessage = error.response.data.error;
      } else if (error.response?.data?.mensaje) {
        errorMessage = error.response.data.mensaje;
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  // Cerrar sesión
  logout: () => {
    console.log('🚪 [AuthApiService] Iniciando logout...');
    
    // Usar la utilidad centralizada para limpiar datos de autenticación
    clearAllAuthData();
    
    console.log('✅ [AuthApiService] Logout completado');
    
    return {
      success: true,
      message: 'Logout exitoso'
    };
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem('authToken');
    const isAuth = localStorage.getItem('isAuthenticated');
    
    if (!token || !isAuth) return false;

    try {
      // Decodificar el token JWT para verificar expiración
      const payload = JSON.parse(atob(token.split('.')[1]));
      const currentTime = Date.now() / 1000;
      
      if (payload.exp < currentTime) {
        authApiService.logout();
        return false;
      }
      
      return true;
    } catch (error) {
      console.error('Error al verificar token:', error);
      authApiService.logout();
      return false;
    }
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem('currentUser');
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error('Error al obtener usuario:', error);
      return null;
    }
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem('authToken');
  },

  // Verificar permisos (basado en el rol del usuario)
  hasPermission: (resource, action) => {
    const user = authApiService.getCurrentUser();
    if (!user) return false;

    // Mapeo de roles a permisos (basado en la documentación de la API)
    const rolePermissions = {
      'administrador': {
        usuarios: { crear: true, leer: true, actualizar: true, eliminar: true },
        empleados: { crear: true, leer: true, actualizar: true, eliminar: true },
        clientes: { crear: true, leer: true, actualizar: true, eliminar: true },
        ventas: { crear: true, leer: true, actualizar: true, eliminar: true },
        pagos: { crear: true, leer: true, actualizar: true, eliminar: true },
        citas: { crear: true, leer: true, actualizar: true, eliminar: true },
        roles: { crear: true, leer: true, actualizar: true, eliminar: true },
        reportes: { crear: true, leer: true, actualizar: true, eliminar: true },
        configuracion: { crear: true, leer: true, actualizar: true, eliminar: true }
      },
      'empleado': {
        usuarios: { crear: false, leer: true, actualizar: false, eliminar: false },
        empleados: { crear: false, leer: true, actualizar: false, eliminar: false },
        clientes: { crear: true, leer: true, actualizar: true, eliminar: false },
        ventas: { crear: true, leer: true, actualizar: true, eliminar: false },
        pagos: { crear: true, leer: true, actualizar: true, eliminar: false },
        citas: { crear: true, leer: true, actualizar: true, eliminar: false },
        roles: { crear: false, leer: false, actualizar: false, eliminar: false },
        reportes: { crear: false, leer: true, actualizar: false, eliminar: false },
        configuracion: { crear: false, leer: false, actualizar: false, eliminar: false }
      },
      'cliente': {
        usuarios: { crear: false, leer: false, actualizar: false, eliminar: false },
        empleados: { crear: false, leer: false, actualizar: false, eliminar: false },
        clientes: { crear: false, leer: false, actualizar: false, eliminar: false },
        ventas: { crear: false, leer: true, actualizar: false, eliminar: false },
        pagos: { crear: false, leer: true, actualizar: false, eliminar: false },
        citas: { crear: true, leer: true, actualizar: false, eliminar: false },
        roles: { crear: false, leer: false, actualizar: false, eliminar: false },
        reportes: { crear: false, leer: false, actualizar: false, eliminar: false },
        configuracion: { crear: false, leer: false, actualizar: false, eliminar: false }
      }
    };

    const userRole = user.rol?.nombre || user.rol || user.role;
    console.log('🔍 [AuthApiService] Verificando permisos:', { userRole, user });
    const userPermissions = rolePermissions[userRole];
    if (!userPermissions) return false;

    const resourcePermissions = userPermissions[resource];
    if (!resourcePermissions) return false;

    return resourcePermissions[action] || false;
  },

  // Verificar si es administrador
  isAdmin: () => {
    const user = authApiService.getCurrentUser();
    if (!user) return false;
    
    // Verificar tanto el formato antiguo como el nuevo
    const userRole = user.rol?.nombre || user.rol || user.role;
    console.log('🔍 [AuthApiService] Verificando si es admin:', { userRole, user });
    return userRole === 'administrador';
  },

  // Verificar si es empleado
  isEmployee: () => {
    const user = authApiService.getCurrentUser();
    if (!user) return false;
    
    // Verificar tanto el formato antiguo como el nuevo
    const userRole = user.rol?.nombre || user.rol || user.role;
    console.log('🔍 [AuthApiService] Verificando si es empleado:', { userRole, user });
    return userRole === 'empleado' || authApiService.isAdmin();
  },

  // Verificar si es cliente
  isClient: () => {
    const user = authApiService.getCurrentUser();
    if (!user) return false;
    
    // Verificar tanto el formato antiguo como el nuevo
    const userRole = user.rol?.nombre || user.rol || user.role;
    console.log('🔍 [AuthApiService] Verificando si es cliente:', { userRole, user });
    return userRole === 'cliente';
  }
};

export default authApiService;
