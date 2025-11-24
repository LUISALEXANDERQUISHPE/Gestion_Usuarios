import axios from "axios";
import { getCookie, deleteCookie } from "cookies-next";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  headers: {
    "ngrok-skip-browser-warning": "true",
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

// Interceptor para requests
api.interceptors.request.use((config) => {
  // No agregar Authorization para login
  if (config.url === "/auth/login") {
    return config;
  }

  // Obtener token de la cookie usando cookies-next
  const token = getCookie("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

// Interceptor para responses
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 || error.response?.status === 403) {
      console.log("Token inválido o expirado", error);
      
      // Limpiar cookies usando cookies-next
      deleteCookie("token");
      deleteCookie("role");
      deleteCookie("user");
      
      if (typeof window !== 'undefined') {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

export default api;
