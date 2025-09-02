import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/authorization';

const AlquilerList = () => {
  const { user } = useAuth();
  const [alquileres, setAlquileres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showPagoModal, setShowPagoModal] = useState(false);
  const [selectedAlquiler, setSelectedAlquiler] = useState(null);
  const [showDevolucionModal, setShowDevolucionModal] = useState(false);

  const canManageAlquileres = hasPermission(user?.rol, 'canManageAlquileres');
  const canProcessPayments = hasPermission(user?.rol, 'canProcessPayments');

  useEffect(() => {
    loadAlquileres();
  }, []);

  const loadAlquileres = async () => {
    try {
      setLoading(true);
      // Simular carga de alquileres
      const mockAlquileres = [
        {
          uid: 'a1',
          vehiculo: { marca: 'Toyota', modelo: 'Corolla', placa: 'ABC-123' },
          cliente: { nombre: 'Juan Pérez', correo: 'juan@email.com' },
          fechaInicio: '2024-01-15',
          fechaFin: '2024-01-20',
          totalPrecio: 250.00,
          estado: 'Activo',
          pagos: [
            { uid: 'p1', monto: 100.00, fecha: '2024-01-15', estado: 'Completado' },
            { uid: 'p2', monto: 150.00, fecha: '2024-01-20', estado: 'Pendiente' }
          ]
        },
        {
          uid: 'a2',
          vehiculo: { marca: 'Honda', modelo: 'Civic', placa: 'XYZ-789' },
          cliente: { nombre: 'María García', correo: 'maria@email.com' },
          fechaInicio: '2024-01-18',
          fechaFin: '2024-01-25',
          totalPrecio: 350.00,
          estado: 'Activo',
          pagos: [
            { uid: 'p3', monto: 350.00, fecha: '2024-01-18', estado: 'Completado' }
          ]
        }
      ];
      
      setAlquileres(mockAlquileres);
    } catch (error) {
      setError('Error al cargar los alquileres: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handlePago = (alquiler) => {
    setSelectedAlquiler(alquiler);
    setShowPagoModal(true);
  };

  const handleDevolucion = (alquiler) => {
    setSelectedAlquiler(alquiler);
    setShowDevolucionModal(true);
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case 'Activo': return 'badge-success';
      case 'Completado': return 'badge-info';
      case 'Retrasado': return 'badge-warning';
      case 'Cancelado': return 'badge-danger';
      default: return 'badge-secondary';
    }
  };

  const getPagoEstadoColor = (estado) => {
    switch (estado) {
      case 'Completado': return 'badge-success';
      case 'Pendiente': return 'badge-warning';
      case 'Fallido': return 'badge-danger';
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

  const calcularSaldoPendiente = (alquiler) => {
    const totalPagado = alquiler.pagos
      .filter(p => p.estado === 'Completado')
      .reduce((sum, p) => sum + p.monto, 0);
    return alquiler.totalPrecio - totalPagado;
  };

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div>Cargando alquileres...</div>
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

  if (!canManageAlquileres) {
    return (
      <div className="container py-8">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold text-danger mb-4">
              Acceso Denegado
            </h2>
            <p className="text-secondary">
              No tienes permisos para gestionar alquileres.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-primary">Gestión de Alquileres</h1>
          <p className="text-secondary mt-2">
            Control de alquileres activos, pagos y devoluciones
          </p>
        </div>
        
        <button className="btn btn-primary">
          Nuevo Alquiler
        </button>
      </div>

      {/* Estadísticas rápidas */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-icon">🔑</div>
          <div className="stat-value">{alquileres.length}</div>
          <div className="stat-label">Total Alquileres</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">✅</div>
          <div className="stat-value">
            {alquileres.filter(a => a.estado === 'Activo').length}
          </div>
          <div className="stat-label">Activos</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">💰</div>
          <div className="stat-value">
            ${alquileres.reduce((total, a) => total + a.totalPrecio, 0).toFixed(2)}
          </div>
          <div className="stat-label">Total Generado</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⏰</div>
          <div className="stat-value">
            {alquileres.filter(a => {
              const fechaFin = new Date(a.fechaFin);
              const hoy = new Date();
              return fechaFin < hoy && a.estado === 'Activo';
            }).length}
          </div>
          <div className="stat-label">Retrasados</div>
        </div>
      </div>

      {/* Lista de alquileres */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-primary">Alquileres Activos</h3>
        </div>
        <div className="card-body">
          {alquileres.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔑</div>
              <h3 className="text-xl font-medium text-secondary mb-2">
                No hay alquileres activos
              </h3>
              <p className="text-muted">
                Los alquileres aparecerán aquí cuando se confirmen las reservas
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {alquileres.map((alquiler) => (
                <div key={alquiler.uid} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <h4 className="font-medium text-primary mb-2">Vehículo</h4>
                          <p className="text-secondary">
                            {alquiler.vehiculo.marca} {alquiler.vehiculo.modelo}
                          </p>
                          <p className="text-sm text-muted">
                            Placa: {alquiler.vehiculo.placa}
                          </p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-primary mb-2">Cliente</h4>
                          <p className="text-secondary">{alquiler.cliente.nombre}</p>
                          <p className="text-sm text-muted">{alquiler.cliente.correo}</p>
                        </div>
                        
                        <div>
                          <h4 className="font-medium text-primary mb-2">Período</h4>
                          <p className="text-secondary">
                            {formatDate(alquiler.fechaInicio)} - {formatDate(alquiler.fechaFin)}
                          </p>
                          <p className="text-sm text-muted">
                            Total: ${alquiler.totalPrecio.toFixed(2)}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <span className={`badge ${getEstadoColor(alquiler.estado)} mb-2`}>
                        {alquiler.estado}
                      </span>
                      <div className="text-sm text-secondary">
                        Saldo: ${calcularSaldoPendiente(alquiler).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Estado de pagos */}
                  <div className="mb-4">
                    <h5 className="font-medium text-primary mb-2">Estado de Pagos</h5>
                    <div className="flex flex-wrap gap-2">
                      {alquiler.pagos.map((pago) => (
                        <span key={pago.uid} className={`badge ${getPagoEstadoColor(pago.estado)}`}>
                          ${pago.monto.toFixed(2)} - {pago.estado}
                        </span>
                      ))}
                    </div>
                  </div>

                  {/* Acciones */}
                  <div className="flex justify-end space-x-2">
                    <button className="btn btn-info btn-sm">
                      Ver Detalles
                    </button>
                    
                    {canProcessPayments && calcularSaldoPendiente(alquiler) > 0 && (
                      <button 
                        onClick={() => handlePago(alquiler)}
                        className="btn btn-success btn-sm"
                      >
                        Procesar Pago
                      </button>
                    )}
                    
                    {alquiler.estado === 'Activo' && (
                      <button 
                        onClick={() => handleDevolucion(alquiler)}
                        className="btn btn-warning btn-sm"
                      >
                        Devolución
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Modal de Pago */}
      {showPagoModal && selectedAlquiler && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="text-lg font-medium text-primary">
                Procesar Pago - {selectedAlquiler.vehiculo.marca} {selectedAlquiler.vehiculo.modelo}
              </h3>
              <button onClick={() => setShowPagoModal(false)} className="text-secondary hover:text-primary">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <p className="text-secondary mb-2">
                  Cliente: <strong>{selectedAlquiler.cliente.nombre}</strong>
                </p>
                <p className="text-secondary mb-2">
                  Saldo pendiente: <strong className="text-primary">${calcularSaldoPendiente(selectedAlquiler).toFixed(2)}</strong>
                </p>
              </div>
              
              <form>
                <div className="form-group">
                  <label className="form-label">Monto a pagar</label>
                  <input
                    type="number"
                    className="form-input"
                    defaultValue={calcularSaldoPendiente(selectedAlquiler)}
                    min="0"
                    max={calcularSaldoPendiente(selectedAlquiler)}
                    step="0.01"
                  />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Método de pago</label>
                  <select className="form-input">
                    <option value="efectivo">Efectivo</option>
                    <option value="tarjeta">Tarjeta de Crédito/Débito</option>
                    <option value="transferencia">Transferencia Bancaria</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Observaciones</label>
                  <textarea className="form-input" rows="3" placeholder="Observaciones del pago..."></textarea>
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowPagoModal(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button className="btn btn-success">
                Confirmar Pago
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal de Devolución */}
      {showDevolucionModal && selectedAlquiler && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-header">
              <h3 className="text-lg font-medium text-primary">
                Devolución de Vehículo
              </h3>
              <button onClick={() => setShowDevolucionModal(false)} className="text-secondary hover:text-primary">
                ✕
              </button>
            </div>
            <div className="modal-body">
              <div className="mb-4">
                <p className="text-secondary mb-2">
                  Vehículo: <strong>{selectedAlquiler.vehiculo.marca} {selectedAlquiler.vehiculo.modelo}</strong>
                </p>
                <p className="text-secondary mb-2">
                  Cliente: <strong>{selectedAlquiler.cliente.nombre}</strong>
                </p>
              </div>
              
              <form>
                <div className="form-group">
                  <label className="form-label">Estado del vehículo</label>
                  <select className="form-input">
                    <option value="excelente">Excelente</option>
                    <option value="bueno">Bueno</option>
                    <option value="regular">Regular</option>
                    <option value="malo">Malo</option>
                  </select>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Kilometraje final</label>
                  <input type="number" className="form-input" placeholder="Km al devolver" />
                </div>
                
                <div className="form-group">
                  <label className="form-label">Observaciones</label>
                  <textarea className="form-input" rows="3" placeholder="Estado del vehículo, daños, etc..."></textarea>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Cargos adicionales</label>
                  <input type="number" className="form-input" placeholder="0.00" step="0.01" />
                </div>
              </form>
            </div>
            <div className="modal-footer">
              <button onClick={() => setShowDevolucionModal(false)} className="btn btn-secondary">
                Cancelar
              </button>
              <button className="btn btn-warning">
                Confirmar Devolución
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AlquilerList; 