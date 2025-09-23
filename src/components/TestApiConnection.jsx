import React, { useState } from 'react';
import authApiService from '../features/auth/services/authApiService.js';
import userApiService from '../features/auth/services/userApiService.js';
import apiService from '../shared/services/apiService.js';
import API_CONFIG from '../shared/config/apiConfig.js';

const TestApiConnection = () => {
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const addResult = (test, success, message, data = null) => {
    setTestResults(prev => [...prev, {
      test,
      success,
      message,
      data,
      timestamp: new Date().toLocaleTimeString()
    }]);
  };

  const testApiConnection = async () => {
    setLoading(true);
    setTestResults([]);

    try {
      // Test 1: Verificar conexión básica
      addResult('Conexión API', true, 'Iniciando pruebas de conexión...');

      // Test 2: Probar endpoint de servicios (público)
      try {
        const servicesResponse = await apiService.get(API_CONFIG.ENDPOINTS.SERVICES);
        addResult('Servicios Públicos', true, 'Servicios obtenidos correctamente', servicesResponse);
      } catch (error) {
        addResult('Servicios Públicos', false, `Error: ${error.message}`);
      }

      // Test 3: Probar login con credenciales de admin
      try {
        const loginResponse = await authApiService.login({
          email: 'admin@registrack.com',
          password: 'Admin123!'
        });
        
        if (loginResponse.success) {
          addResult('Login Admin', true, 'Login exitoso', loginResponse.user);
          
          // Test 4: Probar obtener usuarios (requiere autenticación)
          try {
            const usersResponse = await userApiService.getAllUsers();
            addResult('Obtener Usuarios', usersResponse.success, usersResponse.message, usersResponse.users);
          } catch (error) {
            addResult('Obtener Usuarios', false, `Error: ${error.message}`);
          }

          // Test 5: Probar logout
          try {
            const logoutResponse = authApiService.logout();
            addResult('Logout', logoutResponse.success, logoutResponse.message);
          } catch (error) {
            addResult('Logout', false, `Error: ${error.message}`);
          }
        } else {
          addResult('Login Admin', false, loginResponse.message);
        }
      } catch (error) {
        addResult('Login Admin', false, `Error: ${error.message}`);
      }

      // Test 6: Probar registro de usuario
      try {
        const registerResponse = await authApiService.register({
          tipoDocumento: 'CC',
          documento: '12345678',
          nombre: 'Test',
          apellido: 'Usuario',
          email: 'test@example.com',
          password: 'Test123!',
          roleId: 3
        });
        addResult('Registro Usuario', registerResponse.success, registerResponse.message, registerResponse.user);
      } catch (error) {
        addResult('Registro Usuario', false, `Error: ${error.message}`);
      }

    } catch (error) {
      addResult('Error General', false, `Error inesperado: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const clearResults = () => {
    setTestResults([]);
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3>🧪 Prueba de Conexión con API</h3>
          <p className="text-muted">URL: {API_CONFIG.BASE_URL}</p>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <button 
              className="btn btn-primary me-2" 
              onClick={testApiConnection}
              disabled={loading}
            >
              {loading ? 'Probando...' : 'Iniciar Pruebas'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={clearResults}
              disabled={loading}
            >
              Limpiar Resultados
            </button>
          </div>

          {testResults.length > 0 && (
            <div className="mt-3">
              <h5>Resultados de las Pruebas:</h5>
              <div className="table-responsive">
                <table className="table table-sm">
                  <thead>
                    <tr>
                      <th>Prueba</th>
                      <th>Estado</th>
                      <th>Mensaje</th>
                      <th>Hora</th>
                    </tr>
                  </thead>
                  <tbody>
                    {testResults.map((result, index) => (
                      <tr key={index} className={result.success ? 'table-success' : 'table-danger'}>
                        <td>{result.test}</td>
                        <td>
                          <span className={`badge ${result.success ? 'bg-success' : 'bg-danger'}`}>
                            {result.success ? '✅ Éxito' : '❌ Error'}
                          </span>
                        </td>
                        <td>{result.message}</td>
                        <td>{result.timestamp}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {loading && (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Probando conexión...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestApiConnection;
