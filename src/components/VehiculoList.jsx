import React, { useState } from 'react';
import { useVehiculos } from '../hooks/useVehiculos';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/authorization';
import VehiculoForm from './VehiculoForm';
import { imageService } from '../services/imageService';

const VehiculoList = () => {
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [editingVehiculo, setEditingVehiculo] = useState(null);
  const { user } = useAuth();
  
  const {
    vehiculos,
    isLoading,
    error,
    deleteVehiculo,
    isDeleting
  } = useVehiculos();

  const handleDelete = async (id) => {
    try {
      await deleteVehiculo(id);
      setShowDeleteConfirm(null);
    } catch (error) {
      console.error('Error al eliminar:', error);
    }
  };

  const handleEdit = (vehiculo) => {
    console.log('Editando vehículo:', vehiculo);
    console.log('ID del vehículo:', vehiculo?.idVehiculo);
    setEditingVehiculo(vehiculo);
    setShowForm(true);
  };

  const handleCreate = () => {
    console.log('Creando nuevo vehículo');
    setEditingVehiculo(null);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingVehiculo(null);
  };

  const handleFormSuccess = () => {
    // El hook useVehiculos se actualizará automáticamente
    setShowForm(false);
    setEditingVehiculo(null);
  };

  const getVehicleImage = (vehiculo) => {
    // Si el vehículo tiene foto en el backend, usarla
    if (vehiculo.fotoPrincipal && imageService.isValidImageUrl(vehiculo.fotoPrincipal)) {
      return vehiculo.fotoPrincipal;
    }
    
    // Si no, usar imagen placeholder
    return imageService.getVehicleImage(vehiculo.marca, vehiculo.modelo);
  };

  // Verificar permisos del usuario
  const canManageVehicles = hasPermission(user?.rol, 'canManageVehicles');
  const canCreateReservations = hasPermission(user?.rol, 'canCreateReservations');

  if (isLoading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div>Cargando vehículos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        Error: {error.message}
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Vehículos</h1>
          <p className="text-secondary mt-2">
            {user?.rol === 'Cliente' 
              ? 'Vehículos disponibles para reservar'
              : 'Gestión completa de vehículos del sistema'
            }
          </p>
        </div>
        
        {canManageVehicles && (
          <button 
            onClick={handleCreate}
            className="btn btn-primary"
          >
            Agregar Vehículo
          </button>
        )}
        
        {canCreateReservations && !canManageVehicles && (
          <button className="btn btn-success">
            Crear Reserva
          </button>
        )}
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Foto</th>
              <th>Marca</th>
              <th>Modelo</th>
              <th>Año</th>
              <th>Placa</th>
              <th>Precio/Día</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {vehiculos.map((vehiculo) => (
              <tr key={vehiculo.uid}>
                <td>
                  <div className="vehicle-image-container">
                    <img
                      src={getVehicleImage(vehiculo)}
                      alt={`${vehiculo.marca} ${vehiculo.modelo}`}
                      className="vehicle-image"
                      onError={(e) => {
                        e.target.src = imageService.getVehicleImage(vehiculo.marca, vehiculo.modelo);
                      }}
                    />
                  </div>
                </td>
                <td className="font-medium text-primary">
                  {vehiculo.marca}
                </td>
                <td className="text-secondary">
                  {vehiculo.modelo}
                </td>
                <td className="text-secondary">
                  {vehiculo.anio}
                </td>
                <td className="text-secondary">
                  {vehiculo.placa}
                </td>
                <td className="text-secondary">
                  ${vehiculo.precioDia}
                </td>
                <td>
                  <span className={`badge ${
                    vehiculo.estado === 'Disponible' 
                      ? 'badge-success' 
                      : vehiculo.estado === 'En Mantenimiento'
                      ? 'badge-warning'
                      : 'badge-danger'
                  }`}>
                    {vehiculo.estado}
                  </span>
                </td>
                <td>
                  {/* Acciones para administradores */}
                  {canManageVehicles && (
                    <>
                      <button 
                        onClick={() => handleEdit(vehiculo)}
                        className="btn btn-secondary btn-sm mr-3"
                      >
                        Editar
                      </button>
                      <button 
                        onClick={() => setShowDeleteConfirm(vehiculo.uid)}
                        className="btn btn-danger btn-sm"
                        disabled={isDeleting}
                      >
                        {isDeleting ? 'Eliminando...' : 'Eliminar'}
                      </button>
                    </>
                  )}
                  
                  {/* Acciones para clientes y empleados */}
                  {!canManageVehicles && vehiculo.estado === 'Disponible' && (
                    <>
                      <button className="btn btn-primary btn-sm mr-3">
                        Reservar
                      </button>
                      <button className="btn btn-info btn-sm">
                        Ver Detalles
                      </button>
                    </>
                  )}
                  
                  {/* Acciones para empleados */}
                  {hasPermission(user?.rol, 'canManageMaintenance') && (
                    <button className="btn btn-warning btn-sm ml-3">
                      Mantenimiento
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Información de permisos */}
      {!canManageVehicles && (
        <div className="card mt-6">
          <div className="card-header">
            <h3 className="text-lg font-medium text-primary">
              Información de Permisos
            </h3>
          </div>
          <div className="card-body">
            <p className="text-secondary">
              Como <strong>{user?.rol}</strong>, puedes:
            </p>
            <ul className="text-sm text-secondary mt-2 space-y-1">
              {canCreateReservations && (
                <li>✅ Crear reservas para vehículos disponibles</li>
              )}
              <li>✅ Ver información detallada de los vehículos</li>
              <li>✅ Ver el estado y disponibilidad en tiempo real</li>
              {!canCreateReservations && (
                <li>❌ No puedes modificar la información de los vehículos</li>
              )}
            </ul>
          </div>
        </div>
      )}

      {/* Modal de confirmación de eliminación */}
      {showDeleteConfirm && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="text-lg font-medium text-primary">
                Confirmar Eliminación
              </h3>
            </div>
            <div className="modal-body">
              <p className="text-secondary">
                ¿Estás seguro de que quieres eliminar este vehículo? Esta acción no se puede deshacer.
              </p>
            </div>
            <div className="modal-footer">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn btn-secondary"
              >
                Cancelar
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm)}
                className="btn btn-danger"
                disabled={isDeleting}
              >
                {isDeleting ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Formulario de crear/editar vehículo */}
      {showForm && (
        <VehiculoForm
          vehiculo={editingVehiculo}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default VehiculoList;
