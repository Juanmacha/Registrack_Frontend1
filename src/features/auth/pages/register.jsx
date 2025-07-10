import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiUser, BiIdCard, BiEnvelope, BiLock, BiUserCheck } from "react-icons/bi";
import { UserService, initializeMockData } from "../../../utils/mockDataService.js";
import alertService from "../../../utils/alertService.js";

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
      alertService.validationError("Por favor, completa todos los campos requeridos.");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      alertService.validationError("Las contraseñas no coinciden.");
      return;
    }

    if (formData.password.length < 6) {
      alertService.validationError("La contraseña debe tener al menos 6 caracteres.");
      return;
    }

    try {
      // Mostrar alerta de carga
      const loadingAlert = alertService.loading("Registrando usuario...");
      
      initializeMockData();
      
      // Validar que el email no exista
      const existingUser = UserService.getByEmail(formData.email);
      if (existingUser) {
        alertService.close();
        alertService.registerError("El email ya está registrado. Por favor, usa otro email.");
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
      
      // Cerrar alerta de carga
      alertService.close();
      
      if (createdUser) {
        await alertService.registerSuccess();
        navigate("/login");
      } else {
        alertService.registerError();
      }
    } catch (error) {
      console.error("Error en registro:", error);
      alertService.close();
      alertService.registerError();
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Registro - Certimarcas
      </h2>

      <div className="space-y-4">
        <div className="relative">
          <BiUser className="absolute left-3 top-3 text-blue-700" />
          <input
            name="firstName"
            placeholder="Primer nombre"
            onChange={handleChange}
            className="w-full pl-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.firstName && <p className="text-xs text-red-600 mt-1">{errors.firstName}</p>}
        </div>

        <div className="relative">
          <BiUser className="absolute left-3 top-3 text-blue-700" />
          <input
            name="lastName"
            placeholder="Primer apellido"
            onChange={handleChange}
            className="w-full pl-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.lastName && <p className="text-xs text-red-600 mt-1">{errors.lastName}</p>}
        </div>

        <div className="relative">
          <BiIdCard className="absolute left-3 top-3 text-blue-700" />
          <select
            name="documentType"
            onChange={handleChange}
            className="w-full pl-10 py-2 border border-blue-300 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="">Tipo de documento</option>
            <option value="CC">Cédula</option>
            <option value="TI">Tarjeta de identidad</option>
          </select>
          {errors.documentType && <p className="text-xs text-red-600 mt-1">{errors.documentType}</p>}
        </div>

        <div className="relative">
          <BiIdCard className="absolute left-3 top-3 text-blue-700" />
          <input
            name="documentNumber"
            placeholder="Número de documento"
            onChange={handleChange}
            className="w-full pl-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.documentNumber && <p className="text-xs text-red-600 mt-1">{errors.documentNumber}</p>}
        </div>

        <div className="relative">
          <BiEnvelope className="absolute left-3 top-3 text-blue-700" />
          <input
            name="email"
            placeholder="Correo electrónico"
            onChange={handleChange}
            className="w-full pl-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.email && <p className="text-xs text-red-600 mt-1">{errors.email}</p>}
        </div>

        <div className="relative">
          <BiLock className="absolute left-3 top-3 text-blue-700" />
          <input
            type="password"
            name="password"
            placeholder="Contraseña"
            onChange={handleChange}
            className="w-full pl-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.password && <p className="text-xs text-red-600 mt-1">{errors.password}</p>}
        </div>

        <div className="relative">
          <BiLock className="absolute left-3 top-3 text-blue-700" />
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirmar contraseña"
            onChange={handleChange}
            className="w-full pl-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          {errors.confirmPassword && <p className="text-xs text-red-600 mt-1">{errors.confirmPassword}</p>}
        </div>

        <button
          onClick={handleRegister}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
          disabled={!isFormValid()}
        >
          Registrarse
        </button>

        <p className="text-center text-sm text-gray-600 mt-4">
          ¿Ya tienes cuenta?{' '}
          <span
            onClick={() => navigate('/login')}
            className="text-blue-600 hover:underline cursor-pointer"
          >
            Inicia sesión
          </span>
        </p>
      </div>
    </div>
  );
};

export default Register;