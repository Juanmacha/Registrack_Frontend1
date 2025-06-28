import React from "react";
import { FaUserCircle } from "react-icons/fa";

const VerDetalleUsuario = ({ usuario, onClose }) => {
  if (!usuario) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-2xl w-full max-w-2xl p-8 relative animate-fade-in-down">

        {/* Botón cerrar */}
        <button
          className="absolute top-4 right-4 text-gray-500 hover:text-red-600 text-3xl"
          onClick={onClose}
          title="Cerrar"
        >
          &times;
        </button>

        {/* Título */}
        <div className="flex items-center gap-3 mb-6 border-b pb-3">
          <FaUserCircle className="text-4xl text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-800">Detalle del Usuario</h2>
        </div>

        {/* Información organizada en 2 columnas */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-12 gap-y-5 text-lg text-gray-800">
          {/* Columna izquierda */}
          <div>
            <p><strong>Nombre:</strong> {usuario.firstName}</p>
            <p><strong>Tipo de Documento:</strong> {usuario.documentType}</p>
            <p><strong>Email:</strong> {usuario.email}</p>
          </div>

          {/* Columna derecha */}
          <div>
            <p><strong>Apellido:</strong> {usuario.lastName}</p>
            <p><strong>Número de Documento:</strong> {usuario.documentNumber}</p>
            <p>
              <strong>Rol:</strong>{" "}
              <span
                className={`px-3 py-1 rounded-full text-sm font-semibold ${
                  usuario.role === "administrador"
                    ? "bg-blue-100 text-blue-800"
                    : "bg-green-100 text-green-800"
                }`}
              >
                {usuario.role}
              </span>
            </p>
          </div>
        </div>

        {/* Botón de cierre */}
        <div className="mt-8 text-right">
          <button
            onClick={onClose}
            className="bg-red-600 text-white px-6 py-2 text-lg rounded-md hover:bg-red-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default VerDetalleUsuario;
