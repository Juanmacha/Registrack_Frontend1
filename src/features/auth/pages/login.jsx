import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEnvelope, BiLock, BiShow, BiHide } from "react-icons/bi";
import authService from "../services/authService";
import authData from "../services/authData"; // <--- Importa authData

const Login = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleLogin = async () => {
    const result = authService.login(formData);

    if (result.success) {
      const user = authData.getUser();

      // Redirigir según el rol
      if (user?.role === "admin") {
        navigate("/admin/dashboard");
      } else {
        navigate("/");
      }
    } else {
      alert(result.message);
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Iniciar sesión - Certimarcas
      </h2>

      <div className="space-y-4">
        <div className="relative">
          <BiEnvelope className="absolute left-3 top-3 text-blue-700" />
          <input
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            className="w-full pl-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
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
