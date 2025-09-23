// import axios from 'axios';
import API_CONFIG from '../config/apiConfig.js';

// Función para hacer peticiones HTTP usando fetch
const makeHttpRequest = async (url, options = {}) => {
  const defaultOptions = {
    headers: {
      ...API_CONFIG.DEFAULT_HEADERS,
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      'Pragma': 'no-cache',
      'Expires': '0',
      ...options.headers
    },
    ...options
  };

  // Agregar token de autenticación si existe
  const token = localStorage.getItem('authToken');
  if (token) {
    defaultOptions.headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_CONFIG.BASE_URL}${url}`, defaultOptions);
  
  if (!response.ok) {
    const error = new Error(`HTTP error! status: ${response.status}`);
    error.response = {
      status: response.status,
      data: await response.json().catch(() => ({ error: 'Error desconocido' }))
    };
    throw error;
  }

  return {
    data: await response.json(),
    status: response.status,
    statusText: response.statusText
  };
};

// Función para hacer peticiones con reintentos
const makeRequest = async (url, options = {}, retries = API_CONFIG.RETRY_ATTEMPTS) => {
  try {
    const response = await makeHttpRequest(url, options);
    return response.data;
  } catch (error) {
    // Si el token expiró o es inválido, limpiar localStorage
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('isAuthenticated');
      
      // Redirigir al login si no estamos ya ahí
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    if (retries > 0 && error.response?.status >= 500) {
      // Esperar antes del siguiente intento
      await new Promise(resolve => setTimeout(resolve, API_CONFIG.RETRY_DELAY));
      return makeRequest(url, options, retries - 1);
    }
    throw error;
  }
};

// Servicio base para todas las peticiones HTTP
export const apiService = {
  // GET request
  get: async (endpoint, config = {}) => {
    return makeRequest(endpoint, {
      method: 'GET',
      ...config
    });
  },

  // POST request
  post: async (endpoint, data = {}, config = {}) => {
    return makeRequest(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
      ...config
    });
  },

  // PUT request
  put: async (endpoint, data = {}, config = {}) => {
    return makeRequest(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
      ...config
    });
  },

  // DELETE request
  delete: async (endpoint, config = {}) => {
    return makeRequest(endpoint, {
      method: 'DELETE',
      ...config
    });
  },

  // PATCH request
  patch: async (endpoint, data = {}, config = {}) => {
    return makeRequest(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
      ...config
    });
  },

  // POST request público (sin autenticación)
  postPublic: async (endpoint, data = {}, config = {}) => {
    try {
      const response = await makeHttpRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
          ...API_CONFIG.DEFAULT_HEADERS,
          ...config.headers
        },
        ...config
      });
      return response.data;
    } catch (error) {
      console.error('💥 [postPublic] Error en petición pública:', error);
      throw error;
    }
  },

  // GET request público (sin autenticación)
  getPublic: async (endpoint, config = {}) => {
    return makeHttpRequest(endpoint, {
      method: 'GET',
      headers: {
        ...API_CONFIG.DEFAULT_HEADERS,
        ...config.headers
      },
      ...config
    });
  }
};

export default apiService;
