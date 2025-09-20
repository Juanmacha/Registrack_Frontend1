import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiUser, BiIdCard, BiEnvelope, BiLock, BiUserCheck, BiShow, BiHide, BiLeftArrowAlt } from "react-icons/bi";
import { UserService, initializeMockData } from "../../../utils/mockDataService.js";

const Register = () => {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    documentType: "",
    documentNumber: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const validate = (field, value) => {
    let e = { ...errors };
    switch (field) {
      case "firstName":
        e.firstName = value ? "" : "El nombre es requerido.";
        break;
      case "lastName":
        e.lastName = value ? "" : "El apellido es requerido.";
        break;
      case "documentType":
        e.documentType = value ? "" : "Selecciona el tipo de documento.";
        break;
      case "documentNumber":
        e.documentNumber = value ? "" : "El número de documento es requerido.";
        break;
      case "email":
        e.email = value ? (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? "" : "Correo inválido.") : "El correo es requerido.";
        break;
      case "password":
        e.password = value ? (value.length >= 6 ? "" : "Mínimo 6 caracteres.") : "La contraseña es requerida.";
        break;
      case "confirmPassword":
        e.confirmPassword = value ? (value === formData.password ? "" : "Las contraseñas no coinciden.") : "Confirma la contraseña.";
        break;
      default:
        break;
    }
    setErrors(e);
  };

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    validate(e.target.name, e.target.value);
  };

  const isFormValid = () => {
    return (
      formData.firstName &&
      formData.lastName &&
      formData.documentType &&
      formData.documentNumber &&
      formData.email &&
      formData.password &&
      formData.confirmPassword &&
      Object.values(errors).every((err) => !err)
    );
  };

  const handleRegister = async () => {
    // Validar campos requeridos
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.documentType || !formData.documentNumber) {
      setErrors({ general: "Por favor, completa todos los campos requeridos." });
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors({ general: "Las contraseñas no coinciden." });
      return;
    }

    if (formData.password.length < 6) {
      setErrors({ general: "La contraseña debe tener al menos 6 caracteres." });
      return;
    }

    try {
      initializeMockData();

      // Validar que el email no exista
      const existingUser = UserService.getByEmail(formData.email);
      if (existingUser) {
        setErrors({ general: "El email ya está registrado. Por favor, usa otro email." });
        return;
      }

      // Crear nuevo usuario
      const newUser = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        documentType: formData.documentType,
        documentNumber: formData.documentNumber,
        email: formData.email,
        password: formData.password,
        role: "Cliente", // Por defecto, los nuevos usuarios son clientes
        estado: "activo"
      };

      const createdUser = UserService.create(newUser);

      if (createdUser) {
        navigate("/login");
      } else {
        setErrors({ general: "Error al crear la cuenta. Por favor, intenta de nuevo." });
      }
    } catch (error) {
      console.error("Error en registro:", error);
      setErrors({ general: "Error al crear la cuenta. Por favor, intenta de nuevo." });
    }
  };

  return (
    <div className="min-h-screen bg-white flex">
      {/* Formulario de Registro - Lado Izquierdo */}
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="w-full max-w-2xl">
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
              Registro - Certimarcas
            </h1>

            {/* Error Message */}
            {errors.general && (
              <div className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-red-600 text-sm text-center">{errors.general}</p>
              </div>
            )}

            {/* Formulario */}
            <div className="space-y-6">
              {/* Primera fila: Nombre y Apellido */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campo Nombre */}
                <div>
                  <div className="relative">
                    <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      name="firstName"
                      placeholder="Nombre"
                      value={formData.firstName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {errors.firstName && (
                    <p className="text-red-500 text-xs mt-1">{errors.firstName}</p>
                  )}
                </div>

                {/* Campo Apellido */}
                <div>
                  <div className="relative">
                    <BiUser className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      name="lastName"
                      placeholder="Apellido"
                      value={formData.lastName}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {errors.lastName && (
                    <p className="text-red-500 text-xs mt-1">{errors.lastName}</p>
                  )}
                </div>
              </div>

              {/* Segunda fila: Email */}
              <div>
                <div className="relative">
                  <BiEnvelope className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                  <input
                    name="email"
                    type="email"
                    placeholder="tu@email.com"
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                {errors.email && (
                  <p className="text-red-500 text-xs mt-1">{errors.email}</p>
                )}
              </div>

              {/* Tercera fila: Tipo de Documento y Número */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Tipo de Documento */}
                <div>
                  <div className="relative">
                    <BiIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <select
                      name="documentType"
                      onChange={handleChange}
                      value={formData.documentType}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none"
                    >
                      <option value="">Tipo de documento</option>
                      <option value="CC">Cédula de ciudadanía</option>
                      <option value="TI">Tarjeta de identidad</option>
                      <option value="CE">Cédula de extranjería</option>
                      <option value="PA">Pasaporte</option>
                      <option value="PEP">Permiso Especial</option>
                      <option value="NIT">NIT</option>
                    </select>
                  </div>
                  {errors.documentType && (
                    <p className="text-red-500 text-xs mt-1">{errors.documentType}</p>
                  )}
                </div>

                {/* Número de Documento */}
                <div>
                  <div className="relative">
                    <BiIdCard className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      name="documentNumber"
                      placeholder="Número de documento"
                      value={formData.documentNumber}
                      onChange={handleChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                  </div>
                  {errors.documentNumber && (
                    <p className="text-red-500 text-xs mt-1">{errors.documentNumber}</p>
                  )}
                </div>
              </div>

              {/* Cuarta fila: Contraseña y Confirmar Contraseña */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Campo Contraseña */}
                <div>
                  <div className="relative">
                    <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type={showPassword ? "text" : "password"}
                      name="password"
                      placeholder="Contraseña"
                      value={formData.password}
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
                  {errors.password && (
                    <p className="text-red-500 text-xs mt-1">{errors.password}</p>
                  )}
                </div>

                {/* Confirmar Contraseña */}
                <div>
                  <div className="relative">
                    <BiLock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 text-lg" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      name="confirmPassword"
                      placeholder="Confirmar contraseña"
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    />
                    <button
                      type="button"
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? <BiHide className="text-lg" /> : <BiShow className="text-lg" />}
                    </button>
                  </div>
                  {errors.confirmPassword && (
                    <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>
                  )}
                </div>
              </div>

              {/* Checkbox de Política de Privacidad */}
              <div className="flex items-start">
                <input
                  type="checkbox"
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 mt-1"
                  required
                />
                <label className="ml-2 text-sm text-gray-600">
                  Estoy de acuerdo con la{" "}
                  <button className="text-blue-500 hover:text-blue-700 transition-colors">
                    política de privacidad
                  </button>
                </label>
              </div>

              {/* Botón de Registro */}
              <button
                onClick={handleRegister}
                disabled={!isFormValid()}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Crear Cuenta
              </button>

              {/* Enlace a Login */}
              <div className="text-center">
                <p className="text-sm text-gray-600">
                  ¿Ya tienes una cuenta?{" "}
                  <button
                    onClick={() => navigate('/login')}
                    className="text-blue-500 hover:text-blue-700 font-medium transition-colors"
                  >
                    Iniciar Sesión
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

export default Register;