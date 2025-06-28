import React from "react";
import { FaUserTie } from "react-icons/fa";

const VerDetalleCliente = ({ cliente, onClose }) => {
  if (!cliente) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl p-8 relative animate-fade-in-down border border-gray-200">

        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-xl"
          onClick={onClose}
          title="Cerrar"
        >
          &times;
        </button>

        {/* Encabezado */}
        <div className="flex items-center gap-2 mb-6 border-b pb-3">
          <FaUserTie className="text-2xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Detalle del Cliente</h2>
        </div>

        {/* Información en 2 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-4 text-[15px] text-gray-700">
          <div><strong>Nombre:</strong> {cliente.nombre}</div>
          <div><strong>Apellido:</strong> {cliente.apellido}</div>
          <div><strong>Documento:</strong> {cliente.documento}</div>
          <div><strong>Email:</strong> {cliente.email}</div>
          <div><strong>Teléfono:</strong> {cliente.telefono}</div>
          <div><strong>NIT Empresa:</strong> {cliente.nitEmpresa}</div>
          <div><strong>Nombre Empresa:</strong> {cliente.nombreEmpresa}</div>
          <div><strong>Marca:</strong> {cliente.marca}</div>
          <div><strong>Tipo de Persona:</strong> {cliente.tipoPersona}</div>
          <div><strong>Estado:</strong> 
            <span className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${
              cliente.estado === "activo"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}>
              {cliente.estado}
            </span>
          </div>
        </div>

        {/* Botón Cerrar */}
        <div className="mt-6 text-end">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 rounded-md hover:bg-red-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerDetalleCliente;
