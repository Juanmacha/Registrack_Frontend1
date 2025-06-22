import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiEnvelope } from "react-icons/bi";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = () => {
  if (!email.trim()) {
    setError("Por favor ingresa un correo electrónico.");
    return;
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    setError("Ingresa un correo válido.");
    return;
  }

  // Verifica en localStorage
  const storedUsers = JSON.parse(localStorage.getItem("usuarios")) || [];
  const found = storedUsers.find((u) => u.email === email);

  if (found) {
    setError("");
    setSubmitted(true);
    // Simulamos un pequeño tiempo antes de redirigir
    setTimeout(() => navigate("/resetPassword"), 1500);
  } else {
    setError("Este correo no está registrado.");
  }
};


  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Recuperar contraseña
      </h2>

      {submitted ? (
        <p className="text-green-600 text-center">
          Si el correo existe en nuestro sistema, te hemos enviado instrucciones para recuperar tu contraseña.
        </p>
      ) : (
        <>
          <div className="relative mb-4">
            <BiEnvelope className="absolute left-3 top-3 text-blue-700" />
            <input
              type="email"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 border border-blue-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm mb-2 text-center">{error}</p>
          )}

          <button
            onClick={handleSubmit}
            className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
          >
            Enviar instrucciones
          </button>
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

export default ForgotPassword;
