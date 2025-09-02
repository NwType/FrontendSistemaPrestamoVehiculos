// Configuración centralizada de la aplicación
export const config = {
  // Configuración de la API
  api: {
    baseURL: import.meta.env.VITE_API_BASE_URL || 'https://localhost:7057/api',
    timeout: 10000, // 10 segundos
  },
  
  // Configuración de la aplicación
  app: {
    name: 'Sistema de Gestión de Autos',
    version: '1.0.0',
    environment: import.meta.env.MODE || 'development',
  },
  
  // Configuración de autenticación
  auth: {
    tokenKey: 'token',
    userKey: 'user',
    refreshTokenKey: 'refreshToken',
  },
  
  // Configuración de paginación
  pagination: {
    defaultPageSize: 10,
    pageSizeOptions: [5, 10, 20, 50],
  },
  
  // Configuración de notificaciones
  notifications: {
    autoHideDuration: 5000, // 5 segundos
    maxSnack: 3,
  },
  
  // Configuración de validación
  validation: {
    password: {
      minLength: 8,
      requireUppercase: true,
      requireLowercase: true,
      requireNumbers: true,
      requireSpecialChars: true,
    },
    email: {
      pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
  },
};

// Función para obtener la configuración según el entorno
export const getConfig = (key) => {
  const keys = key.split('.');
  let value = config;
  
  for (const k of keys) {
    if (value && typeof value === 'object' && k in value) {
      value = value[k];
    } else {
      return undefined;
    }
  }
  
  return value;
};

// Función para verificar si estamos en desarrollo
export const isDevelopment = () => config.app.environment === 'development';

// Función para verificar si estamos en producción
export const isProduction = () => config.app.environment === 'production'; 