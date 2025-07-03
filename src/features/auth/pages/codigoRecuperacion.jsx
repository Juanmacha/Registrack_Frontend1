import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { BiKey } from "react-icons/bi";

const CodigoRecuperacion = () => {
  const [codigo, setCodigo] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const CODIGO_VALIDO = "123456";

  const handleSubmit = () => {
    if (!codigo.trim()) {
      setError("Por favor ingresa el código de recuperación.");
      return;
    }
    if (codigo !== CODIGO_VALIDO) {
      setError("El código ingresado no es válido.");
      return;
    }
    setError("");
    navigate("/resetPassword");
  };

  return (
    <div className="bg-white p-8 rounded-xl shadow-md w-full">
      <h2 className="text-2xl font-bold text-blue-900 text-center mb-6">
        Ingresar código de recuperación
      </h2>
      <p className="text-center text-gray-600 mb-4">Introduce el código que recibiste en tu correo electrónico.</p>
      <div className="space-y-4">
        <div className="relative">
          <BiKey className="absolute left-3 top-3 text-blue-700" />
          <input
            name="codigo"
            placeholder="Código de recuperación"
            value={codigo}
            onChange={e => { setCodigo(e.target.value); setError(""); }}
            className={`w-full pl-10 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-400 ${error ? 'border-red-500' : 'border-blue-300'}`}
          />
        </div>
        {error && <p className="text-red-500 text-sm text-center">{error}</p>}
        <button
          onClick={handleSubmit}
          className="w-full bg-blue-600 text-white py-2 rounded-md font-semibold shadow-md hover:bg-blue-700 transition-all duration-300"
        >
          Verificar código
        </button>
        <button
          onClick={() => navigate("/login")}
          className="w-full mt-2 bg-gray-200 text-blue-700 py-2 rounded-md hover:bg-blue-100 border border-blue-300 font-semibold transition-colors duration-300"
        >
          Volver al inicio de sesión
        </button>
      </div>
    </div>
  );
};

export default CodigoRecuperacion; 