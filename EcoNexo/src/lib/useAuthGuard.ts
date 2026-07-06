"use client";
import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth';
import { useRouter } from 'next/navigation';

interface UseAuthGuardOptions {
  redirectTo?: string;
  requireAuth?: boolean;
  onUnauthorized?: () => void;
}

export function useAuthGuard(options: UseAuthGuardOptions = {}) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  
  const {
    redirectTo = '/',
    requireAuth = true,
    onUnauthorized
  } = options;

  useEffect(() => {
    if (loading) {
      setIsAuthorized(false);
      return;
    }

    if (requireAuth && !user) {
      setIsAuthorized(false);
      if (onUnauthorized) {
        onUnauthorized();
      } else {
        router.push(redirectTo);
      }
    } else {
      setIsAuthorized(true);
    }
  }, [user, loading, requireAuth, redirectTo, onUnauthorized, router]);

  return {
    isAuthorized,
    isLoading: loading,
    user,
    isAuthenticated: !!user
  };
}

// Hook específico para páginas que requieren autenticación
export function useRequireAuth(redirectTo: string = '/') {
  return useAuthGuard({ 
    requireAuth: true, 
    redirectTo,
    onUnauthorized: () => {
      // Mostrar mensaje o modal de login
      console.log('Authentication required');
    }
  });
}

// Hook para páginas que son mejores con autenticación pero no la requieren
export function useOptionalAuth() {
  return useAuthGuard({ 
    requireAuth: false 
  });
}
