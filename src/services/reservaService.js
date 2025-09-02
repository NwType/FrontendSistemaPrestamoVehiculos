import apiClient from '../config/api';

export const reservaService = {
  // Obtener todas las reservas
  async getAll() {
    try {
      const response = await apiClient.get('/reserva');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener las reservas');
    }
  },

  // Obtener reserva por ID
  async getById(id) {
    try {
      const response = await apiClient.get(`/reserva/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener la reserva');
    }
  },

  // Crear nueva reserva
  async create(reservaData) {
    try {
      const response = await apiClient.post('/reserva', reservaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear la reserva');
    }
  },

  // Actualizar reserva existente
  async update(id, reservaData) {
    try {
      const response = await apiClient.put(`/reserva/${id}`, reservaData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar la reserva');
    }
  },

  // Eliminar reserva
  async delete(id) {
    try {
      await apiClient.delete(`/reserva/${id}`);
      return true;
    } catch (error) {
      throw new Error('Error al eliminar la reserva');
    }
  },

  // Obtener reservas por usuario
  async getByUsuario(usuarioId) {
    try {
      const response = await apiClient.get(`/reserva/usuario/${usuarioId}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener las reservas del usuario');
    }
  }
}; 