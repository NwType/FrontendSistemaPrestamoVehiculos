import apiClient from '../config/api';

export const authService = {
  // Login del usuario
  async login(credentials) {
    try {
      const response = await apiClient.post('/auth/login', credentials);
      
      if (response.data.token) {
        // Guardar token y datos del usuario según la estructura del backend
        localStorage.setItem('token', response.data.token);
        
        // Crear objeto de usuario con la estructura que espera el frontend
        const user = {
          id: response.data.uid,
          nombre: response.data.nombre,
          correo: response.data.correo,
          rol: response.data.rol
        };
        
        localStorage.setItem('user', JSON.stringify(user));
      }
      
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error en el login');
    }
  },

  // Logout del usuario
  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/login';
  },

  // Verificar si el usuario está autenticado
  isAuthenticated() {
    return !!localStorage.getItem('token');
  },

  // Obtener el usuario actual
  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  },

  // Obtener el token actual
  getToken() {
    return localStorage.getItem('token');
  }
}; 