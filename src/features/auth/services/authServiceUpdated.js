import { UserService, initializeMockData } from "../../../utils/mockDataService.js";
import { ROLES } from "../../../utils/mockData.js";

const TOKEN_KEY = "authToken";
const USER_KEY = "currentUser";

const authService = {
  // Inicializar datos mock
  initialize: () => {
    initializeMockData();
  },

  // Autenticar usuario
  login: async (credentials) => {
    try {
      initializeMockData();
      const user = UserService.authenticate(credentials.email, credentials.password);
      
      if (user) {
        // Crear un token simple (en producción usar JWT real)
        const token = btoa(JSON.stringify({
          id: user.id,
          email: user.email,
          role: user.role,
          firstName: user.firstName,
          lastName: user.lastName,
          exp: Date.now() + (24 * 60 * 60 * 1000) // 24 horas
        }));

        // Guardar token y usuario
        localStorage.setItem(TOKEN_KEY, token);
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        localStorage.setItem("isAuthenticated", "true");

        return {
          success: true,
          user: user,
          message: "Login exitoso"
        };
      } else {
        return {
          success: false,
          message: "Credenciales incorrectas"
        };
      }
    } catch (error) {
      console.error("Error en login:", error);
      return {
        success: false,
        message: "Error en el servidor"
      };
    }
  },

  // Cerrar sesión
  logout: () => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem("isAuthenticated");
    return {
      success: true,
      message: "Logout exitoso"
    };
  },

  // Verificar si está autenticado
  isAuthenticated: () => {
    const token = localStorage.getItem(TOKEN_KEY);
    const isAuth = localStorage.getItem("isAuthenticated");
    
    if (!token || !isAuth) return false;

    try {
      const decoded = JSON.parse(atob(token));
      // Verificar si el token no ha expirado
      if (decoded.exp < Date.now()) {
        authService.logout();
        return false;
      }
      return true;
    } catch (error) {
      console.error("Error al verificar token:", error);
      authService.logout();
      return false;
    }
  },

  // Obtener usuario actual
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      if (userStr) {
        return JSON.parse(userStr);
      }
      return null;
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      return null;
    }
  },

  // Obtener token
  getToken: () => {
    return localStorage.getItem(TOKEN_KEY);
  },

  // Verificar permisos
  hasPermission: (resource, action) => {
    const user = authService.getCurrentUser();
    if (!user) return false;

    // Mapeo de roles a permisos
    const rolePermissions = {
      [ROLES.ADMINISTRADOR]: {
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
      [ROLES.EMPLEADO]: {
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
      [ROLES.CLIENTE]: {
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

    const userPermissions = rolePermissions[user.role];
    if (!userPermissions) return false;

    const resourcePermissions = userPermissions[resource];
    if (!resourcePermissions) return false;

    return resourcePermissions[action] || false;
  },

  // Verificar si es administrador
  isAdmin: () => {
    const user = authService.getCurrentUser();
    return user && user.role === ROLES.ADMINISTRADOR;
  },

  // Verificar si es empleado
  isEmployee: () => {
    const user = authService.getCurrentUser();
    return user && (user.role === ROLES.ADMINISTRADOR || user.role === ROLES.EMPLEADO);
  },

  // Verificar si es cliente
  isClient: () => {
    const user = authService.getCurrentUser();
    return user && user.role === ROLES.CLIENTE;
  }
};

export default authService; 