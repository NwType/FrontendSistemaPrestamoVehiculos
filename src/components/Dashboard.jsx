import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Link } from 'react-router-dom';
import { hasPermission, ROLES } from '../utils/authorization';

const Dashboard = () => {
  const { user, logout } = useAuth();

  // Menú dinámico basado en permisos del usuario
  const getMenuItems = () => {
    const baseItems = [
      { 
        name: 'Vehículos', 
        path: '/vehiculos', 
        icon: '🚗',
        permission: 'canViewVehicles'
      },
      { 
        name: 'Reservas', 
        path: '/reservas', 
        icon: '📅',
        permission: 'canViewAllReservations'
      },
      { 
        name: 'Alquileres', 
        path: '/alquileres', 
        icon: '🔑',
        permission: 'canManageAlquileres'
      },
      { 
        name: 'Mantenimiento', 
        path: '/mantenimiento', 
        icon: '🔧',
        permission: 'canManageMaintenance'
      },
      { 
        name: 'Inventario', 
        path: '/inventario', 
        icon: '📦',
        permission: 'canViewVehicles'
      },
      { 
        name: 'Notificaciones', 
        path: '/notificaciones', 
        icon: '🔔',
        permission: 'canViewNotifications'
      },
      { 
        name: 'Servicios Adicionales', 
        path: '/servicios', 
        icon: '➕',
        permission: 'canManageSystem'
      }
    ];

    // Agregar opciones administrativas solo para administradores
    if (hasPermission(user?.rol, 'canManageUsers')) {
      baseItems.push({
        name: 'Usuarios',
        path: '/usuarios',
        icon: '👥',
        permission: 'canManageUsers'
      });
    }

    if (hasPermission(user?.rol, 'canViewReports')) {
      baseItems.push({
        name: 'Reportes',
        path: '/reportes',
        icon: '📊',
        permission: 'canViewReports'
      });
    }

    if (hasPermission(user?.rol, 'canManageSystem')) {
      baseItems.push({
        name: 'Configuración',
        path: '/configuracion',
        icon: '⚙️',
        permission: 'canManageSystem'
      });
    }

    return baseItems;
  };

  const menuItems = getMenuItems();

  // Obtener estadísticas según el rol
  const getStats = () => {
    const baseStats = [
      {
        icon: '🚗',
        value: '25',
        label: 'Total Vehículos',
        permission: 'canViewVehicles'
      },
      {
        icon: '📅',
        value: '8',
        label: 'Reservas Activas',
        permission: 'canViewAllReservations'
      },
      {
        icon: '🔑',
        value: '12',
        label: 'Alquileres Activos',
        permission: 'canManageAlquileres'
      }
    ];

    // Agregar estadísticas administrativas
    if (hasPermission(user?.rol, 'canManageUsers')) {
      baseStats.push({
        icon: '👥',
        value: '45',
        label: 'Usuarios Registrados',
        permission: 'canManageUsers'
      });
    }

    if (hasPermission(user?.rol, 'canViewReports')) {
      baseStats.push({
        icon: '📊',
        value: '15',
        label: 'Reportes Generados',
        permission: 'canViewReports'
      });
    }

    return baseStats.filter(stat => hasPermission(user?.rol, stat.permission));
  };

  const stats = getStats();

  return (
    <div className="bg-secondary">
      {/* Header */}
      <header className="dashboard-header py-4 shadow-md">
        <div className="container">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-primary md:text-3xl">
              Sistema de Gestión de Autos
            </h1>
            <div className="flex items-center space-x-4">
              <div className="text-right">
                <span className="text-secondary block text-sm">
                  Bienvenido, {user?.nombre || 'Usuario'}
                </span>
                <span className="text-primary font-medium">
                  {user?.rol || 'Sin rol'}
                </span>
              </div>
              <button
                onClick={logout}
                className="btn btn-danger"
              >
                Cerrar Sesión
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container py-8">
        {/* Stats Cards */}
        <div className="stats-grid gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="stat-card p-6 flex flex-col items-center text-center">
              <div className="stat-icon text-4xl mb-4">{stat.icon}</div>
              <div className="stat-value text-3xl font-bold text-primary mb-1">{stat.value}</div>
              <div className="stat-label text-secondary text-sm">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Menu Grid */}
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-primary">
              Módulos Disponibles
            </h3>
            <p className="text-sm text-secondary mt-1">
              Acceso basado en tu rol: <strong>{user?.rol}</strong>
            </p>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {menuItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="stat-card p-4 flex flex-col items-center text-center hover:shadow-lg transition-shadow cursor-pointer"
                >
                  <div className="stat-icon text-3xl mb-2">{item.icon}</div>
                  <div className="stat-label font-medium text-primary">{item.name}</div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Información del Rol */}
        <div className="card mt-8">
          <div className="card-header">
            <h3 className="text-xl font-semibold text-primary">
              Información de tu Cuenta
            </h3>
          </div>
          <div className="card-body">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-primary mb-3">Datos Personales</h4>
                <p className="text-base text-secondary mb-2">
                  <strong>Nombre:</strong> {user?.nombre || 'No disponible'}
                </p>
                <p className="text-base text-secondary mb-2">
                  <strong>Correo:</strong> {user?.correo || 'No disponible'}
                </p>
                <p className="text-base text-secondary">
                  <strong>Rol:</strong> <span className="font-medium text-primary">{user?.rol || 'No asignado'}</span>
                </p>
              </div>
              <div>
                <h4 className="font-semibold text-primary mb-3">Permisos Disponibles</h4>
                <ul className="text-base text-secondary space-y-2">
                  {user?.rol === ROLES.ADMINISTRADOR && (
                    <li><span role="img" aria-label="check mark">✅</span> Acceso completo al sistema</li>
                  )}
                  {user?.rol === ROLES.EMPLEADO && (
                    <>
                      <li><span role="img" aria-label="check mark">✅</span> Gestión de alquileres</li>
                      <li><span role="img" aria-label="check mark">✅</span> Gestión de mantenimiento</li>
                      <li><span role="img" aria-label="check mark">✅</span> Procesamiento de pagos</li>
                    </>
                  )}
                  {user?.rol === ROLES.CLIENTE && (
                    <>
                      <li><span role="img" aria-label="check mark">✅</span> Crear reservas</li>
                      <li><span role="img" aria-label="check mark">✅</span> Ver vehículos disponibles</li>
                      <li><span role="img" aria-label="check mark">✅</span> Recibir notificaciones</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
