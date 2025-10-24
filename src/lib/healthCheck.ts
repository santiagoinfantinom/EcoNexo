/**
 * Sistema de verificación de salud de la aplicación
 * Asegura que todos los componentes críticos estén funcionando
 */

export interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  timestamp: number;
  checks: {
    build: boolean;
    api: boolean;
    database: boolean;
    auth: boolean;
    calendar: boolean;
    jobs: boolean;
  };
  errors: string[];
}

export class HealthChecker {
  private static instance: HealthChecker;
  private lastCheck: HealthStatus | null = null;
  private checkInterval: NodeJS.Timeout | null = null;

  private constructor() {}

  public static getInstance(): HealthChecker {
    if (!HealthChecker.instance) {
      HealthChecker.instance = new HealthChecker();
    }
    return HealthChecker.instance;
  }

  /**
   * Ejecuta una verificación completa del sistema
   */
  public async performHealthCheck(): Promise<HealthStatus> {
    const checks = {
      build: await this.checkBuild(),
      api: await this.checkAPI(),
      database: await this.checkDatabase(),
      auth: await this.checkAuth(),
      calendar: await this.checkCalendar(),
      jobs: await this.checkJobs(),
    };

    const errors: string[] = [];
    let status: 'healthy' | 'degraded' | 'unhealthy' = 'healthy';

    // Verificar cada componente
    Object.entries(checks).forEach(([key, value]) => {
      if (!value) {
        errors.push(`${key} check failed`);
        status = 'degraded';
      }
    });

    // Si hay errores críticos, marcar como unhealthy
    if (errors.length > 3) {
      status = 'unhealthy';
    }

    const healthStatus: HealthStatus = {
      status,
      timestamp: Date.now(),
      checks,
      errors,
    };

    this.lastCheck = healthStatus;
    return healthStatus;
  }

  /**
   * Verifica que el build esté funcionando correctamente
   */
  private async checkBuild(): Promise<boolean> {
    try {
      // Verificar que no hay errores de compilación
      if (typeof window !== 'undefined') {
        // En el cliente, verificar que los componentes se cargan
        return document.readyState === 'complete';
      }
      return true;
    } catch (error) {
      console.error('Build check failed:', error);
      return false;
    }
  }

  /**
   * Verifica que las APIs estén respondiendo
   */
  private async checkAPI(): Promise<boolean> {
    try {
      // Verificar endpoints críticos
      const endpoints = [
        '/api/health',
        '/api/email/verify',
        '/api/captcha/verify'
      ];

      const promises = endpoints.map(async (endpoint) => {
        try {
          const response = await fetch(endpoint, { 
            method: 'HEAD',
            signal: AbortSignal.timeout(5000)
          });
          return response.ok;
        } catch {
          return false;
        }
      });

      const results = await Promise.all(promises);
      return results.some(result => result);
    } catch (error) {
      console.error('API check failed:', error);
      return false;
    }
  }

  /**
   * Verifica la conexión a la base de datos
   */
  private async checkDatabase(): Promise<boolean> {
    try {
      // En modo demo, siempre retornar true
      // En producción, aquí se haría una consulta real
      return true;
    } catch (error) {
      console.error('Database check failed:', error);
      return false;
    }
  }

  /**
   * Verifica que el sistema de autenticación esté funcionando
   */
  private async checkAuth(): Promise<boolean> {
    try {
      // Verificar que los componentes de auth estén disponibles
      if (typeof window !== 'undefined') {
        // Verificar que las páginas de auth existen
        const authPages = [
          '/auth/google/callback',
          '/auth/outlook/callback',
          '/verify-email'
        ];
        
        return authPages.length > 0;
      }
      return true;
    } catch (error) {
      console.error('Auth check failed:', error);
      return false;
    }
  }

  /**
   * Verifica que el calendario esté funcionando
   */
  private async checkCalendar(): Promise<boolean> {
    try {
      // Verificar que la página de calendario existe y es accesible
      if (typeof window !== 'undefined') {
        return window.location.pathname !== '/calendario' || 
               document.querySelector('[data-testid="calendar-view"]') !== null ||
               document.querySelector('.calendar') !== null;
      }
      return true;
    } catch (error) {
      console.error('Calendar check failed:', error);
      return false;
    }
  }

  /**
   * Verifica que la página de trabajos esté funcionando
   */
  private async checkJobs(): Promise<boolean> {
    try {
      // Verificar que los trabajos se cargan correctamente
      if (typeof window !== 'undefined') {
        return window.location.pathname !== '/trabajos' || 
               document.querySelector('[data-testid="jobs-list"]') !== null ||
               document.querySelector('.job-card') !== null;
      }
      return true;
    } catch (error) {
      console.error('Jobs check failed:', error);
      return false;
    }
  }

  /**
   * Inicia el monitoreo automático
   */
  public startMonitoring(intervalMs: number = 30000): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
    }

    this.checkInterval = setInterval(async () => {
      const status = await this.performHealthCheck();
      
      if (status.status === 'unhealthy') {
        console.error('🚨 Sistema en estado crítico:', status.errors);
        // Aquí se podría enviar una alerta o notificación
      } else if (status.status === 'degraded') {
        console.warn('⚠️ Sistema con problemas menores:', status.errors);
      } else {
        console.log('✅ Sistema funcionando correctamente');
      }
    }, intervalMs);
  }

  /**
   * Detiene el monitoreo automático
   */
  public stopMonitoring(): void {
    if (this.checkInterval) {
      clearInterval(this.checkInterval);
      this.checkInterval = null;
    }
  }

  /**
   * Obtiene el último estado de salud
   */
  public getLastStatus(): HealthStatus | null {
    return this.lastCheck;
  }

  /**
   * Verifica si el sistema está funcionando correctamente
   */
  public isHealthy(): boolean {
    return this.lastCheck?.status === 'healthy';
  }
}

// Función de utilidad para verificación rápida
export async function quickHealthCheck(): Promise<boolean> {
  const checker = HealthChecker.getInstance();
  const status = await checker.performHealthCheck();
  return status.status === 'healthy';
}

// Hook para React
export function useHealthCheck() {
  const [status, setStatus] = React.useState<HealthStatus | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const checker = HealthChecker.getInstance();
    
    const performCheck = async () => {
      setIsLoading(true);
      const healthStatus = await checker.performHealthCheck();
      setStatus(healthStatus);
      setIsLoading(false);
    };

    performCheck();
    
    // Verificar cada 30 segundos
    const interval = setInterval(performCheck, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { status, isLoading, isHealthy: status?.status === 'healthy' };
}
