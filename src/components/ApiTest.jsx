import React, { useState } from 'react';

const ApiTest = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const testApi = async () => {
    setLoading(true);
    setResult(null);
    
    try {
      console.log('🧪 [ApiTest] Probando API...');
      
      // Probar endpoint de servicios (público)
      const serviciosResponse = await fetch('https://api-registrack.onrender.com/api/servicios');
      const serviciosData = await serviciosResponse.json();
      
      console.log('🧪 [ApiTest] Servicios:', serviciosResponse.status, serviciosData);
      
      // Probar endpoint de login
      const loginResponse = await fetch('https://api-registrack.onrender.com/api/usuarios/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          correo: 'admin@registrack.com',
          contrasena: 'Admin123!'
        })
      });
      
      const loginData = await loginResponse.json();
      
      console.log('🧪 [ApiTest] Login:', loginResponse.status, loginData);
      
      setResult({
        servicios: {
          status: serviciosResponse.status,
          data: serviciosData
        },
        login: {
          status: loginResponse.status,
          data: loginData
        }
      });
      
    } catch (error) {
      console.error('🧪 [ApiTest] Error:', error);
      setResult({
        error: error.message,
        stack: error.stack
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-4">🧪 Prueba de API</h2>
      
      <button
        onClick={testApi}
        disabled={loading}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
      >
        {loading ? 'Probando...' : 'Probar API'}
      </button>
      
      {result && (
        <div className="mt-6">
          <h3 className="text-lg font-semibold mb-2">Resultados:</h3>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-auto text-sm">
            {JSON.stringify(result, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
};

export default ApiTest;
