import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { hasPermission } from '../utils/authorization';

const Reportes = () => {
  const { user } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reporteSeleccionado, setReporteSeleccionado] = useState('ventas');
  const [fechaInicio, setFechaInicio] = useState('');
  const [fechaFin, setFechaFin] = useState('');
  const [datosReporte, setDatosReporte] = useState(null);

  const canViewReports = hasPermission(user?.rol, 'canViewReports');

  useEffect(() => {
    // Establecer fechas por defecto (último mes)
    const hoy = new Date();
    const mesPasado = new Date(hoy.getFullYear(), hoy.getMonth() - 1, hoy.getDate());
    
    setFechaInicio(mesPasado.toISOString().split('T')[0]);
    setFechaFin(hoy.toISOString().split('T')[0]);
    
    if (canViewReports) {
      generarReporte();
    }
  }, [canViewReports]);

  const generarReporte = async () => {
    try {
      setLoading(true);
      
      // Simular generación de reporte
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData = getMockData();
      setDatosReporte(mockData);
    } catch (error) {
      setError('Error al generar el reporte: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const getMockData = () => {
    switch (reporteSeleccionado) {
      case 'ventas':
        return {
          titulo: 'Reporte de Ventas',
          resumen: {
            totalVentas: 15420.50,
            totalTransacciones: 45,
            promedioTicket: 342.68,
            crecimiento: 12.5
          },
          datos: [
            { fecha: '2024-01-01', ventas: 1250.00, transacciones: 8 },
            { fecha: '2024-01-02', ventas: 980.00, transacciones: 6 },
            { fecha: '2024-01-03', ventas: 2100.00, transacciones: 12 },
            { fecha: '2024-01-04', ventas: 890.00, transacciones: 5 },
            { fecha: '2024-01-05', ventas: 1750.00, transacciones: 9 },
            { fecha: '2024-01-06', ventas: 3200.00, transacciones: 18 },
            { fecha: '2024-01-07', ventas: 1450.00, transacciones: 10 }
          ]
        };
      
      case 'vehiculos':
        return {
          titulo: 'Reporte de Vehículos',
          resumen: {
            totalVehiculos: 25,
            disponibles: 18,
            alquilados: 5,
            mantenimiento: 2
          },
          datos: [
            { marca: 'Toyota', cantidad: 8, porcentaje: 32 },
            { marca: 'Honda', cantidad: 6, porcentaje: 24 },
            { marca: 'Ford', cantidad: 4, porcentaje: 16 },
            { marca: 'Nissan', cantidad: 3, porcentaje: 12 },
            { marca: 'Otros', cantidad: 4, porcentaje: 16 }
          ]
        };
      
      case 'clientes':
        return {
          titulo: 'Reporte de Clientes',
          resumen: {
            totalClientes: 156,
            nuevosEsteMes: 23,
            clientesActivos: 89,
            tasaRetencion: 78.5
          },
          datos: [
            { segmento: 'Premium', cantidad: 45, porcentaje: 28.8 },
            { segmento: 'Regular', cantidad: 78, porcentaje: 50.0 },
            { segmento: 'Ocasional', cantidad: 33, porcentaje: 21.2 }
          ]
        };
      
      case 'rentabilidad':
        return {
          titulo: 'Reporte de Rentabilidad',
          resumen: {
            ingresosTotales: 15420.50,
            costosOperativos: 8230.25,
            gananciaNeta: 7190.25,
            margenGanancia: 46.7
          },
          datos: [
            { concepto: 'Ingresos por Alquiler', monto: 12500.00, porcentaje: 81.1 },
            { concepto: 'Servicios Adicionales', monto: 2920.50, porcentaje: 18.9 },
            { concepto: 'Costos de Mantenimiento', monto: -3200.00, porcentaje: -20.8 },
            { concepto: 'Costos Operativos', monto: -5030.25, porcentaje: -32.6 }
          ]
        };
      
      default:
        return null;
    }
  };

  const handleGenerarReporte = () => {
    generarReporte();
  };

  const exportarReporte = (formato) => {
    if (!datosReporte) return;
    
    // Simular exportación
    const nombreArchivo = `${reporteSeleccionado}_${fechaInicio}_${fechaFin}`;
    
    if (formato === 'pdf') {
      alert(`Exportando ${datosReporte.titulo} en PDF: ${nombreArchivo}.pdf`);
    } else if (formato === 'excel') {
      alert(`Exportando ${datosReporte.titulo} en Excel: ${nombreArchivo}.xlsx`);
    }
  };

  const renderGrafico = () => {
    if (!datosReporte) return null;

    switch (reporteSeleccionado) {
      case 'ventas':
        return (
          <div className="grafico-container">
            <h4 className="text-lg font-medium text-primary mb-4">Evolución de Ventas</h4>
            <div className="grafico-barras">
              {datosReporte.datos.map((item, index) => (
                <div key={index} className="barra-item">
                  <div className="barra-label">{new Date(item.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit' })}</div>
                  <div className="barra">
                    <div 
                      className="barra-fill" 
                      style={{ 
                        height: `${(item.ventas / Math.max(...datosReporte.datos.map(d => d.ventas))) * 200}px` 
                      }}
                    ></div>
                  </div>
                  <div className="barra-valor">${item.ventas.toFixed(0)}</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      case 'vehiculos':
        return (
          <div className="grafico-container">
            <h4 className="text-lg font-medium text-primary mb-4">Distribución por Marca</h4>
            <div className="grafico-circular">
              {datosReporte.datos.map((item, index) => (
                <div key={index} className="pie-item">
                  <div className="pie-color" style={{ backgroundColor: getColorByIndex(index) }}></div>
                  <div className="pie-label">{item.marca}</div>
                  <div className="pie-valor">{item.cantidad} ({item.porcentaje}%)</div>
                </div>
              ))}
            </div>
          </div>
        );
      
      default:
        return (
          <div className="text-center py-8">
            <p className="text-secondary">Selecciona un tipo de reporte para ver el gráfico</p>
          </div>
        );
    }
  };

  const getColorByIndex = (index) => {
    const colores = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4'];
    return colores[index % colores.length];
  };

  if (!canViewReports) {
    return (
      <div className="container py-8">
        <div className="card">
          <div className="card-body text-center">
            <h2 className="text-2xl font-bold text-danger mb-4">
              Acceso Denegado
            </h2>
            <p className="text-secondary">
              No tienes permisos para ver reportes del sistema.
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
        <div>Generando reporte...</div>
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
          <h1 className="text-3xl font-bold text-primary">Reportes y Estadísticas</h1>
          <p className="text-secondary mt-2">
            Análisis detallado del rendimiento del sistema
          </p>
        </div>
        
        <div className="flex space-x-3">
          <button 
            onClick={handleGenerarReporte}
            className="btn btn-primary"
          >
            Generar Reporte
          </button>
          
          {datosReporte && (
            <>
              <button 
                onClick={() => exportarReporte('pdf')}
                className="btn btn-secondary"
              >
                Exportar PDF
              </button>
              <button 
                onClick={() => exportarReporte('excel')}
                className="btn btn-success"
              >
                Exportar Excel
              </button>
            </>
          )}
        </div>
      </div>

      {/* Filtros */}
      <div className="card mb-6">
        <div className="card-header">
          <h3 className="text-lg font-medium text-primary">Filtros del Reporte</h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="form-group">
              <label className="form-label">Tipo de Reporte</label>
              <select 
                className="form-input"
                value={reporteSeleccionado}
                onChange={(e) => setReporteSeleccionado(e.target.value)}
              >
                <option value="ventas">Reporte de Ventas</option>
                <option value="vehiculos">Reporte de Vehículos</option>
                <option value="clientes">Reporte de Clientes</option>
                <option value="rentabilidad">Reporte de Rentabilidad</option>
              </select>
            </div>
            
            <div className="form-group">
              <label className="form-label">Fecha Inicio</label>
              <input
                type="date"
                className="form-input"
                value={fechaInicio}
                onChange={(e) => setFechaInicio(e.target.value)}
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Fecha Fin</label>
              <input
                type="date"
                className="form-input"
                value={fechaFin}
                onChange={(e) => setFechaFin(e.target.value)}
              />
            </div>
            
            <div className="form-group flex items-end">
              <button 
                onClick={handleGenerarReporte}
                className="btn btn-primary w-full"
              >
                Aplicar Filtros
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Reporte Generado */}
      {datosReporte && (
        <>
          {/* Resumen */}
          <div className="stats-grid mb-6">
            {Object.entries(datosReporte.resumen).map(([key, value]) => (
              <div key={key} className="stat-card">
                <div className="stat-icon">
                  {key.includes('total') ? '💰' : 
                   key.includes('crecimiento') ? '📈' : 
                   key.includes('tasa') ? '📊' : '📋'}
                </div>
                <div className="stat-value">
                  {typeof value === 'number' && key.includes('porcentaje') ? `${value}%` :
                   typeof value === 'number' && key.includes('crecimiento') ? `${value > 0 ? '+' : ''}${value}%` :
                   typeof value === 'number' && key.includes('monto') ? `$${value.toFixed(2)}` :
                   typeof value === 'number' ? value.toLocaleString() : value}
                </div>
                <div className="stat-label">
                  {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                </div>
              </div>
            ))}
          </div>

          {/* Gráfico y Tabla */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Gráfico */}
            <div className="card">
              <div className="card-body">
                {renderGrafico()}
              </div>
            </div>

            {/* Tabla de Datos */}
            <div className="card">
              <div className="card-header">
                <h4 className="text-lg font-medium text-primary">Datos Detallados</h4>
              </div>
              <div className="card-body">
                <div className="table-container">
                  <table className="table">
                    <thead>
                      <tr>
                        {Object.keys(datosReporte.datos[0] || {}).map(key => (
                          <th key={key}>
                            {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {datosReporte.datos.map((item, index) => (
                        <tr key={index}>
                          {Object.values(item).map((value, valueIndex) => (
                            <td key={valueIndex}>
                              {typeof value === 'number' && value > 1000 ? 
                                value.toLocaleString() : 
                                typeof value === 'number' ? 
                                  value.toFixed(2) : 
                                  value}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Estilos CSS para gráficos */}
      <style jsx>{`
        .grafico-container {
          padding: 1rem;
        }
        
        .grafico-barras {
          display: flex;
          align-items: end;
          justify-content: space-around;
          height: 250px;
          padding: 1rem 0;
        }
        
        .barra-item {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 1;
        }
        
        .barra-label {
          font-size: 0.75rem;
          color: #6b7280;
          margin-bottom: 0.5rem;
          text-align: center;
        }
        
        .barra {
          width: 30px;
          height: 200px;
          background-color: #e5e7eb;
          border-radius: 4px;
          position: relative;
          margin-bottom: 0.5rem;
        }
        
        .barra-fill {
          position: absolute;
          bottom: 0;
          width: 100%;
          background-color: #3b82f6;
          border-radius: 4px;
          transition: height 0.3s ease;
        }
        
        .barra-valor {
          font-size: 0.75rem;
          color: #374151;
          font-weight: 500;
        }
        
        .grafico-circular {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
          padding: 1rem;
        }
        
        .pie-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }
        
        .pie-color {
          width: 16px;
          height: 16px;
          border-radius: 50%;
        }
        
        .pie-label {
          font-weight: 500;
          color: #374151;
        }
        
        .pie-valor {
          font-size: 0.875rem;
          color: #6b7280;
        }
      `}</style>
    </div>
  );
};

export default Reportes; 