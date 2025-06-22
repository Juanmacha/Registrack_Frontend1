import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiKey, BiLock, BiHide, BiShow } from "react-icons/bi";

const ResetPassword = () => {
  const [formData, setFormData] = useState({
    code: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleReset = () => {
    const { code, newPassword, confirmPassword } = formData;

    if (!code || !newPassword || !confirmPassword) {
      setError("Todos los campos son obligatorios.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    // Simulación de éxito
    setError("");
    setSuccess(true);

    // Aquí se llamaría al backend:
    // authService.resetPassword({ code, newPassword });
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Restablecer contraseña
      </h2>

      {success ? (
        <p className="text-green-600 text-center mb-4">
          Tu contraseña ha sido restablecida correctamente.
        </p>
      ) : (
        <>
          <div className="space-y-4">
            <div className="relative">
              <BiKey className="absolute left-3 top-3 text-blue-700" />
              <input
                name="code"
                placeholder="Código de recuperación"
                onChange={handleChange}
                className="w-full pl-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            <div className="relative">
              <BiLock className="absolute left-3 top-3 text-blue-700" />
              <input
                type={showPassword ? "text" : "password"}
                name="newPassword"
                placeholder="Nueva contraseña"
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
              <span
                className="absolute right-3 top-3 text-blue-700 cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <BiHide /> : <BiShow />}
              </span>
            </div>

            <div className="relative">
              <BiLock className="absolute left-3 top-3 text-blue-700" />
              <input
                type={showPassword ? "text" : "password"}
                name="confirmPassword"
                placeholder="Confirmar contraseña"
                onChange={handleChange}
                className="w-full pl-10 pr-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              />
            </div>

            {error && <p className="text-red-500 text-sm text-center">{error}</p>}

            <button
              onClick={handleReset}
              className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
            >
              Restablecer contraseña
            </button>
          </div>
        </>
      )}

      <div className="text-center mt-4">
        <button
          onClick={() => navigate("/login")}
          className="text-sm text-blue-600 hover:underline"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};

export default ResetPassword;
