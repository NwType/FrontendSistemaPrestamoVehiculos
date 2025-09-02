import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { useNavigate, Link } from 'react-router-dom';

const Login = () => {
  const [credentials, setCredentials] = useState({
    correo: '',
    contrasena: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(credentials);
      navigate('/dashboard');
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="card">
          <div className="card-header text-center">
            <h2 className="text-3xl font-bold text-primary">
              Iniciar Sesión
            </h2>
            <p className="text-secondary mt-2">
              Sistema de Gestión de Autos
            </p>
          </div>
          
          <div className="card-body">
            <form onSubmit={handleSubmit}>
              {error && (
                <div className="error-message">
                  {error}
                </div>
              )}
              
              <div className="form-group">
                <label htmlFor="correo" className="form-label">
                  Correo Electrónico
                </label>
                <input
                  id="correo"
                  name="correo"
                  type="email"
                  required
                  className="form-input"
                  placeholder="Ingresa tu correo electrónico"
                  value={credentials.correo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="contrasena" className="form-label">
                  Contraseña
                </label>
                <input
                  id="contrasena"
                  name="contrasena"
                  type="password"
                  required
                  className="form-input"
                  placeholder="Ingresa tu contraseña"
                  value={credentials.contrasena}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                </button>
              </div>
            </form>
            
            <div className="text-center mt-4">
              <p className="text-secondary">
                ¿No tienes una cuenta?{' '}
                <Link to="/register" className="text-primary hover:underline">
                  Regístrate aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login; 