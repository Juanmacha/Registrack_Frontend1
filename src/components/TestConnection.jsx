import React, { useState } from 'react';
import API_CONFIG from '../shared/config/apiConfig.js';

const TestConnection = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testDirectConnection = async () => {
    setLoading(true);
    setResult('Probando conexión directa...\n');
    
    try {
      // Test 1: Verificar que la URL esté disponible
      setResult(prev => prev + `🌐 URL: ${API_CONFIG.BASE_URL}\n`);
      setResult(prev => prev + `🔗 Endpoint: ${API_CONFIG.ENDPOINTS.LOGIN}\n`);
      setResult(prev => prev + `📍 URL completa: ${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}\n\n`);
      
      // Test 2: Hacer petición directa con fetch
      setResult(prev => prev + '📡 Haciendo petición POST...\n');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.LOGIN}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          correo: 'admin@registrack.com',
          contrasena: 'Admin123!'
        })
      });
      
      setResult(prev => prev + `📊 Status: ${response.status} ${response.statusText}\n`);
      setResult(prev => prev + `📋 Headers: ${JSON.stringify(Object.fromEntries(response.headers.entries()), null, 2)}\n\n`);
      
      if (response.ok) {
        const data = await response.json();
        setResult(prev => prev + `✅ Respuesta exitosa:\n${JSON.stringify(data, null, 2)}\n`);
      } else {
        const errorData = await response.text();
        setResult(prev => prev + `❌ Error ${response.status}:\n${errorData}\n`);
      }
      
    } catch (error) {
      setResult(prev => prev + `💥 Error de conexión:\n${error.message}\n`);
      setResult(prev => prev + `🔍 Tipo de error: ${error.name}\n`);
      setResult(prev => prev + `📚 Stack: ${error.stack}\n`);
    } finally {
      setLoading(false);
    }
  };

  const testServicesEndpoint = async () => {
    setLoading(true);
    setResult('Probando endpoint de servicios...\n');
    
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.SERVICES}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/json'
        }
      });
      
      setResult(prev => prev + `📊 Status: ${response.status} ${response.statusText}\n`);
      
      if (response.ok) {
        const data = await response.json();
        setResult(prev => prev + `✅ Servicios obtenidos:\n${JSON.stringify(data, null, 2)}\n`);
      } else {
        const errorData = await response.text();
        setResult(prev => prev + `❌ Error ${response.status}:\n${errorData}\n`);
      }
      
    } catch (error) {
      setResult(prev => prev + `💥 Error: ${error.message}\n`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3>🔧 Prueba de Conexión Directa</h3>
        </div>
        <div className="card-body">
          <div className="mb-3">
            <button 
              className="btn btn-primary me-2" 
              onClick={testDirectConnection}
              disabled={loading}
            >
              {loading ? 'Probando...' : 'Probar Login Directo'}
            </button>
            <button 
              className="btn btn-info me-2" 
              onClick={testServicesEndpoint}
              disabled={loading}
            >
              {loading ? 'Probando...' : 'Probar Servicios'}
            </button>
            <button 
              className="btn btn-secondary" 
              onClick={() => setResult('')}
              disabled={loading}
            >
              Limpiar
            </button>
          </div>
          
          {result && (
            <div className="mt-3">
              <h5>Resultado:</h5>
              <pre className="bg-light p-3" style={{ whiteSpace: 'pre-wrap', maxHeight: '400px', overflow: 'auto' }}>
                {result}
              </pre>
            </div>
          )}
          
          {loading && (
            <div className="text-center mt-3">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Probando...</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TestConnection;
