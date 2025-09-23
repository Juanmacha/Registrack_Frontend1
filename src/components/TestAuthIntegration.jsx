import React, { useState } from 'react';
import { useAuth } from '../shared/contexts/authContext.jsx';

const TestAuthIntegration = () => {
  const { user, login, logout, isAuthenticated, isAdmin, isEmployee, isClient } = useAuth();
  const [testEmail, setTestEmail] = useState('admin@registrack.com');
  const [testPassword, setTestPassword] = useState('Admin123!');
  const [message, setMessage] = useState('');

  const handleTestLogin = async () => {
    setMessage('Probando login...');
    try {
      const result = await login(testEmail, testPassword);
      if (result.success) {
        setMessage(`✅ Login exitoso: ${result.message}`);
      } else {
        setMessage(`❌ Error en login: ${result.message}`);
      }
    } catch (error) {
      setMessage(`❌ Error: ${error.message}`);
    }
  };

  const handleTestLogout = () => {
    logout();
    setMessage('✅ Logout exitoso');
  };

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3>🔐 Prueba de Integración de Autenticación</h3>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5>Estado Actual:</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Autenticado:</strong> {isAuthenticated() ? '✅ Sí' : '❌ No'}
                </li>
                <li className="list-group-item">
                  <strong>Usuario:</strong> {user ? `${user.nombre || user.firstName} ${user.apellido || user.lastName}` : 'N/A'}
                </li>
                <li className="list-group-item">
                  <strong>Email:</strong> {user ? (user.correo || user.email) : 'N/A'}
                </li>
                <li className="list-group-item">
                  <strong>Rol:</strong> {user ? (user.rol || user.role) : 'N/A'}
                </li>
                <li className="list-group-item">
                  <strong>Es Admin:</strong> {isAdmin() ? '✅ Sí' : '❌ No'}
                </li>
                <li className="list-group-item">
                  <strong>Es Empleado:</strong> {isEmployee() ? '✅ Sí' : '❌ No'}
                </li>
                <li className="list-group-item">
                  <strong>Es Cliente:</strong> {isClient() ? '✅ Sí' : '❌ No'}
                </li>
              </ul>
            </div>
            
            <div className="col-md-6">
              <h5>Pruebas:</h5>
              <div className="mb-3">
                <label className="form-label">Email de prueba:</label>
                <input
                  type="email"
                  className="form-control"
                  value={testEmail}
                  onChange={(e) => setTestEmail(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Contraseña de prueba:</label>
                <input
                  type="password"
                  className="form-control"
                  value={testPassword}
                  onChange={(e) => setTestPassword(e.target.value)}
                />
              </div>
              <div className="mb-3">
                <button 
                  className="btn btn-primary me-2" 
                  onClick={handleTestLogin}
                  disabled={!testEmail || !testPassword}
                >
                  Probar Login
                </button>
                <button 
                  className="btn btn-danger" 
                  onClick={handleTestLogout}
                  disabled={!isAuthenticated()}
                >
                  Probar Logout
                </button>
              </div>
              
              {message && (
                <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
                  {message}
                </div>
              )}
            </div>
          </div>

          <div className="mt-4">
            <h5>Credenciales de prueba:</h5>
            <div className="row">
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h6>Administrador</h6>
                  </div>
                  <div className="card-body">
                    <p><strong>Email:</strong> admin@registrack.com</p>
                    <p><strong>Password:</strong> Admin123!</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h6>Cliente (Registro)</h6>
                  </div>
                  <div className="card-body">
                    <p>Usa el formulario de registro para crear un cliente</p>
                    <p><strong>Rol:</strong> Cliente (automático)</p>
                  </div>
                </div>
              </div>
              <div className="col-md-4">
                <div className="card">
                  <div className="card-header">
                    <h6>API Status</h6>
                  </div>
                  <div className="card-body">
                    <p><strong>URL:</strong> https://api-registrack.onrender.com</p>
                    <p><strong>Estado:</strong> <span className="text-success">Conectado</span></p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuthIntegration;
