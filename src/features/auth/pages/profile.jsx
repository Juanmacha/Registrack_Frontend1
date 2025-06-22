// src/features/auth/pages/Profile.jsx
import React from "react";
import { BiUser, BiIdCard, BiEnvelope } from "react-icons/bi";

const Profile = () => {
  const token = localStorage.getItem("token");
  const usuarios = JSON.parse(localStorage.getItem("usuarios")) || [];

  const user = token ? usuarios[usuarios.length - 1] : null;

  return (
    <div className="min-h-screen bg-[#f7f8fa] flex items-center justify-center px-4">
      <div className="bg-white p-8 rounded-xl shadow-md w-full max-w-xl">
        <h1 className="text-3xl font-bold text-blue-900 text-center mb-6">
          Mi Perfil
        </h1>

        {user ? (
          <div className="space-y-6 text-gray-700">
            <div className="flex items-center gap-3">
              <BiUser className="text-blue-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Nombre completo</p>
                <p className="text-lg font-medium">{user.firstName} {user.lastName}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BiIdCard className="text-blue-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Tipo de documento</p>
                <p className="text-lg font-medium">{user.documentType}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BiIdCard className="text-blue-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Número de documento</p>
                <p className="text-lg font-medium">{user.documentNumber}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <BiEnvelope className="text-blue-600 text-xl" />
              <div>
                <p className="text-sm text-gray-500">Correo electrónico</p>
                <p className="text-lg font-medium">{user.email}</p>
              </div>
            </div>
          </div>
        ) : (
          <p className="text-center text-red-500 text-lg font-medium mt-6">
            No hay sesión activa.
          </p>
        )}
      </div>
    </div>
  );
};

export default Profile;