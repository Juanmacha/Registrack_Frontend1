import React, { useState, useEffect } from 'react';
import { crearVenta } from '../services/ventasService';
import { mockDataService } from '../../../../../utils/mockDataService';
import authData from '../../../../auth/services/authData.js';
import Swal from 'sweetalert2';
import { PAISES } from '../../../../../shared/utils/paises.js';
// Importar formularios específicos
import FormularioBusqueda from '../../../../../shared/components/formularioBusqueda';
import FormularioCertificacion from '../../../../../shared/components/formularioCertificacion';
import FormularioRenovacion from '../../../../../shared/components/formularioCesiondeMarca';
import FormularioOposicion from '../../../../../shared/components/formularioOposicion';
import FormularioCesion from '../../../../../shared/components/formularioCesiondeMarca';
import FormularioAmpliacion from '../../../../../shared/components/formularioAmpliacion';
import FormularioRespuesta from '../../../../../shared/components/formularioRespuesta';
import DemoPasarelaPagoModal from '../../../../landing/components/DemoPasarelaPagoModal'; // Asegúrate de que la ruta sea correcta

// ...existing code...

const CrearSolicitud = ({ isOpen, onClose, onGuardar, tipoSolicitud, servicioId }) => {
  // ...existing code...

  // Estado para la pasarela demo
  const [mostrarPasarela, setMostrarPasarela] = useState(false);
  const [pagoDemo, setPagoDemo] = useState(null);

  // ...existing code...

  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = validate();
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      Swal.fire({
        icon: 'error',
        title: 'Error en el formulario',
        text: 'Por favor, corrige los campos marcados en rojo antes de continuar.'
      });
      return;
    }
    // Mostrar la pasarela demo antes de guardar
    setMostrarPasarela(true);
  };

  // Cuando el pago es exitoso, guardar la solicitud
  const handlePagoExitoso = async (pago) => {
    setMostrarPasarela(false);
    setPagoDemo(pago);
    try {
      // Convertir archivos a base64 antes de guardar
      const formToSave = { ...form };
      const fileFields = [
        'certificadoCamara',
        'logotipoMarca',
        'poderRepresentante',
        'poderAutorizacion',
      ];
      for (const field of fileFields) {
        if (formToSave[field] instanceof File) {
          formToSave[field] = await fileToBase64(formToSave[field]);
        }
      }
      await onGuardar(formToSave);
      Swal.fire({
        icon: 'success',
        title: 'Solicitud creada',
        text: 'La solicitud se ha creado correctamente.'
      });
      onClose();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error al guardar',
        text: err?.message || 'Ocurrió un error al guardar la solicitud.'
      });
    }
  };

  // ...existing code...

  return (
    isOpen && (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
        <div className="bg-white rounded-xl border border-gray-200 shadow-xl w-full max-w-3xl p-8 overflow-y-auto max-h-[90vh]">
          <h2 className="text-2xl font-bold mb-6 text-center text-blue-800">Crear Solicitud</h2>
          {/* Renderizar el formulario dinámico */}
          {FormularioComponente ? (
            <form onSubmit={handleSubmit}>
              <FormularioComponente
                isOpen={isOpen}
                onClose={onClose}
                onGuardar={onGuardar}
                tipoSolicitud={tipoSolicitud}
                servicioId={servicioId}
                form={form}
                setForm={setForm}
                errors={errors}
                setErrors={setErrors}
                handleChange={handleChange}
                handleClaseChange={handleClaseChange}
                addClase={addClase}
                removeClase={removeClase}
              />
              <div className="flex justify-end mt-6">
                <button type="button" onClick={onClose} className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400 text-gray-700 font-semibold">Cancelar</button>
                <button type="submit" className="ml-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold">Guardar y Pagar</button>
              </div>
            </form>
          ) : (
            <div className="text-red-500">No hay formulario disponible para este servicio.</div>
          )}
          {/* Modal de pasarela demo */}
          <DemoPasarelaPagoModal
            isOpen={mostrarPasarela}
            onClose={() => setMostrarPasarela(false)}
            monto={1000000} // Puedes ajustar el monto según el servicio
            datosPago={{
              nombreMarca: form.nombreMarca || '',
              nombreRepresentante: `${form.nombres || ''} ${form.apellidos || ''}`.trim(),
              tipoDocumento: form.tipoDocumento || '',
              numeroDocumento: form.numeroDocumento || '',
              // ...otros datos si necesitas, siempre con valor por defecto
            }}
            onPagoExitoso={handlePagoExitoso}
          />
        </div>
      </div>
    )
  );
};

export default CrearSolicitud;