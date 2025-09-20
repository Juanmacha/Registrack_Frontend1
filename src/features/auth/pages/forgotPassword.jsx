import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEnvelope, BiLeftArrowAlt } from "react-icons/bi";
import { UserService } from '../../../utils/mockDataService.js';

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const validate = (value) => {
    if (!value.trim()) return "Por favor ingresa un correo electrónico.";
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(value)) return "Ingresa un correo válido.";
    return "";
  };

  const handleSubmit = () => {
    const err = validate(email);
    setError(err);
    if (err) return;
    // Verifica en usuarios_mock
    const found = UserService.getByEmail(email);
    if (found) {
      setError("");
      localStorage.setItem("emailRecuperacion", email);
      navigate("/codigoRecuperacion");
    } else {
      setError("Este correo no está registrado.");
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Formulario de Recuperación - Lado Izquierdo */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Botón Volver */}
            <div className="mb-4">
              <button
                onClick={() => navigate("/")}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <BiLeftArrowAlt className="mr-2" />
                Volver al inicio
              </button>
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold text-blue-900 mb-8 text-center">
              Recuperar contraseña
            </h1>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Formulario */}
            <div className="space-y-6">
              {/* Campo Email */}
              <div>
                <div className="relative">
                  <BiEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    type="email"
                    placeholder="Correo electrónico"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setError("");
                    }}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Botón de Envío */}
              <button
                onClick={handleSubmit}
                disabled={!!validate(email)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Enviar Código
              </button>

              {/* Enlace de Regreso */}
              <div className="text-center">
                <button
                  onClick={() => navigate("/login")}
                  className="text-sm text-blue-500 hover:text-blue-700 transition-colors"
                >
                  Volver al inicio de sesión
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Video Decorativo - Lado Derecho */}
      <div className="flex-1 flex items-center justify-center bg-white">
        <div className="w-full max-w-lg h-96 flex items-center justify-center">
          <video
            src="/images/Whisk_cauajgm4ymzhyjjkltawzjetndazzc1hn2y3lwe.mp4"
            alt="Video Registrack"
            className="w-full h-full object-cover"
            autoPlay
            loop
            muted
            playsInline
          />
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;