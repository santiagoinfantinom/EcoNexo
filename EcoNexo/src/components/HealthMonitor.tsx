"use client";
import React, { useState, useEffect } from 'react';
import { HealthChecker, HealthStatus } from '@/lib/healthCheck';

interface HealthMonitorProps {
  showDetails?: boolean;
  className?: string;
}

export default function HealthMonitor({ showDetails = false, className = '' }: HealthMonitorProps) {
  const [status, setStatus] = useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<Date | null>(null);

  useEffect(() => {
    const checker = HealthChecker.getInstance();
    
    const performCheck = async () => {
      setIsLoading(true);
      const healthStatus = await checker.performHealthCheck();
      setStatus(healthStatus);
      setLastUpdate(new Date());
      setIsLoading(false);
    };

    // Verificación inicial
    performCheck();
    
    // Verificar cada 30 segundos
    const interval = setInterval(performCheck, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'healthy': return 'text-green-600 bg-green-100';
      case 'degraded': return 'text-yellow-600 bg-yellow-100';
      case 'unhealthy': return 'text-red-600 bg-red-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'healthy': return '✅';
      case 'degraded': return '⚠️';
      case 'unhealthy': return '🚨';
      default: return '❓';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'healthy': return 'Sistema funcionando correctamente';
      case 'degraded': return 'Sistema con problemas menores';
      case 'unhealthy': return 'Sistema en estado crítico';
      default: return 'Estado desconocido';
    }
  };

  if (isLoading) {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-500"></div>
        Verificando sistema...
      </div>
    );
  }

  if (!status) {
    return (
      <div className={`flex items-center gap-2 text-sm text-gray-500 ${className}`}>
        ❓ Estado del sistema desconocido
      </div>
    );
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {/* Estado principal */}
      <div className="flex items-center gap-2">
        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(status.status)}`}>
          {getStatusIcon(status.status)} {getStatusText(status.status)}
        </span>
        {lastUpdate && (
          <span className="text-xs text-gray-500">
            Actualizado: {lastUpdate.toLocaleTimeString()}
          </span>
        )}
      </div>

      {/* Detalles expandibles */}
      {showDetails && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Estado de componentes:</h4>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {Object.entries(status.checks).map(([component, isHealthy]) => (
              <div key={component} className="flex items-center gap-1">
                <span>{isHealthy ? '✅' : '❌'}</span>
                <span className="capitalize">{component}</span>
              </div>
            ))}
          </div>
          
          {status.errors.length > 0 && (
            <div className="mt-3">
              <h5 className="text-sm font-medium text-red-600 mb-1">Errores detectados:</h5>
              <ul className="text-xs text-red-600 space-y-1">
                {status.errors.map((error, index) => (
                  <li key={index}>• {error}</li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      {/* Botón para verificación manual */}
      <button
        onClick={async () => {
          setIsLoading(true);
          const checker = HealthChecker.getInstance();
          const newStatus = await checker.performHealthCheck();
          setStatus(newStatus);
          setLastUpdate(new Date());
          setIsLoading(false);
        }}
        className="text-xs text-blue-600 hover:text-blue-800 underline"
        disabled={isLoading}
      >
        {isLoading ? 'Verificando...' : 'Verificar ahora'}
      </button>
    </div>
  );
}
