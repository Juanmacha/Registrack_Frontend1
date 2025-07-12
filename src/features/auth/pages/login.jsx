import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEnvelope, BiLock, BiShow, BiHide } from "react-icons/bi";
import authService from "../services/authService.js";
import alertService from "../../../utils/alertService.js";

const validateEmail = (email) => {
  // Expresión regular básica para validar email
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const navigate = useNavigate();

  const validate = (field, value) => {
    let e = { ...fieldErrors };
    if (field === "email") {
      e.email = value ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Correo inválido.") : "El correo es requerido.";
    }
    if (field === "password") {
      e.password = value ? "" : "La contraseña es requerida.";
    }
    setFieldErrors(e);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    validate(e.target.name, e.target.value);
    setError("");
  };

  const isFormValid = () => {
    return (
      formData.email &&
      formData.password &&
      Object.values(fieldErrors).every((err) => !err)
    );
  };

  const handleLogin = async () => {
    // Validaciones antes de enviar
    if (!formData.email || !formData.password) {
      setError("Todos los campos son obligatorios.");
      return;
    }
    if (!validateEmail(formData.email)) {
      setError("El correo electrónico no es válido.");
      return;
    }
    try {
      // Mostrar alerta de carga
      const loadingAlert = alertService.loading("Iniciando sesión...");
      // Autenticar usuario usando authService
      const result = authService.login(formData);
      // Cerrar alerta de carga
      alertService.close();
      if (result.success) {
        // Mostrar alerta de éxito
        await alertService.loginSuccess(`${result.user.name}`);
        // Redirigir según el rol
        if (result.user.role === "Administrador") {
          navigate("/admin/dashboard");
        } else if (result.user.role === "Empleado") {
          navigate("/admin/dashboard");
        } else {
          navigate("/");
        }
      } else {
        setError("Credenciales incorrectas. Intenta de nuevo.");
        alertService.loginError();
      }
    } catch (error) {
      setError("Error al iniciar sesión. Por favor, intenta de nuevo.");
      alertService.close();
      alertService.error("Error", "Error al iniciar sesión. Por favor, intenta de nuevo.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Iniciar sesión - Certimarcas
      </h2>
      {error && (
        <div className="mb-4 text-red-600 text-center font-semibold bg-red-100 rounded p-2">
          {error}
        </div>
      )}
      <div className="space-y-4">
        <div className="relative">
          <BiEnvelope className="absolute left-3 top-3 text-blue-700" />
          <input
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            className="w-full pl-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {fieldErrors.email && <p className="text-xs text-red-600 mt-1">{fieldErrors.email}</p>}
        </div>
        <div className="relative">
          <BiLock className="absolute left-3 top-3 text-blue-700" />
          <input
            type={showPassword ? "text" : "password"}
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="w-full pl-10 pr-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {fieldErrors.password && <p className="text-xs text-red-600 mt-1">{fieldErrors.password}</p>}
          <span
            className="absolute right-3 top-3 text-blue-700 cursor-pointer"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <BiHide /> : <BiShow />}
          </span>
        </div>
        <div className="text-right">
          <button
            onClick={() => navigate("/forgotPassword")}
            className="text-sm text-blue-600 hover:underline"
          >
            ¿Olvidaste tu contraseña?
          </button>
        </div>
        <button
          onClick={handleLogin}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
          disabled={!isFormValid()}
        >
          Ingresar
        </button>
        <p className="text-center text-sm text-gray-600 mt-4">
          ¿No tienes una cuenta?{" "}
          <span
            onClick={() => navigate("/register")}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Regístrate
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
