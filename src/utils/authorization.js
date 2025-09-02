// Sistema de autorización basado en roles
export const ROLES = {
  CLIENTE: 'Cliente',
  EMPLEADO: 'Empleado',
  ADMINISTRADOR: 'Administrador'
};

// Permisos por rol
export const PERMISSIONS = {
  [ROLES.CLIENTE]: {
    // Solo puede ver y crear reservas
    canViewVehicles: true,
    canCreateReservations: true,
    canViewOwnReservations: true,
    canViewNotifications: true,
    canEditProfile: true,
    // No puede modificar datos del sistema
    canManageVehicles: false,
    canManageUsers: false,
    canManageReservations: false,
    canManageAlquileres: false,
    canManageMaintenance: false,
    canViewReports: false,
    canManageSystem: false
  },
  
  [ROLES.EMPLEADO]: {
    // Puede gestionar alquileres y mantenimiento
    canViewVehicles: true,
    canCreateReservations: true,
    canViewAllReservations: true,
    canManageAlquileres: true,
    canManageMaintenance: true,
    canViewNotifications: true,
    canProcessPayments: true,
    canViewReports: true,
    // No puede modificar usuarios ni configuración del sistema
    canManageVehicles: false,
    canManageUsers: false,
    canManageSystem: false
  },
  
  [ROLES.ADMINISTRADOR]: {
    // Acceso completo a todo el sistema
    canViewVehicles: true,
    canCreateReservations: true,
    canViewAllReservations: true,
    canManageVehicles: true,
    canManageUsers: true,
    canManageReservations: true,
    canManageAlquileres: true,
    canManageMaintenance: true,
    canViewNotifications: true,
    canProcessPayments: true,
    canViewReports: true,
    canManageSystem: true
  }
};

// Función para verificar si un usuario tiene un permiso específico
export const hasPermission = (userRole, permission) => {
  if (!userRole || !PERMISSIONS[userRole]) {
    return false;
  }
  return PERMISSIONS[userRole][permission] || false;
};

// Función para verificar si un usuario tiene un rol específico
export const hasRole = (userRole, requiredRole) => {
  if (!userRole) return false;
  
  // Administrador tiene acceso a todo
  if (userRole === ROLES.ADMINISTRADOR) return true;
  
  // Empleado tiene acceso a funcionalidades de empleado y cliente
  if (userRole === ROLES.EMPLEADO && requiredRole !== ROLES.ADMINISTRADOR) return true;
  
  // Cliente solo tiene acceso a funcionalidades de cliente
  if (userRole === ROLES.CLIENTE && requiredRole === ROLES.CLIENTE) return true;
  
  return false;
};

// Función para obtener el nivel de acceso del usuario
export const getUserAccessLevel = (userRole) => {
  switch (userRole) {
    case ROLES.ADMINISTRADOR:
      return 3; // Nivel más alto
    case ROLES.EMPLEADO:
      return 2; // Nivel medio
    case ROLES.CLIENTE:
      return 1; // Nivel básico
    default:
      return 0; // Sin acceso
  }
};

// Función para verificar si un usuario puede acceder a una ruta
export const canAccessRoute = (userRole, route) => {
  const routePermissions = {
    '/dashboard': true, // Todos pueden acceder al dashboard
    '/vehiculos': hasPermission(userRole, 'canViewVehicles'),
    '/usuarios': hasPermission(userRole, 'canManageUsers'),
    '/reservas': hasPermission(userRole, 'canViewAllReservations') || hasPermission(userRole, 'canViewOwnReservations'),
    '/alquileres': hasPermission(userRole, 'canManageAlquileres'),
    '/mantenimiento': hasPermission(userRole, 'canManageMaintenance'),
    '/inventario': hasPermission(userRole, 'canViewVehicles'),
    '/notificaciones': hasPermission(userRole, 'canViewNotifications'),
    '/servicios': hasPermission(userRole, 'canManageSystem'),
    '/reportes': hasPermission(userRole, 'canViewReports'),
    '/configuracion': hasPermission(userRole, 'canManageSystem')
  };
  
  return routePermissions[route] || false;
}; 