import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL = process.env.REACT_APP_API_URL; // Fallback a local

function RegisterForm() {
  const [formData, setFormData] = useState({
    country: "",
    email: "",
    firstName: "",
    lastName: "",
    username: "",
    password: "",
    terms: false,
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setIsSubmitting(true);

    if (!formData.terms) {
      setErrors((prev) => ({
        ...prev,
        terms: "Debes aceptar los términos del servicio.",
      }));
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch(`${API_URL}/users/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const data = await response.json();

        // Manejar errores específicos basados en la respuesta de la API
        if (data.detail) {
          if (data.detail.includes("Username already taken")) {
            setErrors((prev) => ({
              ...prev,
              username: "Este nombre de usuario ya está en uso.",
            }));
          } else if (data.detail.includes("Email already registered")) {
            setErrors((prev) => ({
              ...prev,
              email: "Este correo ya está registrado.",
            }));
          } else if (data.detail.includes("Password is too weak")) {
            setErrors((prev) => ({
              ...prev,
              password:
                "La contraseña es débil. Debe tener al menos 8 caracteres, incluyendo una letra mayúscula, un número y un carácter especial.",
            }));
          } else {
            setErrors((prev) => ({
              ...prev,
              general: "Ocurrió un error. Por favor, inténtalo de nuevo.",
            }));
          }
        }
        throw new Error(data.detail || "Error registering user.");
      }

      // Navegar a la página de confirmación de email
      navigate("/email-confirmation", { state: { email: formData.email } });
    } catch (error) {
      console.error("Error al registrar usuario:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/public/Indus-River-Delta.jpg')] flex flex-col items-center justify-center bg-gray-50">
      <div className="w-[400px] bg-white p-6 shadow-md rounded-lg">
        <img src="/logoApp.svg" alt="Logo" className="w-16 mx-auto mb-6" />
        <h1 className="text-2xl font-bold text-center text-black mb-4">
          Crear una cuenta
        </h1>

        {errors.general && (
          <div className="text-red-500 text-sm mb-4">{errors.general}</div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Country Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              País
            </label>
            <select
              name="country"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              value={formData.country}
              onChange={handleChange}
              required
            >
              <option value="">Selecciona tu país</option>
              <option value="Spain">España</option>
              <option value="USA">Estados Unidos</option>
            </select>
          </div>

          {/* Email Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Correo electrónico
            </label>
            <input
              type="email"
              name="email"
              placeholder="Correo electrónico"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              onChange={handleChange}
              required
            />
            {errors.email && (
              <div className="text-red-500 text-sm mt-1">{errors.email}</div>
            )}
          </div>

          {/* First Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Nombre
            </label>
            <input
              type="text"
              name="firstName"
              placeholder="Nombre"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              onChange={handleChange}
              required
            />
          </div>

          {/* Last Name Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Apellido
            </label>
            <input
              type="text"
              name="lastName"
              placeholder="Apellido"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              onChange={handleChange}
              required
            />
          </div>

          {/* Username Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Nombre de usuario
            </label>
            <input
              type="text"
              name="username"
              placeholder="Nombre de usuario"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              onChange={handleChange}
              required
            />
            {errors.username && (
              <div className="text-red-500 text-sm mt-1">{errors.username}</div>
            )}
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label className="block text-sm font-medium text-black mb-2">
              Contraseña
            </label>
            <input
              type="password"
              name="password"
              placeholder="Contraseña"
              className="w-full p-2 border border-gray-300 rounded-md bg-white text-black"
              onChange={handleChange}
              required
            />
            {errors.password && (
              <div className="text-red-500 text-sm mt-1">{errors.password}</div>
            )}
          </div>

          {/* Terms and Conditions */}
          <div className="mb-4 flex items-center">
            <input
              type="checkbox"
              name="terms"
              className="mr-2"
              onChange={(e) =>
                setFormData({ ...formData, terms: e.target.checked })
              }
            />
            <label className="text-sm text-black">
              He leído y acepto los{" "}
              <a href="#" className="text-blue-500 hover:underline">
                Términos del servicio
              </a>
            </label>
          </div>
          {errors.terms && (
            <div className="text-red-500 text-sm mt-1">{errors.terms}</div>
          )}

          <button
            type="submit"
            className={`w-full py-2 rounded-md text-white ${
              isSubmitting ? "bg-gray-400" : "bg-blue-500 hover:bg-blue-600"
            }`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "Registrando..." : "Continuar"}
          </button>
        </form>

        <a
          onClick={() => navigate("/")}
          className="text-center text-sm text-gray-500 mt-4 block hover:underline cursor-pointer"
        >
          ¿Ya tienes una cuenta? Iniciar sesión
        </a>
      </div>
    </div>
  );
}

export default RegisterForm;