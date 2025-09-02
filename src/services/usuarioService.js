import apiClient from '../config/api';

export const usuarioService = {
  // Obtener todos los usuarios
  async getAll() {
    try {
      const response = await apiClient.get('/usuario');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los usuarios');
    }
  },

  // Obtener usuario por ID
  async getById(id) {
    try {
      const response = await apiClient.get(`/usuario/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener el usuario');
    }
  },

  // Crear nuevo usuario
  async create(usuarioData) {
    try {
      const response = await apiClient.post('/usuario', usuarioData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear el usuario');
    }
  },

  // Actualizar usuario existente
  async update(id, usuarioData) {
    try {
      const response = await apiClient.put(`/usuario/${id}`, usuarioData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el usuario');
    }
  },

  // Eliminar usuario
  async delete(id) {
    try {
      await apiClient.delete(`/usuario/${id}`);
      return true;
    } catch (error) {
      throw new Error('Error al eliminar el usuario');
    }
  }
}; 