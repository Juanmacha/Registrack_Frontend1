import React, { useState, useEffect } from 'react';
import { mockDataService } from '../../../../../utils/mockDataService';
import {
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
    const nuevosServicios = await Promise.resolve(mockDataService.getServices());
    setServicios([...nuevosServicios]);
    setLoading(false);
  };

  useEffect(() => {
    cargarServicios();
  }, []);

  const handleToggleVisibilidad = async (id) => {
    const servicio = servicios.find(s => s.id === id);
    if (servicio && servicio.visible_en_landing) {
      const result = await AlertService.warning("¿Ocultar servicio?", "¿Estás seguro que deseas ocultar este servicio de la página principal? No será visible para los usuarios.");
      if (!result.isConfirmed) return;
    }
    try {
      await Promise.resolve(toggleVisibilidadServicio(id));
      AlertService.success("Visibilidad actualizada", "El estado de visibilidad del servicio ha sido actualizado.");
      cargarServicios();
    } catch (err) {
      AlertService.error("Error", "");
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
      AlertService.success("Servicio actualizado", "El servicio ha sido actualizado correctamente.");
      cargarServicios();
    } catch (err) {
      AlertService.error("Error", "");
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
                    className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                    Ver
                  </button>
                  <button
                    onClick={() => handleToggleVisibilidad(servicio.id)}
                    className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    {servicio.visible_en_landing ? (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                    {servicio.visible_en_landing ? 'Ocultar' : 'Mostrar'}
                  </button>
                  <button
                    onClick={() => handleEditar(servicio)}
                    className="flex-1 px-3 py-2 bg-gray-50 text-gray-700 rounded-lg hover:bg-gray-100 transition-colors duration-200 text-sm font-medium flex items-center justify-center"
                  >
                    <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
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
