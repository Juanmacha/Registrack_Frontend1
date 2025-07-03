import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import CrearSolicitud from '../../dashboard/pages/gestionVentasServicios/components/CrearSolicitud';

const CrearSolicitudPage = () => {
  const { servicioId } = useParams();
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-10">
      <CrearSolicitud
        isOpen={true}
        onClose={() => navigate(-1)}
        servicioId={servicioId}
      />
    </div>
  );
};

export default CrearSolicitudPage; 