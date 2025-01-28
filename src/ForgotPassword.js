import React, { useState } from "react";

const API_URL = process.env.REACT_APP_API_URL; // Fallback a local

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(`${API_URL}/users/password-recovery`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || "No se pudo enviar el correo de recuperación.");
      }

      setMessage("Correo de recuperación enviado.");
      setError("");
    } catch (err) {
      setError(err.message);
      setMessage("");
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="w-[400px] bg-white p-6 shadow-lg rounded-lg">
        {/* Logo */}
        <img src="/logoApp.svg" alt="Logo" className="w-16 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-center text-black mb-4">
          Restablecer tu contraseña
        </h1>

        {message && <div className="text-green-500 text-sm mb-4">{message}</div>}
        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
Dirección de correo electrónico
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              placeholder="Introduce tu correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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

export default ForgotPassword;