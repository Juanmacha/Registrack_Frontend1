import React from 'react';
import alertService from '../utils/alertService.js';

const AlertExamples = () => {
  const handleSuccessAlert = () => {
    alertService.success('¡Éxito!', 'La operación se completó correctamente.');
  };

  const handleErrorAlert = () => {
    alertService.error('Error', 'Ocurrió un error durante la operación.');
  };

  const handleWarningAlert = () => {
    alertService.warning('Advertencia', 'Ten cuidado con esta acción.');
  };

  const handleInfoAlert = () => {
    alertService.info('Información', 'Esta es una alerta informativa.');
  };

  const handleQuestionAlert = async () => {
    const result = await alertService.question('¿Estás seguro?', '¿Quieres continuar con esta acción?');
    if (result.isConfirmed) {
      alertService.success('Confirmado', 'Has confirmado la acción.');
    }
  };

  const handleConfirmAlert = async () => {
    const result = await alertService.confirm(
      'Confirmar acción',
      '¿Estás seguro de que quieres realizar esta acción?',
      'Sí, continuar',
      'No, cancelar'
    );
    if (result.isConfirmed) {
      alertService.success('Acción confirmada', 'La acción se ha realizado correctamente.');
    }
  };

  const handleDeleteConfirm = async () => {
    const result = await alertService.deleteConfirm('este usuario');
    if (result.isConfirmed) {
      // Simular eliminación
      setTimeout(() => {
        alertService.deleteSuccess('el usuario');
      }, 1000);
    }
  };

  const handleSaveSuccess = () => {
    alertService.saveSuccess('los datos del usuario');
  };

  const handleValidationError = () => {
    alertService.validationError('Por favor, completa todos los campos requeridos.');
  };

  const handleAccessDenied = () => {
    alertService.accessDenied();
  };

  const handleSessionExpired = () => {
    alertService.sessionExpired();
  };

  const handleLoadingExample = async () => {
    const loadingAlert = alertService.loading('Procesando datos...');
    
    // Simular operación asíncrona
    setTimeout(() => {
      alertService.close();
      alertService.success('Completado', 'Los datos se han procesado correctamente.');
    }, 2000);
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-800 mb-8">Ejemplos de Alertas SweetAlert2</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Alertas básicas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Alertas Básicas</h2>
            <div className="space-y-3">
              <button
                onClick={handleSuccessAlert}
                className="w-full bg-green-500 text-white py-2 px-4 rounded-lg hover:bg-green-600 transition"
              >
                Alerta de Éxito
              </button>
              <button
                onClick={handleErrorAlert}
                className="w-full bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition"
              >
                Alerta de Error
              </button>
              <button
                onClick={handleWarningAlert}
                className="w-full bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition"
              >
                Alerta de Advertencia
              </button>
              <button
                onClick={handleInfoAlert}
                className="w-full bg-blue-500 text-white py-2 px-4 rounded-lg hover:bg-blue-600 transition"
              >
                Alerta de Información
              </button>
            </div>
          </div>

          {/* Confirmaciones */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Confirmaciones</h2>
            <div className="space-y-3">
              <button
                onClick={handleQuestionAlert}
                className="w-full bg-purple-500 text-white py-2 px-4 rounded-lg hover:bg-purple-600 transition"
              >
                Pregunta Simple
              </button>
              <button
                onClick={handleConfirmAlert}
                className="w-full bg-indigo-500 text-white py-2 px-4 rounded-lg hover:bg-indigo-600 transition"
              >
                Confirmación Personalizada
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="w-full bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 transition"
              >
                Confirmar Eliminación
              </button>
            </div>
          </div>

          {/* Alertas específicas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Alertas Específicas</h2>
            <div className="space-y-3">
              <button
                onClick={handleSaveSuccess}
                className="w-full bg-green-600 text-white py-2 px-4 rounded-lg hover:bg-green-700 transition"
              >
                Guardado Exitoso
              </button>
              <button
                onClick={handleValidationError}
                className="w-full bg-orange-500 text-white py-2 px-4 rounded-lg hover:bg-orange-600 transition"
              >
                Error de Validación
              </button>
              <button
                onClick={handleAccessDenied}
                className="w-full bg-red-700 text-white py-2 px-4 rounded-lg hover:bg-red-800 transition"
              >
                Acceso Denegado
              </button>
              <button
                onClick={handleSessionExpired}
                className="w-full bg-yellow-600 text-white py-2 px-4 rounded-lg hover:bg-yellow-700 transition"
              >
                Sesión Expirada
              </button>
            </div>
          </div>

          {/* Alertas avanzadas */}
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Alertas Avanzadas</h2>
            <div className="space-y-3">
              <button
                onClick={handleLoadingExample}
                className="w-full bg-gray-600 text-white py-2 px-4 rounded-lg hover:bg-gray-700 transition"
              >
                Alerta de Carga
              </button>
            </div>
          </div>
        </div>

        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4 text-gray-800">Código de Ejemplo</h2>
          <pre className="bg-gray-100 p-4 rounded-lg overflow-x-auto text-sm">
{`// Importar el servicio
import alertService from '../utils/alertService.js';

// Alerta de éxito
alertService.success('¡Éxito!', 'Operación completada');

// Alerta de error
alertService.error('Error', 'Algo salió mal');

// Confirmación
const result = await alertService.confirm('Título', 'Mensaje');
if (result.isConfirmed) {
  // Usuario confirmó
}

// Alerta de carga
const loading = alertService.loading('Cargando...');
// ... operación asíncrona
alertService.close();

// Eliminación
const result = await alertService.deleteConfirm('este elemento');
if (result.isConfirmed) {
  // Eliminar elemento
  alertService.deleteSuccess('el elemento');
}`}
          </pre>
        </div>
      </div>
    </div>
  );
};

export default AlertExamples; 