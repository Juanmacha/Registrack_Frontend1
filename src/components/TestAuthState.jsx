import React, { useState, useEffect } from 'react';
import { useAuth } from '../shared/contexts/authContext';

const TestAuthState = () => {
  const { user, isAuthenticated, loading } = useAuth();
  const [refreshCount, setRefreshCount] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setRefreshCount(prev => prev + 1);
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="container mt-4">
      <div className="card">
        <div className="card-header">
          <h3>🔍 Estado de Autenticación en Tiempo Real</h3>
          <small>Actualización automática cada segundo (Refresh #{refreshCount})</small>
        </div>
        <div className="card-body">
          <div className="row">
            <div className="col-md-6">
              <h5>Estado del Contexto:</h5>
              <ul className="list-group">
                <li className="list-group-item">
                  <strong>Loading:</strong> {loading ? 'Sí' : 'No'}
                </li>
                <li className="list-group-item">
                  <strong>Autenticado:</strong> {isAuthenticated() ? 'Sí' : 'No'}
                </li>
                <li className="list-group-item">
                  <strong>Usuario:</strong> {user ? 'Presente' : 'Ausente'}
                </li>
              </ul>
            </div>
            <div className="col-md-6">
              <h5>Datos del Usuario:</h5>
              <pre className="bg-light p-3" style={{ maxHeight: '200px', overflow: 'auto' }}>
                {user ? JSON.stringify(user, null, 2) : 'No hay usuario logueado'}
              </pre>
            </div>
          </div>
          
          <div className="mt-3">
            <h5>LocalStorage:</h5>
            <div className="row">
              <div className="col-md-4">
                <strong>authToken:</strong><br/>
                <small className="text-muted">
                  {localStorage.getItem('authToken') ? 'Presente' : 'Ausente'}
                </small>
              </div>
              <div className="col-md-4">
                <strong>currentUser:</strong><br/>
                <small className="text-muted">
                  {localStorage.getItem('currentUser') ? 'Presente' : 'Ausente'}
                </small>
              </div>
              <div className="col-md-4">
                <strong>isAuthenticated:</strong><br/>
                <small className="text-muted">
                  {localStorage.getItem('isAuthenticated') || 'Ausente'}
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestAuthState;
