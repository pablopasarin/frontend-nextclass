import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
const API_URL = process.env.REACT_APP_API_URL; // Fallback a local

function PasswordRecovery() {
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // To manage loading state
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const token = searchParams.get("token"); // Get the token from the URL

  useEffect(() => {
    // Validate the token on component mount
    const validateToken = async () => {
      if (!token) {
        setError("Token no válido o faltante.");
        navigate("/"); // Redirect to home
        return;
      }

      try {
        const response = await fetch(`${API_URL}/auth/validate-token`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ token }),
        });

        if (!response.ok) {
          throw new Error("Token no válido o caducado.");
        }

        setLoading(false); // Token is valid, allow the page to load
      } catch (err) {
        setError(err.message);
        navigate("/"); // Redirect to home
      }
    };

    validateToken();
  }, [token, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      setError("Las contraseñas no coinciden.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/reset-password`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          token: token,
          new_password: newPassword,
        }),
      });

      if (!response.ok) {
        const data = await response.json();
        if (data.detail && data.detail.includes("weak")) {
          setError(
            "La contraseña es débil. Debe tener al menos 8 caracteres, una letra mayúscula, un número y un carácter especial."
          );
        } else {
          setError("No se pudo restablecer la contraseña. Inténtalo de nuevo.");
        }
        return;
      }

      const data = await response.json();
      setMessage("¡Contraseña restablecida con éxito!");
      setError("");

      // Redirect to login after 2 seconds
      setTimeout(() => {
        navigate("/");
      }, 2000);
    } catch (err) {
      setError("Hubo un error inesperado. Por favor, inténtalo de nuevo.");
      setMessage("");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p>Cargando...</p>
      </div>
    );
  }

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
              Nueva Contraseña
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              placeholder="Introduce tu nueva contraseña"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Confirmar Contraseña
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              placeholder="Confirma tu nueva contraseña"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
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

export default PasswordRecovery;