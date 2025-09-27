import { useState } from 'react';
import API_CONFIG from '../shared/config/apiConfig.js';

const TestApiConnection = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    setResult('Probando conexión...');
    
    try {
      console.log('🧪 [TestApiConnection] Probando conexión a:', API_CONFIG.BASE_URL);
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/servicios`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        }
      });
      
      console.log('🧪 [TestApiConnection] Respuesta:', response);
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Conexión exitosa! Status: ${response.status}\nDatos: ${JSON.stringify(data, null, 2)}`);
      } else {
        setResult(`❌ Error HTTP: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('🧪 [TestApiConnection] Error:', error);
      setResult(`💥 Error de conexión: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testForgotPassword = async () => {
    setLoading(true);
    setResult('Probando forgot-password...');
    
    try {
      console.log('🧪 [TestApiConnection] Probando forgot-password...');
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/usuarios/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          correo: 'test@example.com'
        })
      });
      
      console.log('🧪 [TestApiConnection] Respuesta forgot-password:', response);
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Forgot-password exitoso! Status: ${response.status}\nDatos: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        setResult(`❌ Error forgot-password: ${response.status} ${response.statusText}\nDatos: ${JSON.stringify(errorData, null, 2)}`);
      }
    } catch (error) {
      console.error('🧪 [TestApiConnection] Error forgot-password:', error);
      setResult(`💥 Error forgot-password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧪 Prueba de Conexión API</h2>
      
      <div className="space-y-4">
        <div>
          <p className="text-sm text-gray-600 mb-2">
            <strong>URL Base:</strong> {API_CONFIG.BASE_URL}
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Timeout:</strong> {API_CONFIG.TIMEOUT}ms
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={testConnection}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Probando...' : 'Probar Conexión General'}
          </button>
          
          <button
            onClick={testForgotPassword}
            disabled={loading}
            className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
          >
            {loading ? 'Probando...' : 'Probar Forgot Password'}
          </button>
        </div>
        
        {result && (
          <div className="mt-4 p-4 bg-gray-100 rounded">
            <h3 className="font-semibold mb-2">Resultado:</h3>
            <pre className="text-sm whitespace-pre-wrap">{result}</pre>
          </div>
        )}
      </div>
    </div>
  );
};

export default TestApiConnection;