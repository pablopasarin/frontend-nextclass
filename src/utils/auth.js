import { jwtDecode } from "jwt-decode";
export const getToken = () => {
  const token = localStorage.getItem("access_token");
  return token;
};


export const getUserDetailsFromToken = () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null; // Devuelve `null` si no hay token

  try {
    const decoded = jwtDecode(token);
    return {
      user_id: decoded.user_id || null,
      username: decoded.username || "Usuario",
      is_teacher: decoded.is_teacher || false,
    };
  } catch (error) {
    console.error("Error decoding token:", error);
    return null;
  }
};