import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { canAccessRoute } from '../utils/authorization';

const RoleProtectedRoute = ({ children, requiredRole, route }) => {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return (
      <div className="loading">
        <div className="spinner"></div>
        <div>Cargando...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Verificar si el usuario puede acceder a la ruta específica
  if (route && !canAccessRoute(user?.rol, route)) {
    return (
      <div className="container py-8">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold text-danger mb-4">
              Acceso Denegado
            </h2>
            <p className="text-secondary mb-4">
              No tienes permisos para acceder a esta sección.
            </p>
            <p className="text-sm text-muted">
              Tu rol actual: <strong>{user?.rol}</strong>
            </p>
            <button 
              onClick={() => window.history.back()}
              className="btn btn-primary mt-4"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Verificar rol específico si se requiere
  if (requiredRole && user?.rol !== requiredRole) {
    return (
      <div className="container py-8">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold text-danger mb-4">
              Rol Requerido
            </h2>
            <p className="text-secondary mb-4">
              Necesitas el rol <strong>{requiredRole}</strong> para acceder a esta sección.
            </p>
            <p className="text-sm text-muted">
              Tu rol actual: <strong>{user?.rol}</strong>
            </p>
            <button 
              onClick={() => window.history.back()}
              className="btn btn-primary mt-4"
            >
              Volver
            </button>
          </div>
        </div>
      </div>
    );
  }

  return children;
};

export default RoleProtectedRoute; 