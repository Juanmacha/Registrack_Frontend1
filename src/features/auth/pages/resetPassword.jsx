import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiKey, BiLock, BiHide, BiShow, BiLeftArrowAlt } from "react-icons/bi";
import authApiService from '../services/authApiService.js';
import alertService from '../../../utils/alertService.js';

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  // Función para manejar la navegación con confirmación
  const handleNavigation = async (path) => {
    if (formData.newPassword || formData.confirmPassword) {
      const result = await alertService.confirm(
        "¿Salir del proceso?",
        "Tienes información ingresada. ¿Estás seguro de que quieres salir? Perderás el progreso actual.",
        {
          confirmButtonText: "Sí, salir",
          cancelButtonText: "Cancelar",
          confirmButtonColor: "#ef4444",
          cancelButtonColor: "#6b7280"
        }
      );
      
      if (result.isConfirmed) {
        navigate(path);
      }
    } else {
      navigate(path);
    }
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = async () => {
    const { newPassword, confirmPassword } = formData;
    
    // Validaciones con alertas
    if (!newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      await alertService.warning(
        "Campos requeridos",
        "Por favor completa todos los campos para restablecer tu contraseña."
      );
      return;
    }
    
    if (newPassword.length < 6) {
      setError("La contraseña debe tener al menos 6 caracteres.");
      await alertService.warning(
        "Contraseña muy corta",
        "La contraseña debe tener al menos 6 caracteres para mayor seguridad."
      );
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      await alertService.warning(
        "Contraseñas no coinciden",
        "Las contraseñas ingresadas no son iguales. Por favor, verifica que ambas sean idénticas."
      );
      return;
    }
    
    setError("");
    
    try {
      const token = localStorage.getItem("resetToken");
      if (!token) {
        setError("No se encontró el token de recuperación. Por favor, solicita uno nuevo.");
        await alertService.error(
          "Token no encontrado",
          "No se encontró el código de recuperación. Por favor, solicita uno nuevo desde el paso anterior.",
          { confirmButtonText: "Solicitar nuevo código" }
        );
        navigate("/forgotPassword");
        return;
      }
      
      console.log('🔐 [ResetPassword] Restableciendo contraseña con token:', token);
      
      console.log('🔄 [ResetPassword] Llamando a resetPassword...');
      const result = await authApiService.resetPassword(token, newPassword);
      console.log('📥 [ResetPassword] Respuesta recibida:', result);
      
      if (result.success) {
        console.log('✅ [ResetPassword] Contraseña restablecida exitosamente');
        await alertService.success(
          "¡Contraseña restablecida!",
          "Tu contraseña ha sido actualizada correctamente. Ahora puedes iniciar sesión con tu nueva contraseña.",
          { 
            confirmButtonText: "Ir al Login",
            timer: 3000,
            timerProgressBar: true
          }
        );
        localStorage.removeItem("resetToken");
        localStorage.removeItem("emailRecuperacion");
        setSuccess(true);
      } else {
        console.log('❌ [ResetPassword] Error al restablecer contraseña:', result.message);
        await alertService.error(
          "Error al restablecer contraseña",
          result.message || "No se pudo restablecer la contraseña. El código puede haber expirado o ser inválido. Por favor, solicita uno nuevo.",
          { confirmButtonText: "Solicitar nuevo código" }
        );
        setError(result.message || "Error al restablecer la contraseña. Intenta de nuevo.");
      }
    } catch (error) {
      console.error('💥 [ResetPassword] Error:', error);
      await alertService.error(
        "Error de conexión",
        "No se pudo conectar con el servidor. Verifica tu conexión a internet e intenta de nuevo.",
        { confirmButtonText: "Reintentar" }
      );
      setError("Error al restablecer la contraseña. Intenta de nuevo.");
    }
  };

  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 2000);
      return () => clearTimeout(timer);
    }
  }, [success, navigate]);

  return (
    <div className="min-h-screen bg-white flex">
      {/* Formulario de Reset - Lado Izquierdo */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Botón Volver */}
            <div className="mb-4">
              <button
                onClick={() => handleNavigation("/codigoRecuperacion")}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <BiLeftArrowAlt className="mr-2" />
                Volver
              </button>
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold text-blue-900 mb-8 text-center">
              Restablecer contraseña - Certimarcas
            </h1>

            {success ? (
              <div className="text-center">
                <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-600 text-sm">
                    Tu contraseña ha sido restablecida correctamente. Serás redirigido al login.
                  </p>
                </div>
              </div>
            ) : (
              <>
                {/* Error Message */}
                {error && (
                  <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-red-600 text-sm text-center">{error}</p>
                  </div>
                )}

                {/* Formulario */}
                <div className="space-y-6">
                  {/* Campo Nueva Contraseña */}
                  <div>
                    <div className="relative">
                      <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="newPassword"
                        placeholder="Nueva contraseña"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                      <button
                        type="button"
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                        onClick={() => setShowPassword(!showPassword)}
                      >
                        {showPassword ? <BiHide className="text-lg" /> : <BiShow className="text-lg" />}
                      </button>
                    </div>
                  </div>

                  {/* Campo Confirmar Contraseña */}
                  <div>
                    <div className="relative">
                      <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                      <input
                        type={showPassword ? "text" : "password"}
                        name="confirmPassword"
                        placeholder="Confirmar contraseña"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      />
                    </div>
                  </div>

                  {/* Botón de Restablecimiento */}
                  <button
                    onClick={handleReset}
                    disabled={!formData.newPassword || !formData.confirmPassword}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Restablecer Contraseña
                  </button>

                  {/* Enlace de Regreso */}
                  <div className="text-center">
                    <p className="text-sm text-gray-600">
                      ¿Recordaste tu contraseña?{" "}
                      <button
                        onClick={() => handleNavigation("/login")}
                        className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                      >
                        Inicia sesión
                      </button>
                    </p>
                  </div>
                </div>
              </>
            )}
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

export default ResetPassword;
