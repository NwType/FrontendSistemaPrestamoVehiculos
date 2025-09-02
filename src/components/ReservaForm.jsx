import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/authorization';
import { reservaService } from '../services/reservaService';

const ReservaForm = ({ vehiculo, onClose, onSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fechaInicio: '',
    fechaFin: '',
    serviciosAdicionales: [],
    observaciones: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [serviciosDisponibles, setServiciosDisponibles] = useState([]);

  const canCreateReservations = hasPermission(user?.rol, 'canCreateReservations');

  useEffect(() => {
    // Cargar servicios adicionales disponibles
    setServiciosDisponibles([
      { uid: 'seg1', nombre: 'Seguro Completo', precio: 25.00 },
      { uid: 'seg2', nombre: 'Seguro Básico', precio: 15.00 },
      { uid: 'gps', nombre: 'GPS', precio: 10.00 },
      { uid: 'silla', nombre: 'Silla para Niño', precio: 8.00 },
      { uid: 'porta', nombre: 'Porta Equipaje', precio: 12.00 }
    ]);

    // Establecer fechas por defecto
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setFormData(prev => ({
      ...prev,
      fechaInicio: tomorrow.toISOString().split('T')[0],
      fechaFin: tomorrow.toISOString().split('T')[0]
    }));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleServicioChange = (servicioUid, checked) => {
    setFormData(prev => ({
      ...prev,
      serviciosAdicionales: checked
        ? [...prev.serviciosAdicionales, servicioUid]
        : prev.serviciosAdicionales.filter(id => id !== servicioUid)
    }));
  };

  const validateForm = () => {
    if (!formData.fechaInicio) {
      setError('La fecha de inicio es obligatoria');
      return false;
    }
    if (!formData.fechaFin) {
      setError('La fecha de fin es obligatoria');
      return false;
    }
    
    const fechaInicio = new Date(formData.fechaInicio);
    const fechaFin = new Date(formData.fechaFin);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (fechaInicio < today) {
      setError('La fecha de inicio no puede ser anterior a hoy');
      return false;
    }
    if (fechaFin < fechaInicio) {
      setError('La fecha de fin debe ser posterior a la fecha de inicio');
      return false;
    }
    
    return true;
  };

  const calcularPrecioTotal = () => {
    if (!vehiculo) return 0;
    
    const fechaInicio = new Date(formData.fechaInicio);
    const fechaFin = new Date(formData.fechaFin);
    const dias = Math.ceil((fechaFin - fechaInicio) / (1000 * 60 * 60 * 24)) + 1;
    
    const precioVehiculo = dias * vehiculo.precioDia;
    const precioServicios = formData.serviciosAdicionales.reduce((total, servicioId) => {
      const servicio = serviciosDisponibles.find(s => s.uid === servicioId);
      return total + (servicio ? servicio.precio * dias : 0);
    }, 0);
    
    return precioVehiculo + precioServicios;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    setLoading(true);
    
    try {
      const reservaData = {
        fechaReserva: new Date().toISOString(),
        fechaInicio: formData.fechaInicio,
        fechaFin: formData.fechaFin,
        totalPrecio: calcularPrecioTotal(),
        usuarioUid: user.id,
        vehiculoUid: vehiculo.uid,
        serviciosAdicionales: formData.serviciosAdicionales,
        observaciones: formData.observaciones,
        estado: 'Pendiente'
      };
      
      await reservaService.create(reservaData);
      onSuccess();
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (!canCreateReservations) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3 className="text-lg font-medium text-danger">
              Acceso Denegado
            </h3>
          </div>
          <div className="modal-body">
            <p className="text-secondary">
              No tienes permisos para crear reservas.
            </p>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!vehiculo) {
    return (
      <div className="modal-overlay">
        <div className="modal">
          <div className="modal-header">
            <h3 className="text-lg font-medium text-danger">
              Error
            </h3>
          </div>
          <div className="modal-body">
            <p className="text-secondary">
              No se ha seleccionado ningún vehículo.
            </p>
          </div>
          <div className="modal-footer">
            <button onClick={onClose} className="btn btn-secondary">
              Cerrar
            </button>
          </div>
        </div>
      </div>
    );
  }

  const precioTotal = calcularPrecioTotal();

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '700px' }}>
        <div className="modal-header">
          <h3 className="text-lg font-medium text-primary">
            Crear Reserva - {vehiculo.marca} {vehiculo.modelo}
          </h3>
          <button onClick={onClose} className="text-secondary hover:text-primary">
            ✕
          </button>
        </div>
        
        <div className="modal-body">
          {error && (
            <div className="error-message mb-4">
              {error}
            </div>
          )}
          
          {/* Información del vehículo */}
          <div className="card mb-4">
            <div className="card-header">
              <h4 className="font-medium text-primary">Información del Vehículo</h4>
            </div>
            <div className="card-body">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <strong>Marca:</strong> {vehiculo.marca}
                </div>
                <div>
                  <strong>Modelo:</strong> {vehiculo.modelo}
                </div>
                <div>
                  <strong>Año:</strong> {vehiculo.anio}
                </div>
                <div>
                  <strong>Precio por día:</strong> ${vehiculo.precioDia}
                </div>
                <div>
                  <strong>Capacidad:</strong> {vehiculo.capacidad} pasajeros
                </div>
                <div>
                  <strong>Estado:</strong> {vehiculo.estado}
                </div>
              </div>
            </div>
          </div>
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className="form-group">
                <label htmlFor="fechaInicio" className="form-label">
                  Fecha de Inicio *
                </label>
                <input
                  id="fechaInicio"
                  name="fechaInicio"
                  type="date"
                  required
                  className="form-input"
                  value={formData.fechaInicio}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className="form-group">
                <label htmlFor="fechaFin" className="form-label">
                  Fecha de Fin *
                </label>
                <input
                  id="fechaFin"
                  name="fechaFin"
                  type="date"
                  required
                  className="form-input"
                  value={formData.fechaFin}
                  onChange={handleChange}
                  min={formData.fechaInicio}
                />
              </div>
            </div>

            {/* Servicios adicionales */}
            <div className="form-group mb-4">
              <label className="form-label">Servicios Adicionales</label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                {serviciosDisponibles.map(servicio => (
                  <label key={servicio.uid} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      checked={formData.serviciosAdicionales.includes(servicio.uid)}
                      onChange={(e) => handleServicioChange(servicio.uid, e.target.checked)}
                      className="form-checkbox"
                    />
                    <span className="text-sm">
                      {servicio.nombre} (+${servicio.precio}/día)
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="form-group mb-4">
              <label htmlFor="observaciones" className="form-label">
                Observaciones
              </label>
              <textarea
                id="observaciones"
                name="observaciones"
                rows="3"
                className="form-input"
                placeholder="Observaciones adicionales..."
                value={formData.observaciones}
                onChange={handleChange}
              />
            </div>

            {/* Resumen de precios */}
            <div className="card mb-4">
              <div className="card-header">
                <h4 className="font-medium text-primary">Resumen de Precios</h4>
              </div>
              <div className="card-body">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Precio del vehículo:</span>
                    <span>${vehiculo.precioDia} × {formData.fechaInicio && formData.fechaFin ? 
                      Math.ceil((new Date(formData.fechaFin) - new Date(formData.fechaInicio)) / (1000 * 60 * 60 * 24)) + 1 : 0} días
                    </span>
                  </div>
                  {formData.serviciosAdicionales.length > 0 && (
                    <div className="flex justify-between">
                      <span>Servicios adicionales:</span>
                      <span>${formData.serviciosAdicionales.reduce((total, servicioId) => {
                        const servicio = serviciosDisponibles.find(s => s.uid === servicioId);
                        return total + (servicio ? servicio.precio : 0);
                      }, 0)} × {formData.fechaInicio && formData.fechaFin ? 
                        Math.ceil((new Date(formData.fechaFin) - new Date(formData.fechaInicio)) / (1000 * 60 * 60 * 24)) + 1 : 0} días
                      </span>
                    </div>
                  )}
                  <hr />
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total:</span>
                    <span className="text-primary">${precioTotal.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="form-group">
              <button
                type="submit"
                disabled={loading}
                className="btn btn-primary w-full"
              >
                {loading ? 'Creando Reserva...' : 'Crear Reserva'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ReservaForm; 