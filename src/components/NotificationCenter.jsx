import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/authorization';

const NotificationCenter = () => {
  const { user } = useAuth();
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);

  const canViewNotifications = hasPermission(user?.rol, 'canViewNotifications');
  const canManageSystem = hasPermission(user?.rol, 'canManageSystem');

  useEffect(() => {
    if (canViewNotifications) {
      loadNotifications();
      // Simular notificaciones en tiempo real
      const interval = setInterval(() => {
        checkNewNotifications();
      }, 30000); // Verificar cada 30 segundos

      return () => clearInterval(interval);
    }
  }, [canViewNotifications]);

  const loadNotifications = async () => {
    try {
      setLoading(true);
      // Simular carga de notificaciones
      const mockNotifications = [
        {
          uid: 'n1',
          titulo: 'Reserva Confirmada',
          mensaje: 'Tu reserva para Toyota Corolla ha sido confirmada para el 15 de enero.',
          tipo: 'success',
          fecha: new Date(Date.now() - 1000 * 60 * 30), // 30 minutos atrás
          leida: false,
          usuarioUid: user.id,
          prioridad: 'normal'
        },
        {
          uid: 'n2',
          titulo: 'Recordatorio de Devolución',
          mensaje: 'Recuerda devolver el Honda Civic el 20 de enero.',
          tipo: 'warning',
          fecha: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 horas atrás
          leida: true,
          usuarioUid: user.id,
          prioridad: 'alta'
        },
        {
          uid: 'n3',
          titulo: 'Pago Procesado',
          mensaje: 'Tu pago de $150.00 ha sido procesado exitosamente.',
          tipo: 'info',
          fecha: new Date(Date.now() - 1000 * 60 * 60 * 24), // 1 día atrás
          leida: true,
          usuarioUid: user.id,
          prioridad: 'normal'
        }
      ];
      
      setNotifications(mockNotifications);
      setUnreadCount(mockNotifications.filter(n => !n.leida).length);
    } catch (error) {
      setError('Error al cargar las notificaciones: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const checkNewNotifications = () => {
    // Simular verificación de nuevas notificaciones
    const hasNewNotifications = Math.random() > 0.7; // 30% de probabilidad
    
    if (hasNewNotifications) {
      const newNotification = {
        uid: `n${Date.now()}`,
        titulo: 'Nueva Notificación',
        mensaje: 'Tienes una nueva notificación del sistema.',
        tipo: 'info',
        fecha: new Date(),
        leida: false,
        usuarioUid: user.id,
        prioridad: 'normal'
      };
      
      setNotifications(prev => [newNotification, ...prev]);
      setUnreadCount(prev => prev + 1);
      
      // Mostrar notificación toast
      showToast(newNotification);
    }
  };

  const showToast = (notification) => {
    // Crear elemento toast
    const toast = document.createElement('div');
    toast.className = `toast toast-${notification.tipo}`;
    toast.innerHTML = `
      <div class="toast-header">
        <strong>${notification.titulo}</strong>
        <button class="toast-close" onclick="this.parentElement.parentElement.remove()">×</button>
      </div>
      <div class="toast-body">${notification.mensaje}</div>
    `;
    
    // Agregar al DOM
    document.body.appendChild(toast);
    
    // Remover después de 5 segundos
    setTimeout(() => {
      if (toast.parentElement) {
        toast.remove();
      }
    }, 5000);
  };

  const markAsRead = async (notificationId) => {
    try {
      // Simular actualización en backend
      setNotifications(prev => 
        prev.map(n => 
          n.uid === notificationId ? { ...n, leida: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error al marcar como leída:', error);
    }
  };

  const markAllAsRead = async () => {
    try {
      // Simular actualización en backend
      setNotifications(prev => 
        prev.map(n => ({ ...n, leida: true }))
      );
      setUnreadCount(0);
    } catch (error) {
      console.error('Error al marcar todas como leídas:', error);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      // Simular eliminación en backend
      setNotifications(prev => prev.filter(n => n.uid !== notificationId));
      setUnreadCount(prev => {
        const notification = notifications.find(n => n.uid === notificationId);
        return notification && !notification.leida ? Math.max(0, prev - 1) : prev;
      });
    } catch (error) {
      console.error('Error al eliminar notificación:', error);
    }
  };

  const getNotificationIcon = (tipo) => {
    switch (tipo) {
      case 'success': return '✅';
      case 'warning': return '⚠️';
      case 'error': return '❌';
      case 'info': return 'ℹ️';
      default: return '🔔';
    }
  };

  const getPriorityColor = (prioridad) => {
    switch (prioridad) {
      case 'alta': return 'border-l-red-500';
      case 'media': return 'border-l-yellow-500';
      case 'normal': return 'border-l-blue-500';
      default: return 'border-l-gray-500';
    }
  };

  const formatTimeAgo = (date) => {
    const now = new Date();
    const diff = now - date;
    const minutes = Math.floor(diff / (1000 * 60));
    const hours = Math.floor(diff / (1000 * 60 * 60));
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (minutes < 1) return 'Ahora mismo';
    if (minutes < 60) return `Hace ${minutes} minuto${minutes > 1 ? 's' : ''}`;
    if (hours < 24) return `Hace ${hours} hora${hours > 1 ? 's' : ''}`;
    return `Hace ${days} día${days > 1 ? 's' : ''}`;
  };

  if (!canViewNotifications) {
    return (
      <div className="container py-8">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold text-danger mb-4">
              Acceso Denegado
            </h2>
            <p className="text-secondary">
              No tienes permisos para ver notificaciones.
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div>Cargando notificaciones...</div>
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
          <h1 className="text-3xl font-bold text-primary">Centro de Notificaciones</h1>
          <p className="text-secondary mt-2">
            Mantente informado sobre tus reservas, pagos y actualizaciones del sistema
          </p>
        </div>
        
        <div className="flex space-x-3">
          {unreadCount > 0 && (
            <button 
              onClick={markAllAsRead}
              className="btn btn-secondary"
            >
              Marcar todas como leídas
            </button>
          )}
          
          {canManageSystem && (
            <button 
              onClick={() => setShowCreateModal(true)}
              className="btn btn-primary"
            >
              Crear Notificación
            </button>
          )}
        </div>
      </div>

      {/* Estadísticas */}
      <div className="stats-grid mb-6">
        <div className="stat-card">
          <div className="stat-icon">🔔</div>
          <div className="stat-value">{notifications.length}</div>
          <div className="stat-label">Total Notificaciones</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📖</div>
          <div className="stat-value">{notifications.filter(n => n.leida).length}</div>
          <div className="stat-label">Leídas</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📝</div>
          <div className="stat-value">{unreadCount}</div>
          <div className="stat-label">No Leídas</div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">⚠️</div>
          <div className="stat-value">
            {notifications.filter(n => n.prioridad === 'alta').length}
          </div>
          <div className="stat-label">Alta Prioridad</div>
        </div>
      </div>

      {/* Lista de notificaciones */}
      <div className="card">
        <div className="card-header">
          <h3 className="text-lg font-medium text-primary">
            Notificaciones {unreadCount > 0 && `(${unreadCount} no leídas)`}
          </h3>
        </div>
        <div className="card-body">
          {notifications.length === 0 ? (
            <div className="text-center py-8">
              <div className="text-6xl mb-4">🔔</div>
              <h3 className="text-xl font-medium text-secondary mb-2">
                No hay notificaciones
              </h3>
              <p className="text-muted">
                Te notificaremos cuando tengas actualizaciones importantes
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notification) => (
                <div 
                  key={notification.uid} 
                  className={`notification-item ${!notification.leida ? 'unread' : ''} ${getPriorityColor(notification.prioridad)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="text-2xl">
                      {getNotificationIcon(notification.tipo)}
                    </div>
                    
                    <div className="flex-1">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className={`font-medium ${!notification.leida ? 'text-primary' : 'text-secondary'}`}>
                            {notification.titulo}
                          </h4>
                          <p className="text-sm text-secondary mt-1">
                            {notification.mensaje}
                          </p>
                        </div>
                        
                        <div className="text-right">
                          <span className="text-xs text-muted">
                            {formatTimeAgo(notification.fecha)}
                          </span>
                          {notification.prioridad === 'alta' && (
                            <span className="badge badge-danger ml-2">Alta</span>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex justify-end space-x-2 mt-3 pt-3 border-t">
                    {!notification.leida && (
                      <button 
                        onClick={() => markAsRead(notification.uid)}
                        className="btn btn-secondary btn-sm"
                      >
                        Marcar como leída
                      </button>
                    )}
                    
                    <button 
                      onClick={() => deleteNotification(notification.uid)}
                      className="btn btn-danger btn-sm"
                    >
                      Eliminar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Estilos CSS para notificaciones */}
      <style jsx>{`
        .notification-item {
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          padding: 1rem;
          transition: all 0.2s;
          border-left-width: 4px;
        }
        
        .notification-item:hover {
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
        }
        
        .notification-item.unread {
          background-color: #f8fafc;
          border-color: #3b82f6;
        }
        
        .toast {
          position: fixed;
          top: 20px;
          right: 20px;
          background: white;
          border: 1px solid #e5e7eb;
          border-radius: 0.5rem;
          box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
          z-index: 1000;
          min-width: 300px;
        }
        
        .toast-header {
          padding: 0.75rem 1rem;
          border-bottom: 1px solid #e5e7eb;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .toast-body {
          padding: 1rem;
        }
        
        .toast-close {
          background: none;
          border: none;
          font-size: 1.25rem;
          cursor: pointer;
          color: #6b7280;
        }
        
        .toast-success { border-left-color: #10b981; }
        .toast-warning { border-left-color: #f59e0b; }
        .toast-error { border-left-color: #ef4444; }
        .toast-info { border-left-color: #3b82f6; }
      `}</style>
    </div>
  );
};

export default NotificationCenter; 