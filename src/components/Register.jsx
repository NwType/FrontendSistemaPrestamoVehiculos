import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { usuarioService } from '../services/usuarioService';

const Register = () => {
  const [userData, setUserData] = useState({
    nombre: '',
    correo: '',
    contrasena: '',
    confirmarContrasena: '',
    direccion: '',
    telefono: ''
  });
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setUserData({
      ...userData,
      [e.target.name]: e.target.value
    });
  };

  const validateForm = () => {
    if (userData.contrasena !== userData.confirmarContrasena) {
      setError('Las contraseñas no coinciden');
      return false;
    }
    
    if (userData.contrasena.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres');
      return false;
    }
    
    if (!userData.nombre.trim() || !userData.correo.trim() || !userData.direccion.trim() || !userData.telefono.trim()) {
      setError('Todos los campos son obligatorios');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    
    try {
      // Crear usuario con rol de Cliente (ID: F1E2D3C4-B5A6-0987-6543-210FEDCBA987)
      const usuarioData = {
        nombre: userData.nombre,
        correo: userData.correo,
        contrasena: userData.contrasena,
        direccion: userData.direccion,
        telefono: userData.telefono,
        // rolUid ya no se envía desde el frontend, el backend asignará el rol 'Cliente' por defecto
      };
      
      await usuarioService.create(usuarioData);
      
      setSuccess('Usuario registrado exitosamente. Ahora puedes iniciar sesión.');
      
      // Limpiar formulario
      setUserData({
        nombre: '',
        correo: '',
        contrasena: '',
        confirmarContrasena: '',
        direccion: '',
        telefono: ''
      });
      
      // Redirigir al login después de 2 segundos
      setTimeout(() => {
        navigate('/login');
      }, 2000);
      
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
              Registro de Usuario
            </h2>
            <p className="text-secondary mt-2">
              Sistema de Gestión de Autos
            </p>
          </div>
          
          <div className="card-body">
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}
            
            {success && (
              <div className="success-message">
                {success}
              </div>
            )}
            
            <form onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="nombre" className="form-label">
                  Nombre Completo
                </label>
                <input
                  id="nombre"
                  name="nombre"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ingresa tu nombre completo"
                  value={userData.nombre}
                  onChange={handleChange}
                />
              </div>

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
                  value={userData.correo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="direccion" className="form-label">
                  Dirección
                </label>
                <input
                  id="direccion"
                  name="direccion"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Ingresa tu dirección"
                  value={userData.direccion}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="telefono" className="form-label">
                  Teléfono
                </label>
                <input
                  id="telefono"
                  name="telefono"
                  type="tel"
                  required
                  className="form-input"
                  placeholder="Ingresa tu teléfono"
                  value={userData.telefono}
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
                  value={userData.contrasena}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirmarContrasena" className="form-label">
                  Confirmar Contraseña
                </label>
                <input
                  id="confirmarContrasena"
                  name="confirmarContrasena"
                  type="password"
                  required
                  className="form-input"
                  placeholder="Confirma tu contraseña"
                  value={userData.confirmarContrasena}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary w-full"
                >
                  {loading ? 'Registrando...' : 'Registrarse'}
                </button>
              </div>
            </form>
            
            <div className="text-center mt-4">
              <p className="text-secondary">
                ¿Ya tienes una cuenta?{' '}
                <Link to="/login" className="text-primary hover:underline">
                  Inicia sesión aquí
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
