import apiClient from '../config/api';

export const vehiculoService = {
  // Obtener todos los vehículos
  async getAll() {
    try {
      const response = await apiClient.get('/vehiculo');
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener los vehículos');
    }
  },

  // Obtener vehículo por ID
  async getById(id) {
    try {
      const response = await apiClient.get(`/vehiculo/${id}`);
      return response.data;
    } catch (error) {
      throw new Error('Error al obtener el vehículo');
    }
  },

  // Crear nuevo vehículo
  async create(vehiculoData) {
    try {
      const response = await apiClient.post('/vehiculo', vehiculoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al crear el vehículo');
    }
  },

  // Actualizar vehículo existente
  async update(id, vehiculoData) {
    try {
      const response = await apiClient.put(`/vehiculo/${id}`, vehiculoData);
      return response.data;
    } catch (error) {
      throw new Error(error.response?.data?.message || 'Error al actualizar el vehículo');
    }
  },

  // Eliminar vehículo
  async delete(id) {
    try {
      await apiClient.delete(`/vehiculo/${id}`);
      return true;
    } catch (error) {
      throw new Error('Error al eliminar el vehículo');
    }
  },

  // Buscar vehículos por criterios
  async search(criteria) {
    try {
      const response = await apiClient.get('/vehiculo', { params: criteria });
      return response.data;
    } catch (error) {
      throw new Error('Error al buscar vehículos');
    }
  }
}; 