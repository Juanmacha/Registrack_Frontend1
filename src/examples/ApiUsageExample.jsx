import React, { useState } from 'react';
import { useAuth } from '../shared/contexts/authContext.jsx';
import authApiService from '../features/auth/services/authApiService.js';
import userApiService from '../features/auth/services/userApiService.js';

const ApiUsageExample = () => {
  const { user, login, logout, isAuthenticated, isAdmin, isEmployee } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    nombre: '',
    apellido: '',
    documento: ''
  });
  const [message, setMessage] = useState('');

  // Ejemplo de login
  const handleLogin = async (e) => {
    e.preventDefault();
    setMessage('Iniciando sesión...');
    
    const result = await login(formData.email, formData.password);
    
    if (result.success) {
      setMessage(`✅ ${result.message}`);
    } else {
      setMessage(`❌ ${result.message}`);
    }
  };

  // Ejemplo de registro
  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage('Registrando usuario...');
    
    const result = await authApiService.register({
      tipoDocumento: 'CC',
      documento: formData.documento,
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      password: formData.password,
      roleId: 3 // Cliente
    });
    
    if (result.success) {
      setMessage(`✅ ${result.message}`);
    } else {
      setMessage(`❌ ${result.message}`);
    }
  };

  // Ejemplo de obtener usuarios (solo admin/empleado)
  const handleGetUsers = async () => {
    setMessage('Obteniendo usuarios...');
    
    const result = await userApiService.getAllUsers();
    
    if (result.success) {
      setMessage(`✅ ${result.message} - ${result.users?.length || 0} usuarios encontrados`);
      console.log('Usuarios:', result.users);
    } else {
      setMessage(`❌ ${result.message}`);
    }
  };

  // Ejemplo de actualizar perfil
  const handleUpdateProfile = async () => {
    setMessage('Actualizando perfil...');
    
    const result = await userApiService.updateProfile({
      nombre: formData.nombre,
      apellido: formData.apellido,
      email: formData.email,
      documento: formData.documento
    });
    
    if (result.success) {
      setMessage(`✅ ${result.message}`);
    } else {
      setMessage(`❌ ${result.message}`);
    }
  };

  return (
    <div className="container mt-4">
      <div className="row">
        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>🔐 Autenticación</h4>
            </div>
            <div className="card-body">
              {!isAuthenticated() ? (
                <form onSubmit={handleLogin}>
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      className="form-control"
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Contraseña:</label>
                    <input
                      type="password"
                      className="form-control"
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    Iniciar Sesión
                  </button>
                </form>
              ) : (
                <div>
                  <h5>Usuario autenticado:</h5>
                  <p><strong>Nombre:</strong> {user?.nombre} {user?.apellido}</p>
                  <p><strong>Email:</strong> {user?.correo || user?.email}</p>
                  <p><strong>Rol:</strong> {user?.rol || user?.role}</p>
                  <p><strong>Es Admin:</strong> {isAdmin() ? 'Sí' : 'No'}</p>
                  <p><strong>Es Empleado:</strong> {isEmployee() ? 'Sí' : 'No'}</p>
                  <button onClick={logout} className="btn btn-danger">
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="col-md-6">
          <div className="card">
            <div className="card-header">
              <h4>👤 Gestión de Usuarios</h4>
            </div>
            <div className="card-body">
              <form onSubmit={handleRegister}>
                <div className="mb-3">
                  <label className="form-label">Nombre:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.nombre}
                    onChange={(e) => setFormData({...formData, nombre: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Apellido:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.apellido}
                    onChange={(e) => setFormData({...formData, apellido: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Documento:</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData.documento}
                    onChange={(e) => setFormData({...formData, documento: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Contraseña:</label>
                  <input
                    type="password"
                    className="form-control"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
                <div className="mb-3">
                  <button type="submit" className="btn btn-success me-2">
                    Registrar Usuario
                  </button>
                  {isAuthenticated() && (
                    <button type="button" onClick={handleUpdateProfile} className="btn btn-warning me-2">
                      Actualizar Perfil
                    </button>
                  )}
                </div>
              </form>

              {isAuthenticated() && (isAdmin() || isEmployee()) && (
                <div className="mt-3">
                  <button onClick={handleGetUsers} className="btn btn-info">
                    Obtener Todos los Usuarios
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {message && (
        <div className="row mt-3">
          <div className="col-12">
            <div className={`alert ${message.includes('✅') ? 'alert-success' : 'alert-danger'}`}>
              {message}
            </div>
          </div>
        </div>
      )}

      <div className="row mt-4">
        <div className="col-12">
          <div className="card">
            <div className="card-header">
              <h4>📚 Ejemplos de Uso de la API</h4>
            </div>
            <div className="card-body">
              <h5>1. Autenticación:</h5>
              <pre className="bg-light p-3">
{`// Login
const result = await authApiService.login({
  email: 'admin@registrack.com',
  password: 'Admin123!'
});

// Registro
const result = await authApiService.register({
  tipoDocumento: 'CC',
  documento: '12345678',
  nombre: 'Juan',
  apellido: 'Pérez',
  email: 'juan@example.com',
  password: 'Password123!',
  roleId: 3
});

// Logout
authApiService.logout();`}
              </pre>

              <h5>2. Gestión de Usuarios:</h5>
              <pre className="bg-light p-3">
{`// Obtener todos los usuarios (admin/empleado)
const result = await userApiService.getAllUsers();

// Obtener usuario por ID
const result = await userApiService.getUserById(1);

// Crear usuario (admin)
const result = await userApiService.createUser({
  tipoDocumento: 'CC',
  documento: '87654321',
  nombre: 'María',
  apellido: 'González',
  email: 'maria@example.com',
  password: 'Password123!',
  roleId: 2
});

// Actualizar perfil
const result = await userApiService.updateProfile({
  nombre: 'Juan Carlos',
  apellido: 'Pérez López',
  email: 'juan.carlos@example.com'
});`}
              </pre>

              <h5>3. Uso en Componentes React:</h5>
              <pre className="bg-light p-3">
{`import { useAuth } from '../shared/contexts/authContext.jsx';

const MyComponent = () => {
  const { user, login, logout, isAuthenticated, isAdmin } = useAuth();
  
  const handleLogin = async () => {
    const result = await login(email, password);
    if (result.success) {
      console.log('Usuario logueado:', result.user);
    }
  };
  
  return (
    <div>
      {isAuthenticated() ? (
        <div>
          <p>Hola {user?.nombre}!</p>
          {isAdmin() && <p>Eres administrador</p>}
          <button onClick={logout}>Cerrar Sesión</button>
        </div>
      ) : (
        <button onClick={handleLogin}>Iniciar Sesión</button>
      )}
    </div>
  );
};`}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApiUsageExample;
