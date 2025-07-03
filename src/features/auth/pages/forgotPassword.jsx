import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEnvelope } from "react-icons/bi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const allowedDomains = [
    'gmail.com', 'hotmail.com', 'outlook.com', 'yahoo.com', 'live.com',
    'icloud.com', 'msn.com', 'protonmail.com', 'aol.com'
  ];

  const validate = (value) => {
    if (!value.trim()) return "Por favor ingresa un correo electrónico.";
    const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
    if (!emailRegex.test(value)) return "Ingresa un correo válido.";
    const domain = value.split('@')[1]?.toLowerCase();
    if (!allowedDomains.includes(domain)) return "Solo se permiten correos de gmail, hotmail, outlook, yahoo, live, icloud, msn, protonmail o aol";
    return "";
  };

  const handleSubmit = () => {
    const err = validate(email);
    setError(err);
    if (err) return;
    // Verifica en localStorage
    const storedUsers = JSON.parse(localStorage.getItem("usuarios")) || [];
    const found = storedUsers.find((u) => u.email === email);
    if (found) {
      setError("");
      navigate("/codigoRecuperacion");
    } else {
      setError("Este correo no está registrado.");
    }
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Recuperar contraseña
      </h2>

      <>
        <div className="relative mb-4">
          <BiEnvelope className="absolute left-3 top-3 text-blue-700" />
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              setError("");
            }}
            className={`w-full pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-500' : 'border-blue-300'}`}
          />
        </div>

        {error && (
          <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
        )}

        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
          disabled={!!validate(email)}
        >
          Enviar instrucciones
        </button>
      </>

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

export default ForgotPassword;
