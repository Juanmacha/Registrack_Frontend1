import React from "react";

const VerDetalleVenta = ({ datos, isOpen, onClose }) => {
  if (!isOpen || !datos) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-lg p-6 relative">

        <h2 className="text-xl font-semibold text-gray-800 mb-4 border-b pb-2">
          Detalle del servicio
        </h2>

        <div className="space-y-3 text-sm">
          <div><strong>Titular:</strong> {datos.titular}</div>
          <div><strong>Marca:</strong> {datos.marca}</div>
          <div><strong>Tipo de Solicitud:</strong> {datos.tipoSolicitud}</div>
          <div><strong>Tipo de Persona:</strong> {datos.tipoPersona}</div>
          <div><strong>Expediente:</strong> {datos.expediente}</div>
          <div><strong>Encargado:</strong> {datos.encargado}</div>
          <div><strong>Estado:</strong> {datos.estado}</div>
          <div>
            <strong>Próxima Cita:</strong>{" "}
            {datos.proximaCita || (
              <span className="italic text-gray-400">Sin citas asignadas</span>
            )}
          </div>
        </div>

        <div className="mt-6 text-end border-t pt-4">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-4 py-2 text-sm rounded-lg hover:bg-red-700"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerDetalleVenta;
