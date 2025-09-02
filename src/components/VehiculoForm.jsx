import React, { useState, useEffect } from 'react';
import { useVehiculos } from '../hooks/useVehiculos';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/authorization';
import { imageService } from '../services/imageService';

const VehiculoForm = ({ vehiculo = null, onClose, onSuccess }) => {
  const { user } = useAuth();
  const { createVehiculo, updateVehiculo, isCreating, isUpdating } = useVehiculos();
  
  const [formData, setFormData] = useState({
    placa: '',
    modelo: '',
    estado: 'Disponible',
    precioDia: '',
    anio: new Date().getFullYear(),
    capacidad: '',
    marca: '',
    IdCategoria: '', // Cambiado de categoriaUid a IdCategoria
    // Eliminados mantenimientoUid y reservaUid ya que no son parte del DTO de Vehiculo
  });

  const [categorias, setCategorias] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [fotos, setFotos] = useState([]);
  const [fotoPrincipal, setFotoPrincipal] = useState('');

  const isEditing = !!vehiculo;
  const canManageVehicles = hasPermission(user?.rol, 'canManageVehicles');

  useEffect(() => {
    if (vehiculo) {
      setFormData({
        placa: vehiculo.placa || '',
        modelo: vehiculo.modelo || '',
        estado: vehiculo.estado || 'Disponible',
        precioDia: vehiculo.precioDia || '',
        anio: vehiculo.anio || new Date().getFullYear(),
        capacidad: vehiculo.capacidad || '',
        marca: vehiculo.marca || '',
        IdCategoria: vehiculo.idCategoria || '', // Cambiado de categoriaUid a IdCategoria
        // Eliminados mantenimientoUid y reservaUid
      });
    }
    // Cargar categorías (simulado por ahora)
    setCategorias([
      { uid: 'cat1', nombre: 'Sedán' },
      { uid: 'cat2', nombre: 'SUV' },
      { uid: 'cat3', nombre: 'Deportivo' },
      { uid: 'cat4', nombre: 'Familiar' }
    ]);
  }, [vehiculo]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files);
    
    files.forEach(file => {
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const newFoto = {
            id: Date.now(),
            url: e.target.result,
            file: file,
            nombre: file.name
          };
          setFotos(prev => [...prev, newFoto]);
          
          // Si es la primera foto, establecer como principal
          if (fotos.length === 0) {
            setFotoPrincipal(e.target.result);
          }
        };
        reader.readAsDataURL(file);
      }
    });
  };

  const removeFoto = (fotoId) => {
    setFotos(prev => prev.filter(f => f.id !== fotoId));
    
    // Si se eliminó la foto principal, establecer la primera disponible
    if (fotoPrincipal === fotos.find(f => f.id === fotoId)?.url) {
      const nuevasFotos = fotos.filter(f => f.id !== fotoId);
      setFotoPrincipal(nuevasFotos.length > 0 ? nuevasFotos[0].url : '');
    }
  };

  const setAsPrincipal = (fotoUrl) => {
    setFotoPrincipal(fotoUrl);
  };

  const validateForm = () => {
    if (!formData.placa.trim()) {
      setError('La placa es obligatoria');
      return false;
    }
    if (!formData.modelo.trim()) {
      setError('El modelo es obligatorio');
      return false;
    }
    if (!formData.marca.trim()) {
      setError('La marca es obligatoria');
      return false;
    }
    if (!formData.precioDia || formData.precioDia <= 0) {
      setError('El precio por día debe ser mayor a 0');
      return false;
    }
    if (!formData.capacidad || formData.capacidad <= 0) {
      setError('La capacidad debe ser mayor a 0');
      return false;
    }
    if (!formData.categoriaUid) {
      setError('Debe seleccionar una categoría');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) return;
    
    // Validación adicional para edición
    if (isEditing && !vehiculo?.uid) {
      setError('Error: ID de vehículo no válido para editar');
      return;
    }
    
    setLoading(true);
    
    try {
      if (isEditing && vehiculo?.idVehiculo) { // Cambiado vehiculo?.uid a vehiculo?.idVehiculo
        // Verificar que tenemos un ID válido para editar
        console.log('Editando vehículo con ID:', vehiculo.idVehiculo); // Cambiado vehiculo.uid a vehiculo.idVehiculo
        await updateVehiculo({ id: vehiculo.idVehiculo, data: formData }); // Cambiado vehiculo.uid a vehiculo.idVehiculo
      } else if (!isEditing) {
        // Crear nuevo vehículo
        console.log('Creando nuevo vehículo');
        await createVehiculo(formData);
      } else {
        throw new Error('ID de vehículo no válido para editar');
      }
      
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error en submit:', error);
      setError(error.message || 'Error desconocido al procesar el vehículo');
    } finally {
      setLoading(false);
    }
  };

  if (!canManageVehicles) {
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
              No tienes permisos para gestionar vehículos.
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

  return (
    <div className="modal-overlay">
      <div className="modal" style={{ maxWidth: '800px' }}>
        <div className="modal-header">
          <h3 className="text-lg font-medium text-primary">
            {isEditing ? 'Editar Vehículo' : 'Crear Nuevo Vehículo'}
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
          
          <form onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="form-group">
                <label htmlFor="placa" className="form-label">
                  Placa *
                </label>
                <input
                  id="placa"
                  name="placa"
                  type="text"
                  required
                  className="form-input"
                  placeholder="ABC-123"
                  value={formData.placa}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="marca" className="form-label">
                  Marca *
                </label>
                <input
                  id="marca"
                  name="marca"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Toyota, Honda, etc."
                  value={formData.marca}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="modelo" className="form-label">
                  Modelo *
                </label>
                <input
                  id="modelo"
                  name="modelo"
                  type="text"
                  required
                  className="form-input"
                  placeholder="Corolla, Civic, etc."
                  value={formData.modelo}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="anio" className="form-label">
                  Año *
                </label>
                <input
                  id="anio"
                  name="anio"
                  type="number"
                  required
                  min="1900"
                  max={new Date().getFullYear() + 1}
                  className="form-input"
                  value={formData.anio}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="capacidad" className="form-label">
                  Capacidad (pasajeros) *
                </label>
                <input
                  id="capacidad"
                  name="capacidad"
                  type="number"
                  required
                  min="1"
                  max="20"
                  className="form-input"
                  placeholder="5"
                  value={formData.capacidad}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="precioDia" className="form-label">
                  Precio por Día *
                </label>
                <input
                  id="precioDia"
                  name="precioDia"
                  type="number"
                  required
                  min="0"
                  step="0.01"
                  className="form-input"
                  placeholder="50.00"
                  value={formData.precioDia}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label htmlFor="categoriaUid" className="form-label">
                  Categoría *
                </label>
                <select
                  id="categoriaUid"
                  name="categoriaUid"
                  required
                  className="form-input"
                  value={formData.categoriaUid}
                  onChange={handleChange}
                >
                  <option value="">Selecciona una categoría</option>
                  {categorias.map(cat => (
                    <option key={cat.uid} value={cat.uid}>
                      {cat.nombre}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="estado" className="form-label">
                  Estado
                </label>
                <select
                  id="estado"
                  name="estado"
                  className="form-input"
                  value={formData.estado}
                  onChange={handleChange}
                >
                  <option value="Disponible">Disponible</option>
                  <option value="En Mantenimiento">En Mantenimiento</option>
                  <option value="Reservado">Reservado</option>
                  <option value="Alquilado">Alquilado</option>
                  <option value="Fuera de Servicio">Fuera de Servicio</option>
                </select>
              </div>
            </div>

            {/* Sección de Fotos */}
            <div className="form-group">
              <label className="form-label">Fotos del Vehículo</label>
              
              {/* Subida de archivos */}
              <div className="file-upload-container">
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileUpload}
                  className="file-input"
                  id="foto-upload"
                />
                <label htmlFor="foto-upload" className="file-upload-label">
                  <span className="file-upload-icon">📷</span>
                  <span>Seleccionar Fotos</span>
                </label>
              </div>
              
              {/* Vista previa de fotos */}
              {fotos.length > 0 && (
                <div className="fotos-preview">
                  <h5 className="text-sm font-medium text-primary mb-2">
                    Fotos Seleccionadas ({fotos.length})
                  </h5>
                  
                  <div className="fotos-grid">
                    {fotos.map((foto) => (
                      <div key={foto.id} className="foto-item">
                        <img
                          src={foto.url}
                          alt={foto.nombre}
                          className="foto-preview"
                        />
                        
                        <div className="foto-actions">
                          {fotoPrincipal === foto.url && (
                            <span className="badge badge-success">Principal</span>
                          )}
                          
                          <div className="foto-buttons">
                            {fotoPrincipal !== foto.url && (
                              <button
                                type="button"
                                onClick={() => setAsPrincipal(foto.url)}
                                className="btn btn-secondary btn-sm"
                              >
                                Hacer Principal
                              </button>
                            )}
                            
                            <button
                              type="button"
                              onClick={() => removeFoto(foto.id)}
                              className="btn btn-danger btn-sm"
                            >
                              Eliminar
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="form-group mt-6">
              <button
                type="submit"
                disabled={loading || isCreating || isUpdating}
                className="btn btn-primary w-full"
              >
                {loading || isCreating || isUpdating 
                  ? (isEditing ? 'Actualizando...' : 'Creando...') 
                  : (isEditing ? 'Actualizar Vehículo' : 'Crear Vehículo')
                }
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default VehiculoForm;
