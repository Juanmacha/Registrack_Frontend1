import API_CONFIG from '../../../../../shared/config/apiConfig.js';

/**
 * Servicio API para gestión de roles, permisos y privilegios
 * Conecta el frontend con la API real de Registrack
 */
class RolesApiService {
  constructor() {
    this.baseUrl = API_CONFIG.BASE_URL;
    this.endpoints = API_CONFIG.ENDPOINTS;
  }

  /**
   * Obtener token de autenticación del localStorage
   */
  getAuthToken() {
    return localStorage.getItem('token');
  }

  /**
   * Configurar headers para las peticiones
   */
  getHeaders() {
    return {
      ...API_CONFIG.DEFAULT_HEADERS,
      'Authorization': `Bearer ${this.getAuthToken()}`
    };
  }

  /**
   * Manejar respuestas de la API
   */
  async handleResponse(response) {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || `Error ${response.status}: ${response.statusText}`);
    }
    return await response.json();
  }

  /**
   * Realizar petición HTTP
   */
  async makeRequest(url, options = {}) {
    const config = {
      method: 'GET',
      headers: this.getHeaders(),
      ...options
    };

    try {
      const response = await fetch(url, config);
      return await this.handleResponse(response);
    } catch (error) {
      console.error('Error en petición API:', error);
      throw error;
    }
  }

  // ============================================================================
  // GESTIÓN DE ROLES
  // ============================================================================

  /**
   * Obtener todos los roles
   */
  async getAllRoles() {
    console.log('📤 [RolesApiService] Obteniendo todos los roles...');
    const url = `${this.baseUrl}${this.endpoints.ROLES}`;
    
    try {
      const response = await this.makeRequest(url);
      console.log('✅ [RolesApiService] Roles obtenidos:', response);
      
      // Transformar datos de la API al formato del frontend
      const transformedRoles = this.transformRolesFromAPI(response.data || response);
      console.log('🔄 [RolesApiService] Roles transformados:', transformedRoles);
      
      return transformedRoles;
    } catch (error) {
      console.error('❌ [RolesApiService] Error obteniendo roles:', error);
      throw error;
    }
  }

  /**
   * Obtener rol por ID
   */
  async getRoleById(id) {
    console.log(`📤 [RolesApiService] Obteniendo rol con ID: ${id}`);
    const url = `${this.baseUrl}${this.endpoints.ROLE_BY_ID(id)}`;
    
    try {
      const response = await this.makeRequest(url);
      console.log('✅ [RolesApiService] Rol obtenido:', response);
      
      return this.transformRoleFromAPI(response);
    } catch (error) {
      console.error('❌ [RolesApiService] Error obteniendo rol:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo rol
   */
  async createRole(roleData) {
    console.log('📤 [RolesApiService] Creando nuevo rol:', roleData);
    const url = `${this.baseUrl}${this.endpoints.ROLES}`;
    
    // Transformar datos del frontend al formato de la API
    const apiData = this.transformRoleToAPI(roleData);
    console.log('🔄 [RolesApiService] Datos transformados para API:', apiData);
    
    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(apiData)
      });
      console.log('✅ [RolesApiService] Rol creado:', response);
      
      return this.transformRoleFromAPI(response);
    } catch (error) {
      console.error('❌ [RolesApiService] Error creando rol:', error);
      throw error;
    }
  }

  /**
   * Actualizar rol
   */
  async updateRole(id, roleData) {
    console.log(`📤 [RolesApiService] Actualizando rol ${id}:`, roleData);
    const url = `${this.baseUrl}${this.endpoints.ROLE_BY_ID(id)}`;
    
    // Transformar datos del frontend al formato de la API
    const apiData = this.transformRoleToAPI(roleData);
    console.log('🔄 [RolesApiService] Datos transformados para API:', apiData);
    
    try {
      const response = await this.makeRequest(url, {
        method: 'PUT',
        body: JSON.stringify(apiData)
      });
      console.log('✅ [RolesApiService] Rol actualizado:', response);
      
      return this.transformRoleFromAPI(response);
    } catch (error) {
      console.error('❌ [RolesApiService] Error actualizando rol:', error);
      throw error;
    }
  }

  /**
   * Cambiar estado del rol
   */
  async changeRoleState(id, estado) {
    console.log(`📤 [RolesApiService] Cambiando estado del rol ${id} a: ${estado}`);
    const url = `${this.baseUrl}${this.endpoints.ROLE_STATE(id)}`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'PATCH',
        body: JSON.stringify({ estado })
      });
      console.log('✅ [RolesApiService] Estado del rol cambiado:', response);
      
      return this.transformRoleFromAPI(response);
    } catch (error) {
      console.error('❌ [RolesApiService] Error cambiando estado del rol:', error);
      throw error;
    }
  }

  /**
   * Eliminar rol
   */
  async deleteRole(id) {
    console.log(`📤 [RolesApiService] Eliminando rol con ID: ${id}`);
    const url = `${this.baseUrl}${this.endpoints.ROLE_BY_ID(id)}`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'DELETE'
      });
      console.log('✅ [RolesApiService] Rol eliminado:', response);
      
      return response;
    } catch (error) {
      console.error('❌ [RolesApiService] Error eliminando rol:', error);
      throw error;
    }
  }

  // ============================================================================
  // GESTIÓN DE PERMISOS
  // ============================================================================

  /**
   * Obtener todos los permisos
   */
  async getAllPermissions() {
    console.log('📤 [RolesApiService] Obteniendo todos los permisos...');
    const url = `${this.baseUrl}${this.endpoints.PERMISSIONS}`;
    
    try {
      const response = await this.makeRequest(url);
      console.log('✅ [RolesApiService] Permisos obtenidos:', response);
      
      return response.data || response;
    } catch (error) {
      console.error('❌ [RolesApiService] Error obteniendo permisos:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo permiso
   */
  async createPermission(permissionData) {
    console.log('📤 [RolesApiService] Creando nuevo permiso:', permissionData);
    const url = `${this.baseUrl}${this.endpoints.PERMISSIONS}`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(permissionData)
      });
      console.log('✅ [RolesApiService] Permiso creado:', response);
      
      return response;
    } catch (error) {
      console.error('❌ [RolesApiService] Error creando permiso:', error);
      throw error;
    }
  }

  // ============================================================================
  // GESTIÓN DE PRIVILEGIOS
  // ============================================================================

  /**
   * Obtener todos los privilegios
   */
  async getAllPrivileges() {
    console.log('📤 [RolesApiService] Obteniendo todos los privilegios...');
    const url = `${this.baseUrl}${this.endpoints.PRIVILEGES}`;
    
    try {
      const response = await this.makeRequest(url);
      console.log('✅ [RolesApiService] Privilegios obtenidos:', response);
      
      return response.data || response;
    } catch (error) {
      console.error('❌ [RolesApiService] Error obteniendo privilegios:', error);
      throw error;
    }
  }

  /**
   * Crear nuevo privilegio
   */
  async createPrivilege(privilegeData) {
    console.log('📤 [RolesApiService] Creando nuevo privilegio:', privilegeData);
    const url = `${this.baseUrl}${this.endpoints.PRIVILEGES}`;
    
    try {
      const response = await this.makeRequest(url, {
        method: 'POST',
        body: JSON.stringify(privilegeData)
      });
      console.log('✅ [RolesApiService] Privilegio creado:', response);
      
      return response;
    } catch (error) {
      console.error('❌ [RolesApiService] Error creando privilegio:', error);
      throw error;
    }
  }

  // ============================================================================
  // TRANSFORMACIONES DE DATOS
  // ============================================================================

  /**
   * Transformar datos de la API al formato del frontend
   * NOTA: El backend ahora devuelve el formato granular directamente
   */
  transformRoleFromAPI(apiRole) {
    return {
      id: apiRole.id?.toString() || apiRole.id_rol?.toString(),
      nombre: apiRole.nombre,
      estado: apiRole.estado,
      permisos: this.transformPermissionsFromAPI(apiRole.permisos || {})
    };
  }

  /**
   * Transformar array de roles de la API al formato del frontend
   */
  transformRolesFromAPI(apiRoles) {
    if (!Array.isArray(apiRoles)) {
      return [];
    }
    
    return apiRoles.map(role => this.transformRoleFromAPI(role));
  }

  /**
   * Transformar datos del frontend al formato de la API
   * NOTA: El backend ahora acepta el formato granular directamente
   */
  transformRoleToAPI(frontendRole) {
    return {
      nombre: frontendRole.nombre,
      permisos: frontendRole.permisos || {}
    };
  }

  /**
   * Transformar permisos de la API al formato del frontend
   * NOTA: El backend ahora devuelve el formato granular directamente
   */
  transformPermissionsFromAPI(apiPermissions) {
    // El backend ahora devuelve el formato granular directamente
    if (typeof apiPermissions === 'object' && apiPermissions !== null) {
      return apiPermissions;
    }
    
    // Fallback para casos donde no viene en formato granular
    return {};
  }

  /**
   * Transformar permisos del frontend al formato de la API
   * NOTA: Ya no es necesario transformar, el backend ahora acepta el formato granular directamente
   */
  transformPermissionsToAPI(frontendPermissions) {
    // El backend ahora acepta el formato granular directamente
    return frontendPermissions;
  }

  /**
   * Transformar privilegios del frontend al formato de la API
   * NOTA: Ya no es necesario, el backend maneja los privilegios internamente
   */
  transformPrivilegesToAPI(frontendPermissions) {
    // El backend ahora maneja los privilegios internamente basado en los permisos
    return [];
  }

  /**
   * Capitalizar primera letra
   */
  capitalizeFirstLetter(string) {
    if (!string) return '';
    return string.charAt(0).toUpperCase() + string.slice(1);
  }
}

// Crear instancia única del servicio
const rolesApiService = new RolesApiService();

export default rolesApiService;
