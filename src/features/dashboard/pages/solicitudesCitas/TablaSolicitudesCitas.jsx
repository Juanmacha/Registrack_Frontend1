import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { mockDataService } from '../../../../utils/mockDataService.js';
import alertService from '../../../../utils/alertService.js';
import Swal from "sweetalert2";

const TablaSolicitudesCitas = ({ solicitudes, onVer, deshabilitarAcciones, cargarSolicitudes }) => {
  const navigate = useNavigate();

  const getEstadoBadge = (estado) => {
    const badges = {
      'Pendiente': 'text-yellow-800',
      'Aprobada': 'text-green-800',
      'Rechazada': 'text-red-800'
    };
    return badges[estado] || 'text-gray-800';
  };

  const handleAgendar = (solicitud) => {
    // Guardar la información de la solicitud en localStorage para usarla en el calendario
    localStorage.setItem('solicitudParaAgendar', JSON.stringify({
      id: solicitud.id,
      clienteNombre: solicitud.nombre,
      clienteEmail: solicitud.email,
      clienteDocumento: solicitud.numeroDocumento,
      tipoDocumento: solicitud.tipoDocumento,
      telefono: solicitud.telefono,
      tipoSolicitud: solicitud.tipoSolicitud,
      mensaje: solicitud.mensaje,
      fechaSolicitud: solicitud.fechaCreacion
    }));

    // Mostrar mensaje de confirmación y navegar al calendario
    Swal.fire({
      icon: 'success',
      title: 'Redirigiendo al calendario',
      text: `Se abrirá el calendario para agendar la cita de ${solicitud.nombre}`,
      timer: 2000,
      showConfirmButton: false
    }).then(() => {
      navigate('/admin/calendario');
    });
  };

  return (
    <>
      <div className="overflow-hidden rounded-xl border border-gray-200 bg-white hover:shadow-2xl transition-shadow duration-300 z-40">
        <div className="overflow-x-auto w-full">
          <table className="table-auto w-full divide-y divide-gray-100 text-sm text-gray-700">
            <thead className="text-left text-sm text-gray-500 bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-center">#</th>
                <th className="px-6 py-4 text-center">Cliente</th>
                <th className="px-6 py-4 text-center">Documento</th>
                <th className="px-6 py-4 text-center">Tipo Solicitud</th>
                <th className="px-6 py-4 text-center">Estado</th>
                <th className="px-6 py-4 text-center">Fecha</th>
                <th className="px-6 py-4 text-center">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 text-sm text-gray-700">
              {solicitudes.length > 0 ? (
                solicitudes.map((solicitud, idx) => (
                  <tr key={solicitud.id}>
                    <td className="px-6 py-4 text-center">{idx + 1}</td>
                    <td className="px-6 py-4 text-center">
                      <div>
                        <div className="font-medium">{solicitud.nombre}</div>
                        <div className="text-gray-500 text-xs">{solicitud.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center">{solicitud.numeroDocumento}</td>
                    <td className="px-6 py-4 text-center">{solicitud.tipoSolicitud}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold transition-all duration-200 ${getEstadoBadge(solicitud.estado)}`}>
                        {solicitud.estado}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      {new Date(solicitud.fechaCreacion).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex gap-2 justify-center">
                        <button
                          onClick={() => onVer(idx)}
                          title="Ver detalle"
                          className="btn btn-outline-info rounded-circle p-0 d-flex align-items-center justify-center custom-hover"
                          style={{
                            width: "32px",
                            height: "32px",
                            borderColor: "#1E4A85",
                            color: "#1E4A85",
                          }}
                          disabled={deshabilitarAcciones}
                        >
                          <i className="bi bi-eye-fill text-base"></i>
                        </button>
                        
                        {solicitud.estado === 'Pendiente' && (
                          <button
                            onClick={() => handleAgendar(solicitud)}
                            title="Agendar Cita"
                            className="btn btn-outline-success rounded-circle p-0 d-flex align-items-center justify-center custom-hover"
                            style={{
                              width: "32px",
                              height: "32px",
                              borderColor: "#28a745",
                              color: "#28a745",
                            }}
                            disabled={deshabilitarAcciones}
                          >
                            <i className="bi bi-calendar-plus"></i>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-4 text-sm text-gray-500">
                    No hay solicitudes de citas registradas.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <style jsx>{`
          .custom-hover:hover {
            opacity: 0.8;
            transform: scale(1.05);
            transition: all 0.2s ease-in-out;
          }
        `}</style>
      </div>
    </>
  );
};

export default TablaSolicitudesCitas;