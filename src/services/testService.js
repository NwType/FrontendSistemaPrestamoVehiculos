import apiClient from '../config/api';

export const testService = {
  // Probar conexión básica
  async testConnection() {
    try {
      const response = await apiClient.get('/vehiculo');
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        details: error.response?.data,
        status: error.response?.status
      };
    }
  },

  // Probar endpoint de autenticación
  async testAuth() {
    try {
      const response = await apiClient.post('/auth/login', {
        correo: 'test@test.com',
        contrasena: 'test123'
      });
      return { success: true, data: response.data };
    } catch (error) {
      return { 
        success: false, 
        error: error.message,
        details: error.response?.data,
        status: error.response?.status
      };
    }
  }
}; 