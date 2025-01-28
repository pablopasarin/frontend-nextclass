import React from "react";
import { Navigate } from "react-router-dom";
import { getToken } from "./utils/auth";

export const ProtectedRoute = ({ children }) => {
  if (!getToken()) {
    console.error("Access denied. Redirecting to login...");
    return <Navigate to="/" replace />; // Redirige si no hay usuario
  }

  return children; // Renderiza el contenido si el usuario está autenticado
};