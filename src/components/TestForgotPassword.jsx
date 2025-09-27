import { useState } from 'react';
import API_CONFIG from '../shared/config/apiConfig.js';

const TestForgotPassword = () => {
  const [result, setResult] = useState('');
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState('admin@registrack.com');

  const testForgotPassword = async () => {
    setLoading(true);
    setResult('Probando forgot-password...');
    
    try {
      console.log('🧪 [TestForgotPassword] Probando forgot-password...');
      console.log('🧪 [TestForgotPassword] Email:', email);
      console.log('🧪 [TestForgotPassword] URL:', `${API_CONFIG.BASE_URL}/api/usuarios/forgot-password`);
      
      const startTime = Date.now();
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/usuarios/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          correo: email
        })
      });
      
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      console.log('🧪 [TestForgotPassword] Respuesta:', response);
      console.log('🧪 [TestForgotPassword] Duración:', duration + 'ms');
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Forgot-password exitoso!
Status: ${response.status}
Duración: ${duration}ms
Datos: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        setResult(`❌ Error forgot-password:
Status: ${response.status} ${response.statusText}
Duración: ${duration}ms
Datos: ${JSON.stringify(errorData, null, 2)}`);
      }
    } catch (error) {
      console.error('🧪 [TestForgotPassword] Error:', error);
      setResult(`💥 Error forgot-password: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const testWithTimeout = async () => {
    setLoading(true);
    setResult('Probando con timeout de 30 segundos...');
    
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => {
        console.log('⏰ [TestForgotPassword] Timeout alcanzado');
        controller.abort();
      }, 30000);

      const startTime = Date.now();
      
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/usuarios/forgot-password`, {
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
      const endTime = Date.now();
      const duration = endTime - startTime;
      
      if (response.ok) {
        const data = await response.json();
        setResult(`✅ Petición exitosa con timeout!
Status: ${response.status}
Duración: ${duration}ms
Datos: ${JSON.stringify(data, null, 2)}`);
      } else {
        const errorData = await response.json().catch(() => ({ error: 'Error desconocido' }));
        setResult(`❌ Error con timeout:
Status: ${response.status}
Duración: ${duration}ms
Datos: ${JSON.stringify(errorData, null, 2)}`);
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        setResult(`⏰ Timeout alcanzado después de 30 segundos. La API está tardando demasiado en responder.`);
      } else {
        setResult(`💥 Error: ${error.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧪 Prueba Específica de Forgot Password</h2>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Email para probar:
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="admin@registrack.com"
          />
        </div>
        
        <div>
          <p className="text-sm text-gray-600 mb-2">
            <strong>URL:</strong> {API_CONFIG.BASE_URL}/api/usuarios/forgot-password
          </p>
          <p className="text-sm text-gray-600 mb-4">
            <strong>Timeout:</strong> {API_CONFIG.TIMEOUT}ms
          </p>
        </div>
        
        <div className="flex space-x-4">
          <button
            onClick={testForgotPassword}
            disabled={loading}
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {loading ? 'Probando...' : 'Probar Sin Timeout'}
          </button>
          
          <button
            onClick={testWithTimeout}
            disabled={loading}
            className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
          >
            {loading ? 'Probando...' : 'Probar Con Timeout (30s)'}
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

export default TestForgotPassword;
