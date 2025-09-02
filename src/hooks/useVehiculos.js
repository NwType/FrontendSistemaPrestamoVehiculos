import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { vehiculoService } from '../services/vehiculoService';

export const useVehiculos = () => {
  const queryClient = useQueryClient();

  // Query para obtener todos los vehículos
  const {
    data: vehiculos = [],
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['vehiculos'],
    queryFn: vehiculoService.getAll,
    staleTime: 5 * 60 * 1000, // 5 minutos
  });

  // Mutation para crear vehículo
  const createVehiculo = useMutation({
    mutationFn: vehiculoService.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehiculos']);
    },
  });

  // Mutation para actualizar vehículo
  const updateVehiculo = useMutation({
    mutationFn: ({ id, data }) => vehiculoService.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['vehiculos']);
    },
  });

  // Mutation para eliminar vehículo
  const deleteVehiculo = useMutation({
    mutationFn: vehiculoService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['vehiculos']);
    },
  });

  return {
    vehiculos,
    isLoading,
    error,
    refetch,
    createVehiculo: createVehiculo.mutate,
    updateVehiculo: updateVehiculo.mutate,
    deleteVehiculo: deleteVehiculo.mutate,
    isCreating: createVehiculo.isPending,
    isUpdating: updateVehiculo.isPending,
    isDeleting: deleteVehiculo.isPending,
  };
}; 