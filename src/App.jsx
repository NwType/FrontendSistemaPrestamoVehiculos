import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import RoleProtectedRoute from './components/RoleProtectedRoute';
import Login from './components/Login';
import Register from './components/Register';
import Dashboard from './components/Dashboard';
import VehiculoList from './components/VehiculoList';
import ReservaList from './components/ReservaList';
import AlquilerList from './components/AlquilerList';
import NotificationCenter from './components/NotificationCenter';
import Reportes from './components/Reportes';
import TestConnection from './components/TestConnection';
import './App.css';

// Crear cliente de React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router>
          <main className="app-container">
            <Routes>
              {/* Rutas públicas */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/test" element={<TestConnection />} />
              
              {/* Rutas protegidas - Dashboard (todos los roles) */}
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              
              {/* Rutas protegidas - Solo visualización de vehículos */}
              <Route path="/vehiculos" element={
                <RoleProtectedRoute route="/vehiculos">
                  <VehiculoList />
                </RoleProtectedRoute>
              } />
              
              {/* Rutas protegidas - Reservas (todos los roles autenticados) */}
              <Route path="/reservas" element={
                <RoleProtectedRoute route="/reservas">
                  <ReservaList />
                </RoleProtectedRoute>
              } />
              
              {/* Rutas protegidas - Empleados y Administradores */}
              <Route path="/alquileres" element={
                <RoleProtectedRoute route="/alquileres">
                  <AlquilerList />
                </RoleProtectedRoute>
              } />
              
              <Route path="/mantenimiento" element={
                <RoleProtectedRoute route="/mantenimiento">
                  <div className="container py-8">
                    <h1 className="text-3xl font-bold text-primary mb-6">
                      Gestión de Mantenimiento
                    </h1>
                    <p className="text-secondary">
                      Controla el estado de mantenimiento de los vehículos.
                    </p>
                  </div>
                </RoleProtectedRoute>
              } />
              
              {/* Rutas protegidas - Notificaciones (todos los roles autenticados) */}
              <Route path="/notificaciones" element={
                <RoleProtectedRoute route="/notificaciones">
                  <NotificationCenter />
                </RoleProtectedRoute>
              } />
              
              {/* Rutas protegidas - Solo administradores */}
              <Route path="/usuarios" element={
                <RoleProtectedRoute requiredRole="Administrador">
                  <div className="container py-8">
                    <h1 className="text-3xl font-bold text-primary mb-6">
                      Gestión de Usuarios
                    </h1>
                    <p className="text-secondary">
                      Esta sección solo está disponible para administradores.
                    </p>
                  </div>
                </RoleProtectedRoute>
              } />
              
              <Route path="/reportes" element={
                <RoleProtectedRoute requiredRole="Administrador">
                  <Reportes />
                </RoleProtectedRoute>
              } />
              
              <Route path="/configuracion" element={
                <RoleProtectedRoute requiredRole="Administrador">
                  <div className="container py-8">
                    <h1 className="text-3xl font-bold text-primary mb-6">
                      Configuración del Sistema
                    </h1>
                    <p className="text-secondary">
                      Configura parámetros del sistema.
                    </p>
                  </div>
                </RoleProtectedRoute>
              } />
              
              {/* Ruta por defecto */}
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              
              {/* Ruta para cualquier otra URL no encontrada */}
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </main>
        </Router>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
