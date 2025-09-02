import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/authorization';
import { reservaService } from '../services/reservaService';
import ReservaForm from './ReservaForm';

const ReservaList = () => {
  const { user } = useAuth();
  const [reservas, setReservas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [selectedVehiculo, setSelectedVehiculo] = useState(null);
  const [vehiculosDisponibles, setVehiculosDisponibles] = useState([]);

  const canViewAllReservations = hasPermission(user?.rol, 'canViewAllReservations');
  const canViewOwnReservations = hasPermission(user?.rol, 'canViewOwnReservations');
  const canCreateReservations = hasPermission(user?.rol, 'canCreateReservations');

  useEffect(() => {
    loadReservas();
    loadVehiculosDisponibles();
  }, []);

  const loadReservas = async () => {
    try {
      setLoading(true);
      let response;
      
      if (canViewAllReservations) {
        response = await reservaService.getAll();
      } else if (canViewOwnReservations) {
        response = await reservaService.getByUsuario(user.id);
      } else {
        setError('No tienes permisos para ver reservas');
        return;
      }
      
      setReservas(response || []);
    } catch (error) {
      setError('Error al cargar las reservas: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const loadVehiculosDisponibles = async () => {
    try {
      // Simular carga de vehículos disponibles
      setVehiculosDisponibles([
        { uid: 'v1', marca: 'Toyota', modelo: 'Corolla', precioDia: 50, estado: 'Disponible' },
        { uid: 'v2', marca: 'Honda', modelo: 'Civic', precioDia: 55, estado: 'Disponible' },
        { uid: 'v3', marca: 'Ford', modelo: 'Focus', precioDia: 45, estado: 'Disponible' }
      ]);
    } catch (error) {
      console.error('Error al cargar vehículos:', error);
    }
  };

  const handleCreateReserva = (vehiculo) => {
    setSelectedVehiculo(vehiculo);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setSelectedVehiculo(null);
  };

  const handleFormSuccess = () => {
    loadReservas();
    setShowForm(false);
    setSelectedVehiculo(null);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Pendiente': return 'badge-warning';
      case 'Confirmada': return 'badge-success';
      case 'Cancelada': return 'badge-danger';
      case 'Completada': return 'badge-info';
      default: return 'badge-secondary';
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div>Cargando reservas...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-message">
        {error}
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Reservas</h1>
          <p className="text-secondary mt-2">
            {canViewAllReservations 
              ? 'Gestión de todas las reservas del sistema'
              : 'Tus reservas activas y pasadas'
            }
          </p>
        </div>
        
        {canCreateReservations && (
          <div className="flex space-x-3">
            <select 
              className="form-input"
              onChange={(e) => {
                const vehiculo = vehiculosDisponibles.find(v => v.uid === e.target.value);
                if (vehiculo) handleCreateReserva(vehiculo);
              }}
              defaultValue=""
            >
              <option value="">Seleccionar vehículo para reservar</option>
              {vehiculosDisponibles.map(vehiculo => (
                <option key={vehiculo.uid} value={vehiculo.uid}>
                  {vehiculo.marca} {vehiculo.modelo} - ${vehiculo.precioDia}/día
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* Estadísticas rápidas */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-icon">📅</div>
          <div className="stat-value">{reservas.length}</div>
          <div className="stat-label">Total Reservas</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏳</div>
          <div className="stat-value">
            {reservas.filter(r => r.estado === 'Pendiente').length}
          </div>
          <div className="stat-label">Pendientes</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">
            {reservas.filter(r => r.estado === 'Confirmada').length}
          </div>
          <div className="stat-label">Confirmadas</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">
            ${reservas.reduce((total, r) => total + (r.totalPrecio || 0), 0).toFixed(2)}
          </div>
          <div className="stat-label">Total Generado</div>
        </div>
      </div>

      {/* Lista de reservas */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-primary">
            {canViewAllReservations ? 'Todas las Reservas' : 'Mis Reservas'}
          </h3>
        </div>
        <div className="card-body">
          {reservas.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">📅</div>
              <h3 className="text-xl font-medium text-secondary mb-2">
                No hay reservas
              </h3>
              <p className="text-muted">
                {canCreateReservations 
                  ? 'Crea tu primera reserva seleccionando un vehículo disponible'
                  : 'No tienes reservas activas en este momento'
                }
              </p>
            </div>
          ) : (
            <div className="table-container">
              <table className="table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>Vehículo</th>
                    <th>Fechas</th>
                    <th>Total</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  {reservas.map((reserva) => (
                    <tr key={reserva.uid}>
                      <td>
                        <div>
                          <div className="font-medium text-primary">
                            {reserva.usuario?.nombre || 'Cliente'}
                          </div>
                          <div className="text-sm text-secondary">
                            {reserva.usuario?.correo || 'Sin correo'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div>
                          <div className="font-medium text-primary">
                            {reserva.vehiculos?.[0]?.marca} {reserva.vehiculos?.[0]?.modelo}
                          </div>
                          <div className="text-sm text-secondary">
                            Placa: {reserva.vehiculos?.[0]?.placa || 'N/A'}
                          </div>
                        </div>
                      </td>
                      <td>
                        <div className="text-sm">
                          <div><strong>Inicio:</strong> {formatDate(reserva.fechaInicio || reserva.fechaReserva)}</div>
                          <div><strong>Fin:</strong> {formatDate(reserva.fechaFin || reserva.fechaReserva)}</div>
                        </div>
                      </td>
                      <td>
                        <div className="font-medium text-primary">
                          ${reserva.totalPrecio?.toFixed(2) || '0.00'}
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${getEstadoColor(reserva.estado)}`}>
                          {reserva.estado || 'Pendiente'}
                        </span>
                      </td>
                      <td>
                        <div className="flex space-x-2">
                          <button className="btn btn-info btn-sm">
                            Ver Detalles
                          </button>
                          {reserva.estado === 'Pendiente' && (
                            <>
                              <button className="btn btn-success btn-sm">
                                Confirmar
                              </button>
                              <button className="btn btn-danger btn-sm">
                                Cancelar
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Formulario de reserva */}
      {showForm && selectedVehiculo && (
        <ReservaForm
          vehiculo={selectedVehiculo}
          onClose={handleFormClose}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default ReservaList; 