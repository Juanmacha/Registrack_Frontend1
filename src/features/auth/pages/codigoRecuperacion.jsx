import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { BiKey, BiLeftArrowAlt } from "react-icons/bi";
import alertService from '../../../utils/alertService.js';

const CodigoRecuperacion = () => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // Función para manejar la navegación con confirmación
  const handleNavigation = async (path) => {
    if (codigo.trim()) {
      const result = await alertService.confirm(
        "¿Salir del proceso?",
        "Tienes un código ingresado. ¿Estás seguro de que quieres salir? Perderás el progreso actual.",
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

  const handleSubmit = async () => {
    if (!codigo.trim()) {
      setError("Por favor ingresa el código de recuperación.");
      await alertService.warning(
        "Código requerido",
        "Por favor ingresa el código de recuperación que recibiste por correo electrónico."
      );
      return;
    }
    
    // Validación básica del código (6 dígitos)
    if (!/^\d{6}$/.test(codigo)) {
      setError("El código debe tener 6 dígitos.");
      await alertService.warning(
        "Formato incorrecto",
        "El código debe tener exactamente 6 dígitos numéricos."
      );
      return;
    }
    
    setError("");
    
    try {
      console.log('🔐 [CodigoRecuperacion] Verificando código:', codigo);
      
      // Simular verificación (en un caso real, aquí se validaría con la API)
      console.log('🔄 [CodigoRecuperacion] Simulando verificación...');
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('✅ [CodigoRecuperacion] Código verificado exitosamente');
      
      // Mostrar confirmación de código válido
      await alertService.success(
        "¡Código válido!",
        "El código de recuperación ha sido verificado correctamente. Ahora puedes restablecer tu contraseña.",
        { 
          confirmButtonText: "Continuar",
          timer: 2000,
          timerProgressBar: true
        }
      );
      
      // Guardar el token/código en localStorage para usarlo en resetPassword
      localStorage.setItem("resetToken", codigo);
      navigate("/resetPassword");
      
    } catch (error) {
      console.error('💥 [CodigoRecuperacion] Error:', error);
      await alertService.error(
        "Error de verificación",
        "No se pudo verificar el código. Por favor, intenta de nuevo o solicita un nuevo código.",
        { confirmButtonText: "Intentar de nuevo" }
      );
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Formulario de Código - Lado Izquierdo */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-md">
          <div className="bg-white rounded-lg shadow-lg p-8">
            {/* Botón Volver */}
            <div className="mb-4">
              <button
                onClick={() => handleNavigation("/forgotPassword")}
                className="flex items-center text-gray-600 hover:text-blue-600 transition-colors"
              >
                <BiLeftArrowAlt className="mr-2" />
                Volver
              </button>
            </div>

            {/* Título */}
            <h1 className="text-2xl font-bold text-blue-900 mb-8 text-center">
              Código de recuperación - Certimarcas
            </h1>

            <p className="text-center text-gray-600 mb-6">
              Introduce el código de 6 dígitos que recibiste en tu correo electrónico.
            </p>

            {/* Error Message */}
            {error && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{error}</p>
              </div>
            )}

            {/* Formulario */}
            <div className="space-y-6">
              {/* Campo Código */}
              <div>
                <div className="relative">
                  <BiKey className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    name="codigo"
                    placeholder="123456"
                    value={codigo}
                    onChange={e => { setCodigo(e.target.value); setError(""); }}
                    className={`w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent ${error ? 'border-red-500' : ''}`}
                  />
                </div>
              </div>

              {/* Botón de Verificación */}
              <button
                onClick={handleSubmit}
                disabled={!codigo.trim()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Verificar Código
              </button>

              {/* Enlace de Regreso */}
              <div className="text-center">
                  <p className="text-sm text-gray-600">
                    ¿No recibiste el código?{" "}
                    <button
                      onClick={() => handleNavigation("/forgotPassword")}
                      className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                    >
                      Solicitar uno nuevo
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

export default CodigoRecuperacion; 