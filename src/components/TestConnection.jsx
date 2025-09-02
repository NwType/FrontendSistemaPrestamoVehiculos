import React, { useState } from 'react';
import { testService } from '../services/testService';

const TestConnection = () => {
  const [testResults, setTestResults] = useState({});
  const [loading, setLoading] = useState(false);

  const testConnection = async () => {
    setLoading(true);
    const result = await testService.testConnection();
    setTestResults(prev => ({ ...prev, connection: result }));
    setLoading(false);
  };

  const testAuth = async () => {
    setLoading(true);
    const result = await testService.testAuth();
    setTestResults(prev => ({ ...prev, auth: result }));
    setLoading(false);
  };

  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold text-primary mb-6">
        Prueba de Conexión con Backend
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-primary">
              Prueba de Conexión Básica
            </h3>
          </div>
          <div className="card-body">
            <p className="text-secondary mb-4">
              Prueba la conexión al endpoint de vehículos
            </p>
            <button 
              onClick={testConnection}
              disabled={loading}
              className="btn btn-primary"
            >
              {loading ? 'Probando...' : 'Probar Conexión'}
            </button>
            
            {testResults.connection && (
              <div className={`mt-4 p-3 rounded ${
                testResults.connection.success 
                  ? 'success-message' 
                  : 'error-message'
              }`}>
                <h4 className="font-medium mb-2">
                  {testResults.connection.success ? '✅ Conexión Exitosa' : '❌ Error de Conexión'}
                </h4>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(testResults.connection, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <h3 className="text-lg font-medium text-primary">
              Prueba de Autenticación
            </h3>
          </div>
          <div className="card-body">
            <p className="text-secondary mb-4">
              Prueba el endpoint de login (con credenciales de prueba)
            </p>
            <button 
              onClick={testAuth}
              disabled={loading}
              className="btn btn-secondary"
            >
              {loading ? 'Probando...' : 'Probar Auth'}
            </button>
            
            {testResults.auth && (
              <div className={`mt-4 p-3 rounded ${
                testResults.auth.success 
                  ? 'success-message' 
                  : 'error-message'
              }`}>
                <h4 className="font-medium mb-2">
                  {testResults.auth.success ? '✅ Auth Exitoso' : '❌ Error de Auth'}
                </h4>
                <pre className="text-sm overflow-auto">
                  {JSON.stringify(testResults.auth, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="card mt-6">
        <div className="card-header">
          <h3 className="text-lg font-medium text-primary">
            Información de Configuración
          </h3>
        </div>
        <div className="card-body">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-primary mb-2">Frontend</h4>
              <p className="text-sm text-secondary">
                <strong>URL:</strong> http://localhost:5173
              </p>
              <p className="text-sm text-secondary">
                <strong>Puerto:</strong> 5173
              </p>
            </div>
            <div>
              <h4 className="font-medium text-primary mb-2">Backend</h4>
              <p className="text-sm text-secondary">
                <strong>URL:</strong> https://localhost:7057
              </p>
              <p className="text-sm text-secondary">
                <strong>API:</strong> https://localhost:7057/api
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TestConnection; 