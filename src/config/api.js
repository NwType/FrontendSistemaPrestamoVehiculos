import axios from 'axios';
import { config } from './config';

// Crear instancia de axios con configuración base
const apiClient = axios.create({
  baseURL: config.api.baseURL,
  timeout: config.api.timeout,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para agregar el token JWT a todas las peticiones
apiClient.interceptors.request.use(
  (configAxios) => {
    const token = localStorage.getItem(config.auth.tokenKey);
    if (token) {
      configAxios.headers.Authorization = `Bearer ${token}`;
    }
    return configAxios;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar errores de respuesta
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expirado o inválido
      localStorage.removeItem(config.auth.tokenKey);
      localStorage.removeItem(config.auth.userKey);
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default apiClient; 