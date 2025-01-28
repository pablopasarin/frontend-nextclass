import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Importamos Link y useNavigate


const API_URL = process.env.REACT_APP_API_URL;

function LoginMenu() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate(); // Hook para navegación programática

  const handleSubmit = async (e) => {
    e.preventDefault();
    //console.log("Logging in with:", { email, password });

    try {
      const response = await fetch(`${API_URL}/auth/token`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email: email,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Usuario o contraseña incorrectos");
      }

      const data = await response.json();
      //("Login successful:", data);

      // Guardar el token en localStorage
      localStorage.setItem("access_token", data.access_token);

      // Redirigir al usuario al dashboard
      navigate("/dashboard");
    } catch (error) {
      console.error("Error during login:", error);
      setError("Usuario o contraseña incorrectos");
    }
  };

  return (
    <div className="min-h-screen bg-[url('/public/Indus-River-Delta.jpg')] flex flex-col items-center justify-center bg-gray-50">
      <div className="w-[400px] bg-white p-6 shadow-lg rounded-lg">
        <img src="/logoApp.svg" alt="Logo" className="w-16 mx-auto mb-6" />

        <h1 className="text-2xl font-bold text-center text-black mb-4">Iniciar sesión</h1>

        {error && <div className="text-red-500 text-sm mb-4">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              placeholder="Correo electrónico"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Contraseña
            </label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              placeholder="Contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Enlace a la recuperación de contraseña */}
          <Link
            to="/forgot-password" // Redirige al formulario de recuperación
            className="text-sm text-blue-500 hover:underline mb-4 block"
          >
            ¿Has olvidado la contraseña?
          </Link>

          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600 transition"
          >
            Iniciar sesión
          </button>
        </form>

        {/* Enlace para registro */}
        <Link
          to="/register"
          className="text-center text-sm text-gray-500 mt-4 block hover:underline"
        >
          Crear una cuenta
        </Link>
      </div>
    </div>
  );
}

export default LoginMenu;