import apiService from '../../../shared/services/apiService.js';
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
        const user = response.data?.usuario || response.usuario || response.user;
        
        console.log('✅ Login exitoso, guardando datos:', { 
          token: token ? 'Presente' : 'Ausente', 
          user: user ? 'Presente' : 'Ausente',
          tokenValue: token,
          userValue: user
        });
        
        if (token && user) {
          localStorage.setItem('authToken', token);
          localStorage.setItem('currentUser', JSON.stringify(user));
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

  // Recuperar contraseña
  forgotPassword: async (email) => {
    try {
      console.log('🔐 [ForgotPassword] Enviando petición sin autenticación para:', email);
      console.log('🔗 [ForgotPassword] URL completa:', `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORGOT_PASSWORD}`);
      
      console.log('🔄 [ForgotPassword] Llamando a apiService.postPublic...');
      
      // Usar el método público que no incluye token de autorización
      const response = await apiService.postPublic(API_CONFIG.ENDPOINTS.FORGOT_PASSWORD, {
        correo: email
      });

      console.log('📥 [ForgotPassword] Respuesta del servidor recibida:', response);

      // El servidor responde con status 200, así que es exitoso
      // Verificar si hay mensaje de éxito en la respuesta
      const isSuccess = response.success || 
                       response.mensaje || 
                       response.message || 
                       response.data?.mensaje || 
                       response.data?.message ||
                       response.status === 200;

      console.log('✅ [ForgotPassword] Procesando respuesta exitosa');

      return {
        success: isSuccess,
        message: response.mensaje || 
                response.message || 
                response.data?.mensaje || 
                response.data?.message || 
                'Código de recuperación enviado exitosamente'
      };
    } catch (error) {
      console.error('💥 [ForgotPassword] Error completo:', error);
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
      } else if (error.response?.status === 403) {
        errorMessage = 'Error de permisos: El endpoint de recuperación de contraseña no está disponible o requiere configuración especial';
      } else if (error.response?.status === 404) {
        errorMessage = 'Endpoint no encontrado: Verifica que la API esté funcionando correctamente';
      } else if (error.response?.status >= 500) {
        errorMessage = 'Error interno del servidor: Intenta más tarde';
      }

      return {
        success: false,
        message: errorMessage
      };
    }
  },

  // Recuperar contraseña - Versión alternativa con fetch directo
  forgotPasswordDirect: async (email) => {
    try {
      console.log('🔐 [ForgotPasswordDirect] Enviando petición directa con fetch para:', email);
      
      const url = `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.FORGOT_PASSWORD}`;
      console.log('🔗 [ForgotPasswordDirect] URL completa:', url);
      
      // Crear un timeout de 30 segundos
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000);
      
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          correo: email
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      
      console.log('📥 [ForgotPasswordDirect] Status de respuesta:', response.status);
      console.log('📥 [ForgotPasswordDirect] Response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('💥 [ForgotPasswordDirect] Error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status} - ${errorText}`);
      }

      const data = await response.json();
      console.log('📥 [ForgotPasswordDirect] Datos de respuesta:', data);

      return {
        success: true,
        message: data.mensaje || data.message || 'Código de recuperación enviado exitosamente'
      };
    } catch (error) {
      console.error('💥 [ForgotPasswordDirect] Error:', error);
      
      let errorMessage = 'Error al enviar la solicitud';
      
      if (error.name === 'AbortError') {
        errorMessage = 'La solicitud tardó demasiado tiempo. Intenta de nuevo.';
      } else if (error.message.includes('403')) {
        errorMessage = 'Error de permisos. El endpoint no está disponible.';
      } else if (error.message.includes('404')) {
        errorMessage = 'Endpoint no encontrado. Verifica la configuración.';
      } else if (error.message.includes('500')) {
        errorMessage = 'Error interno del servidor. Intenta más tarde.';
      } else {
        errorMessage = error.message || 'Error de conexión';
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
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    localStorage.removeItem('isAuthenticated');
    
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

    const userRole = user.rol || user.role;
    const userPermissions = rolePermissions[userRole];
    if (!userPermissions) return false;

    const resourcePermissions = userPermissions[resource];
    if (!resourcePermissions) return false;

    return resourcePermissions[action] || false;
  },

  // Verificar si es administrador
  isAdmin: () => {
    const user = authApiService.getCurrentUser();
    return user && (user.rol === 'administrador' || user.role === 'administrador');
  },

  // Verificar si es empleado
  isEmployee: () => {
    const user = authApiService.getCurrentUser();
    return user && (user.rol === 'empleado' || user.role === 'empleado' || authApiService.isAdmin());
  },

  // Verificar si es cliente
  isClient: () => {
    const user = authApiService.getCurrentUser();
    return user && (user.rol === 'cliente' || user.role === 'cliente');
  }
};

export default authApiService;
