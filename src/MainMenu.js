import TypingAnimation from "./utils/animations"; // Ajusta la ruta según tu proyecto
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  // Mensajes para la animación
  const messages = ["biología}", "matemáticas}", "física}", "inglés}"];

  const handleLogin = () => {
    navigate("/login"); // Navega a la ruta "/"
  };

  const handleSignUp = () => {
    navigate("/register"); // Navega a la ruta "/"
  };


  return (
<div
  className="h-screen bg-gray-100 bg-[url('/public/Indus-River-Delta.jpg')] bg-no-repeat bg-cover bg-center"
>      {/* Navbar */}
      <nav className="bg-white shadow-md">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center">
            <img src="/logoApp.png" alt="Logo" className="h-8 mr-2" />
            <span className="text-xl font-bold text-gray-800">nextClass_</span>
          </div>

          {/* Hamburger Menu */}
          <button
            className="md:hidden text-gray-800 focus:outline-none"
            onClick={() => setIsOpen(!isOpen)}
          >
            <span className="material-icons">menu</span>
          </button>

          {/* Links */}
          <div
            className={`${
              isOpen ? "block" : "hidden"
            } md:flex items-center space-x-6`}
          >
            <a
              href="#features"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Features & Benefits
            </a>


            <a
              href="#help"
              className="text-gray-600 hover:text-gray-800 transition-colors"
            >
              Help
            </a>
          </div>

          {/* Botones */}
          <div className="hidden md:flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-800 border rounded-md px-4 py-2"
                    onClick={handleLogin}
            >
              Log In
            </button>
            <button className="bg-green-500 text-white rounded-md px-4 py-2 hover:bg-green-600"
              onClick={handleSignUp}
            >
              Sign Up
            </button>
          </div>
        </div>
      </nav>

      {/* Animación más cerca de la parte superior */}
       <div className="relative bg-gray-100 flex justify-center">
        <div className="absolute top-24">
          <TypingAnimation staticText="\nextClass_{" messages={messages} />
        </div>
      </div>
    </div>
  );
};

export default Navbar;