import React, { useState } from 'react';
import { useSalesSync } from '../utils/hooks/useDataSync.js';
import { mockDataService } from '../utils/mockDataService.js';
import { crearVenta } from '../features/dashboard/pages/gestionVentasServicios/services/ventasService.js';
import authData from '../features/auth/services/authData.js';

const TestSincronizacion = () => {
  const [testEmail, setTestEmail] = useState('test@example.com');
  const [ventas, refreshVentas, lastUpdate] = useSalesSync(
    () => mockDataService.getSales().getInProcess(),
    []
  );

  const [procesosUsuario, refreshProcesos, lastUpdateProcesos] = useSalesSync(
    () => {
      // Simular getSolicitudesUsuario
      const todas = mockDataService.getSales().getAll();
      return todas.filter(s => s && s.email === testEmail);
    },
    [testEmail]
  );

  const crearVentaPrueba = async () => {
    try {
      const ventaPrueba = {
        expediente: `EXP-${Date.now()}`,
        tipoSolicitante: 'Titular',
        tipoPersona: 'Natural',
        nombreCompleto: 'Usuario Prueba',
        email: testEmail,
        telefono: '3001234567',
        nombreMarca: 'Marca Prueba',
        tipoSolicitud: 'Certificación de Marca',
        estado: 'En revisión',
        encargado: 'Sin asignar'
      };

      await crearVenta(ventaPrueba);
      console.log('Venta de prueba creada:', ventaPrueba);
    } catch (error) {
      console.error('Error al crear venta de prueba:', error);
    }
  };

  const limpiarDatos = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-blue-800">Test de Sincronización</h1>
      
      <div className="mb-6">
        <label className="block text-sm font-medium mb-2">Email de prueba:</label>
        <input
          type="email"
          value={testEmail}
          onChange={(e) => setTestEmail(e.target.value)}
          className="px-4 py-2 border rounded-lg w-full max-w-md"
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-green-700">Todas las Ventas en Proceso</h2>
          <p className="text-sm text-gray-600 mb-2">Total: {ventas.length} ventas</p>
          <p className="text-sm text-gray-600 mb-4">Última actualización: {new Date(lastUpdate).toLocaleTimeString()}</p>
          <div className="max-h-60 overflow-y-auto">
            {ventas.map((venta, index) => (
              <div key={venta.id || index} className="border-b py-2 text-sm">
                <div><strong>ID:</strong> {venta.id}</div>
                <div><strong>Titular:</strong> {venta.titular}</div>
                <div><strong>Email:</strong> {venta.email}</div>
                <div><strong>Estado:</strong> {venta.estado}</div>
                <div><strong>Servicio:</strong> {venta.tipoSolicitud}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-blue-700">Procesos del Usuario ({testEmail})</h2>
          <p className="text-sm text-gray-600 mb-2">Total: {procesosUsuario.length} procesos</p>
          <p className="text-sm text-gray-600 mb-4">Última actualización: {new Date(lastUpdateProcesos).toLocaleTimeString()}</p>
          <div className="max-h-60 overflow-y-auto">
            {procesosUsuario.map((proceso, index) => (
              <div key={proceso.id || index} className="border-b py-2 text-sm">
                <div><strong>ID:</strong> {proceso.id}</div>
                <div><strong>Titular:</strong> {proceso.titular}</div>
                <div><strong>Email:</strong> {proceso.email}</div>
                <div><strong>Estado:</strong> {proceso.estado}</div>
                <div><strong>Servicio:</strong> {proceso.tipoSolicitud}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="flex gap-4 mb-8">
        <button
          onClick={crearVentaPrueba}
          className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          Crear Venta de Prueba
        </button>
        <button
          onClick={refreshVentas}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refrescar Ventas
        </button>
        <button
          onClick={refreshProcesos}
          className="px-6 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
        >
          Refrescar Procesos
        </button>
        <button
          onClick={limpiarDatos}
          className="px-6 py-3 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
        >
          Limpiar Datos
        </button>
      </div>

      <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
        <h3 className="font-semibold text-yellow-800 mb-2">Instrucciones de Prueba:</h3>
        <ol className="list-decimal list-inside text-sm text-yellow-700 space-y-1">
          <li>Cambia el email de prueba si quieres</li>
          <li>Haz clic en "Crear Venta de Prueba"</li>
          <li>Observa si aparece en ambas listas automáticamente</li>
          <li>Si no aparece, usa los botones de refrescar</li>
          <li>Verifica que la sincronización funcione en tiempo real</li>
        </ol>
      </div>
    </div>
  );
};

export default TestSincronizacion; 