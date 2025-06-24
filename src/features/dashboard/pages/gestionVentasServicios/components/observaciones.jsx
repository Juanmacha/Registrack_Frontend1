import React, { useState } from "react";

const Observaciones = ({ isOpen, onClose, onGuardar }) => {
  const [texto, setTexto] = useState("");

  const handleGuardar = () => {
    if (texto.trim() !== "") {
      onGuardar(texto.trim());
      setTexto("");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6 relative">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-red-500"
        >
          <i className="bi bi-x-lg text-xl"></i>
        </button>

        <h2 className="text-xl font-semibold mb-4">Añadir Observación</h2>

        <textarea
          rows="5"
          className="w-full border border-gray-300 rounded-md p-2 text-sm"
          placeholder="Escribe aquí la observación..."
          value={texto}
          onChange={(e) => setTexto(e.target.value)}
        />

        <div className="mt-4 text-end">
          <button
            onClick={handleGuardar}
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default Observaciones;
