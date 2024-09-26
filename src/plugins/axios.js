import axios from 'axios';
import Cookies from 'js-cookie';

// Función para obtener el token CSRF de las cookies
function getCookie(name) {
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
}

// Crear una instancia de Axios con configuración por defecto
const axiosInstance = axios.create({
  baseURL: 'http://localhost:8000/api/v1',
  withCredentials: true, // Asegura que las cookies se envíen con cada solicitud
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Añadir un interceptor para incluir el token CSRF en cada solicitud
axiosInstance.interceptors.request.use(config => {
  const csrfToken = getCookie('XSRF-TOKEN');
  if (csrfToken) {
    config.headers['X-XSRF-TOKEN'] = csrfToken;
  }

  // Incluye el token de autorización en cada solicitud
  const token = Cookies.get('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  // Incluye el company_id en cada solicitud si existe
  const company_id = Cookies.get('company_id');
  if (company_id) {
    config.headers['X-Company-ID'] = company_id;
  }

  return config;
}, error => {
  return Promise.reject(error);
});

// Añadir un interceptor para manejar errores globalmente si es necesario
axiosInstance.interceptors.response.use(response => response, error => {
  return Promise.reject(error);
});

export default axiosInstance;
