import React, { useEffect, useState } from "react";
import { BiArrowBack, BiEditAlt } from "react-icons/bi";
import authData from "../services/authData";
import { useNavigate } from "react-router-dom";

const ViewProfile = () => {
  const [usuario, setUsuario] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const user = authData.getUser();
    setUsuario(user);
  }, []);

  if (!usuario) return <div className="h-screen flex justify-center items-center">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header azul */}
      <div className="bg-gradient-to-r from-blue-600 to-blue-700 p-6 relative">
        <button
          onClick={() => navigate(-1)}
          className="absolute top-6 left-6 bg-white/20 hover:bg-white/30 text-white p-2 rounded-full"
        >
          <BiArrowBack />
        </button>
        <div className="flex flex-col items-center">
          <div className="w-24 h-24 rounded-full bg-red-500 text-white font-bold text-3xl flex items-center justify-center border-4 border-white shadow-md">
            {usuario.firstName?.charAt(0)}{usuario.lastName?.charAt(0)}
          </div>
          <h1 className="text-white text-2xl font-semibold mt-2">Mi Perfil</h1>
          <p className="text-white">{usuario.firstName} {usuario.lastName}</p>
        </div>
      </div>

      {/* Contenido */}
      <div className="max-w-4xl mx-auto bg-white mt-6 p-8 rounded-lg shadow-md">
        {/* Información Personal */}
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Información Personal</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <p><strong>Nombre:</strong> {usuario.firstName}</p>
          <p><strong>Apellido:</strong> {usuario.lastName}</p>
        </div>

        {/* Documentación */}
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Documentación</h2>
        <div className="grid md:grid-cols-2 gap-4 mb-6">
          <p><strong>Tipo de Documento:</strong> {usuario.documentType}</p>
          <p><strong>Número:</strong> {usuario.documentNumber}</p>
        </div>

        {/* Acceso */}
        <h2 className="text-lg font-semibold mb-4 border-b pb-2">Información de Acceso</h2>
        <div className="grid md:grid-cols-2 gap-4">
          <p><strong>Correo Electrónico:</strong> {usuario.email}</p>
          <p><strong>Contraseña:</strong> ********</p>
        </div>

        {/* Botón de Editar */}
        <div className="mt-6 text-right">
          <button
            onClick={() => navigate("/editProfile")}
            className="px-5 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            <BiEditAlt className="inline mr-1" /> Editar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ViewProfile;