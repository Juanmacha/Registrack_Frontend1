import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEnvelope, BiLeftArrowAlt } from "react-icons/bi";
import authApiService from '../services/authApiService.js';
import alertService from '../../../utils/alertService.js';

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

  const handleSubmit = async () => {
    const err = validate(email);
    setError(err);
    if (err) return;
    
    // Cerrar cualquier alerta previa
    alertService.close();
    
    try {
      console.log('🔐 [ForgotPassword] Enviando solicitud de recuperación para:', email);
      console.log('🔐 [ForgotPassword] Tipo de email:', typeof email);
      console.log('🔐 [ForgotPassword] Email vacío:', !email);
      console.log('🔐 [ForgotPassword] Email validado:', !validate(email));
      
      console.log('🔄 [ForgotPassword] Llamando a forgotPasswordDirect...');
      
      // Usar la versión directa con fetch
      const result = await authApiService.forgotPasswordDirect(email);
      console.log('📥 [ForgotPassword] Respuesta recibida:', result);
      
      console.log('🔍 [ForgotPassword] Resultado completo:', result);
      console.log('🔍 [ForgotPassword] result.success:', result.success);
      console.log('🔍 [ForgotPassword] result.message:', result.message);
      
      if (result.success) {
        console.log('✅ [ForgotPassword] Solicitud enviada exitosamente');
        await alertService.success(
          "¡Solicitud enviada!",
          "Se ha enviado un código de recuperación a tu correo electrónico. Revisa tu bandeja de entrada y spam.",
          { 
            confirmButtonText: "Continuar",
            timer: 3000,
            timerProgressBar: true
          }
        );
        localStorage.setItem("emailRecuperacion", email);
        navigate("/codigoRecuperacion");
      } else {
        console.log('❌ [ForgotPassword] Error en la solicitud:', result.message);
        await alertService.error(
          "Error en la solicitud",
          result.message || "No se pudo enviar el código de recuperación. Verifica que el email esté registrado e intenta de nuevo.",
          { confirmButtonText: "Intentar de nuevo" }
        );
        setError(result.message || "Error al enviar la solicitud. Intenta de nuevo.");
      }
    } catch (error) {
      console.error('💥 [ForgotPassword] Error general:', error);
      // Asegurar que se cierre la alerta de carga
      alertService.close();
      await alertService.error(
        "Error de conexión",
        "No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta de nuevo.",
        { confirmButtonText: "Reintentar" }
      );
      setError("Error al enviar la solicitud. Intenta de nuevo.");
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
              Recuperar contraseña - Certimarcas
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
                    placeholder="admin@registrack.com"
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
                <p className="text-sm text-gray-600">
                  ¿Recordaste tu contraseña?{" "}
                  <button
                    onClick={() => navigate("/login")}
                    className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                  >
                    Inicia sesión
                  </button>
                </p>
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