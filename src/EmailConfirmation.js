import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL; // Fallback a local


function EmailConfirmation() {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email || ""; // Access email from navigation state

  const [code, setCode] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  if (!email) {
    // Redirect back to the register page if email is missing
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <div className="w-[400px] bg-white p-6 shadow-lg rounded-lg">
          <h1 className="text-2xl font-bold text-center text-black mb-4">
            Acceso denegado
          </h1>
          <p className="text-center text-sm text-gray-600">
            Por favor, regístrate de nuevo para confirmar tu correo.
          </p>
          <button
            onClick={() => navigate("/register")}
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition mt-4"
          >
  Continuar
          </button>
        </div>
      </div>
    );
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
        const response = await fetch(`${API_URL}/users/confirm-email`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ email, confirmation_code: code }),
        });

        if (!response.ok) {
            throw new Error("Código de confirmación incorrecto.");
        }

        setMessage("¡Correo confirmado!");
        navigate("/"); // Redirección al dashboard
    } catch (err) {
        setError(err.message);
    }
};

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-[400px] bg-white p-6 shadow-lg rounded-lg">
      <img src="/logoApp.svg" alt="Logo" className="w-16 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-center text-black mb-4">
          Verifica tu correo electrónico
        </h1>
        {message && <div className="text-green-500 text-sm mb-4">{message}</div>}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Código de verificación
            </label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              placeholder="Ingresa el código de 6 dígitos"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Continuar
          </button>
        </form>
      </div>
    </div>
  );
}

export default EmailConfirmation;