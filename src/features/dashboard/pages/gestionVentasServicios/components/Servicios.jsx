import React, { useState, useEffect } from 'react';
import {
  getServicios,
  toggleVisibilidadServicio,
  updateLandingData,
  updateInfoPageData,
  updateProcessStates,
} from '../services/serviciosManagementService';
import ModalVerDetalleServicio from './ModalVerDetalleServicio';
import ModalEditarServicio from './ModalEditarServicio';
import Swal from 'sweetalert2';

const Servicios = () => {
  const [servicios, setServicios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [detalle, setDetalle] = useState(null);
  const [editar, setEditar] = useState(null);

  const cargarServicios = async () => {
    setLoading(true);
    // Forzar lectura fresca de localStorage
    const nuevosServicios = await Promise.resolve(getServicios());
    setServicios([...nuevosServicios]);
    setLoading(false);
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const handleToggleVisibilidad = async (id) => {
    const servicio = servicios.find(s => s.id === id);
    if (servicio && servicio.visible_en_landing) {
      const result = await Swal.fire({
        title: '¿Ocultar servicio?',
        text: '¿Estás seguro que deseas ocultar este servicio de la página principal? No será visible para los usuarios.',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, ocultar',
        cancelButtonText: 'Cancelar',
        reverseButtons: true
      });
      if (!result.isConfirmed) return;
    }
    try {
      await Promise.resolve(toggleVisibilidadServicio(id));
      Swal.fire({
        icon: 'success',
        title: 'Visibilidad actualizada',
        text: 'El estado de visibilidad del servicio ha sido actualizado.'
      });
      cargarServicios();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.message || 'Ocurrió un error al actualizar la visibilidad.'
      });
    }
  };

  const handleEditar = (servicio) => setEditar(servicio);
  const handleVerDetalle = (servicio) => setDetalle(servicio);

  const handleGuardarEdicion = async (tipo, data) => {
    if (!editar) return;
    try {
      if (tipo === 'landing') await Promise.resolve(updateLandingData(editar.id, data));
      if (tipo === 'info') await Promise.resolve(updateInfoPageData(editar.id, data));
      if (tipo === 'process') await Promise.resolve(updateProcessStates(editar.id, data));
      Swal.fire({
        icon: 'success',
        title: 'Servicio actualizado',
        text: 'El servicio ha sido actualizado correctamente.'
      });
      cargarServicios();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err?.message || 'Ocurrió un error al actualizar el servicio.'
      });
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex justify-center items-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando servicios...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex justify-center">
      <div className="w-full px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {servicios.map((servicio) => (
            <div
              key={servicio.id}
              className="bg-white rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 overflow-hidden"
            >
              <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-white">{servicio.nombre}</h3>
                  <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                    servicio.visible_en_landing 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {servicio.visible_en_landing ? 'Visible' : 'Oculto'}
                  </div>
                </div>
              </div>
              <div className="p-6">
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {servicio.descripcion_corta}
                </p>
                <div className="flex gap-2 flex-wrap">
                  <button
                    onClick={() => handleVerDetalle(servicio)}
                    className="flex-1 px-3 py-2 bg-blue-50 text-blue-700 rounded-lg hover:bg-blue-100 transition-colors duration-200 text-sm font-medium"
                  >
                    <i className="bi bi-eye mr-1"></i>
                    Ver
                  </button>
                  <button
                    onClick={() => handleToggleVisibilidad(servicio.id)}
                    className={`flex-1 px-3 py-2 rounded-lg transition-colors duration-200 text-sm font-medium ${
                      servicio.visible_en_landing
                        ? 'bg-orange-50 text-orange-700 hover:bg-orange-100'
                        : 'bg-green-50 text-green-700 hover:bg-green-100'
                    }`}
                  >
                    <i className={`bi ${servicio.visible_en_landing ? 'bi-eye-slash' : 'bi-eye'} mr-1`}></i>
                    {servicio.visible_en_landing ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button
                    onClick={() => handleEditar(servicio)}
                    className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium"
                  >
                    <i className="bi bi-pencil mr-1"></i>
                    Editar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
        <ModalVerDetalleServicio
          servicio={detalle}
          isOpen={!!detalle}
          onClose={() => setDetalle(null)}
        />
        <ModalEditarServicio
          servicio={editar}
          isOpen={!!editar}
          onClose={() => setEditar(null)}
          onSave={handleGuardarEdicion}
        />
      </div>
    </div>
  );
};

export default Servicios;
