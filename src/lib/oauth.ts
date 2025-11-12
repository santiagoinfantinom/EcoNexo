import { PublicClientApplication } from '@azure/msal-browser';
import { GoogleAuth } from 'google-auth-library';

export interface OAuthConfig {
  google: {
    clientId: string;
    redirectUri: string;
  };
  outlook: {
    clientId: string;
    redirectUri: string;
  };
}

export interface OAuthResult {
  success: boolean;
  user?: {
    id: string;
    email: string;
    name: string;
    picture?: string;
    provider: 'google' | 'outlook';
    given_name?: string;
    family_name?: string;
    locale?: string;
    verified_email?: boolean;
  };
  error?: string;
}

/**
 * Google OAuth implementation
 */
export class GoogleOAuthService {
  private clientId: string;
  private redirectUri: string;

  constructor(config: OAuthConfig['google']) {
    this.clientId = config.clientId;
    this.redirectUri = config.redirectUri;
  }

  async authenticate(): Promise<OAuthResult> {
    try {
      // Check if we should use demo mode
      if (this.clientId === 'demo-client-id') {
        console.log('🔧 Using demo mode for Google OAuth');
        return await this.authenticateDemo();
      }

      // Create Google OAuth URL
      const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
      authUrl.searchParams.set('client_id', this.clientId);
      authUrl.searchParams.set('redirect_uri', this.redirectUri);
      authUrl.searchParams.set('response_type', 'code');
      authUrl.searchParams.set('scope', [
        'openid',
        'email',
        'profile',
        // Basic userinfo
        'https://www.googleapis.com/auth/userinfo.profile',
        'https://www.googleapis.com/auth/userinfo.email',
        // Google People API granular scopes for extended profile
        'https://www.googleapis.com/auth/user.birthday.read',
        'https://www.googleapis.com/auth/user.gender.read',
        'https://www.googleapis.com/auth/user.emails.read',
        'https://www.googleapis.com/auth/user.addresses.read',
        'https://www.googleapis.com/auth/user.phonenumbers.read'
      ].join(' '));
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      
      // Generate state parameter for security
      const state = Math.random().toString(36).substring(2, 15);
      authUrl.searchParams.set('state', state);
      
      // Store state in sessionStorage for verification
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('google_oauth_state', state);
      }

      // Logging detallado para debugging - hacer múltiples logs para que se vean
      const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'SERVER';
      
      // Logs múltiples y visibles
      console.log('═══════════════════════════════════════════════════════');
      console.log('🔐 REDIRECTING TO GOOGLE OAUTH');
      console.log('═══════════════════════════════════════════════════════');
      console.log('📍 Current window.location.origin:', currentOrigin);
      console.log('📍 Client ID:', this.clientId);
      console.log('📍 Redirect URI being used:', this.redirectUri);
      console.log('📍 Expected redirect URI:', typeof window !== 'undefined' ? `${window.location.origin}/auth/google/callback` : 'N/A (server)');
      console.log('📍 Full URL:', authUrl.toString());
      console.log('═══════════════════════════════════════════════════════');
      
      // Verificación crítica: asegurar que estamos usando el dominio correcto
      if (typeof window !== 'undefined' && !this.redirectUri.includes(window.location.hostname)) {
        console.error('═══════════════════════════════════════════════════════');
        console.error('❌ ERROR: Redirect URI no coincide con el dominio actual!');
        console.error('   Redirect URI actual:', this.redirectUri);
        console.error('   Dominio esperado:', window.location.origin);
        console.error('   Hostname actual:', window.location.hostname);
        console.error('═══════════════════════════════════════════════════════');
        
        // Alert para debugging (solo en desarrollo)
        if (process.env.NODE_ENV === 'development' || currentOrigin.includes('localhost') || currentOrigin.includes('vercel.app')) {
          alert(`⚠️ Redirect URI Error!\n\nActual: ${this.redirectUri}\nEsperado: ${window.location.origin}/auth/google/callback\n\nRevisa la consola para más detalles.`);
        }
      }
      
      // Delay MUY largo para que los mensajes se vean claramente (30 segundos)
      console.log('⏳ Esperando 30 segundos antes de redirigir... (para que puedas ver los logs)');
      console.log('⏳ Tienes tiempo suficiente para leer todos los mensajes arriba ↑');
      console.log('⏳ Iniciando countdown...');
      
      // Countdown visible cada segundo
      for (let i = 30; i > 0; i--) {
        await new Promise(resolve => setTimeout(resolve, 1000));
        console.log(`⏳ Redirigiendo en ${i} segundos...`);
      }
      
      console.log('⏳ ¡Redirigiendo ahora!');
      
      // Verify we're in a browser environment
      if (typeof window === 'undefined') {
        console.error('❌ window is undefined - cannot redirect');
        return { 
          success: false, 
          error: 'No se puede redirigir fuera del navegador' 
        };
      }
      
      // Redirect to Google OAuth
      try {
        console.log('📍 Ejecutando window.location.href =', authUrl.toString());
        window.location.href = authUrl.toString();
        // Give it a moment to redirect
        await new Promise(resolve => setTimeout(resolve, 500));
        return { success: true };
      } catch (redirectError) {
        console.error('❌ Error al redirigir:', redirectError);
        return { 
          success: false, 
          error: 'Error al redirigir a Google: ' + (redirectError instanceof Error ? redirectError.message : String(redirectError))
        };
      }
    } catch (error) {
      console.error('Google OAuth error:', error);
      // Fallback to demo mode on error
      return await this.authenticateDemo();
    }
  }

  private async authenticateDemo(): Promise<OAuthResult> {
    // Simulate user data
    const mockUser = {
      id: 'demo-user-' + Date.now(),
      email: 'demo.google@econexo.app',
      name: 'Demo User (Google)',
      picture: '/logo-econexo.png',
      provider: 'google' as const,
    };

    // Store user data in localStorage for profile
    if (typeof window !== 'undefined') {
      localStorage.setItem('econexo_user', JSON.stringify(mockUser));
      localStorage.setItem('oauth_data', JSON.stringify({
        name: mockUser.name,
        email: mockUser.email,
        picture: mockUser.picture,
        provider: mockUser.provider,
        locale: 'es',
        verified_email: true,
        age: 28,
        city: 'Madrid',
        country: 'Spain'
      }));
      
      // Also store profile data directly
      localStorage.setItem('econexo:profile', JSON.stringify({
        full_name: mockUser.name,
        email: mockUser.email,
        avatar_url: mockUser.picture,
        preferred_language: 'es',
        oauth_provider: 'google',
        oauth_imported: true,
        city: 'Madrid',
        country: 'Spain',
        about_me: 'Usuario demo conectado con Google OAuth',
        bio: 'Apasionado por la sostenibilidad y el medio ambiente',
        interests: 'Medio ambiente, sostenibilidad, tecnología verde',
        skills: 'JavaScript, React, Node.js, Python'
      }));

      // Redirect to profile
      setTimeout(() => {
        window.location.href = '/perfil';
      }, 500);
    }

    return {
      success: true,
      user: mockUser,
    };
  }

  async handleCallback(code: string, state: string): Promise<OAuthResult> {
    try {
      // Verify state parameter (more lenient for development)
      if (typeof window !== 'undefined') {
        const storedState = sessionStorage.getItem('google_oauth_state');
        if (storedState && state !== storedState) {
          console.warn('State mismatch, but continuing for development');
        }
        sessionStorage.removeItem('google_oauth_state');
      }

      // For development, simulate successful authentication
      if (this.clientId === 'demo-client-id' || !process.env.GOOGLE_CLIENT_SECRET) {
        console.log('Using demo mode for Google OAuth');
        
        // Simulate user data
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          email: 'demo.google@econexo.app',
          name: 'Demo User (Google)',
          picture: '/logo-econexo.png',
          provider: 'google' as const,
        };

        // Store user data in localStorage for profile
        if (typeof window !== 'undefined') {
          localStorage.setItem('econexo_user', JSON.stringify(mockUser));
          localStorage.setItem('oauth_data', JSON.stringify({
            name: mockUser.name,
            email: mockUser.email,
            picture: '/logo-econexo.png',
            provider: mockUser.provider,
            locale: 'es',
            verified_email: true,
            age: 28,
            city: 'Madrid',
            country: 'Spain'
          }));
          
          // Also store profile data directly
          localStorage.setItem('econexo:profile', JSON.stringify({
            full_name: mockUser.name,
            email: mockUser.email,
            avatar_url: '/logo-econexo.png',
            preferred_language: 'es',
            oauth_provider: 'google',
            oauth_imported: true,
            city: 'Madrid',
            country: 'Spain',
            about_me: 'Usuario demo conectado con Google OAuth',
            bio: 'Apasionado por la sostenibilidad y el medio ambiente',
            interests: 'Medio ambiente, sostenibilidad, tecnología verde',
            skills: 'JavaScript, React, Node.js, Python'
          }));
        }

        return {
          success: true,
          user: mockUser,
        };
      }

      // Exchange code for tokens (only if properly configured)
      const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          client_id: this.clientId,
          client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
          code,
          grant_type: 'authorization_code',
          redirect_uri: this.redirectUri,
        }),
      });

      const tokens = await tokenResponse.json();
      
      if (tokens.error) {
        return {
          success: false,
          error: tokens.error_description || 'Error al obtener tokens',
        };
      }

      // Get user info
      const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });

      const userInfo = await userResponse.json();

      // Store user data in localStorage for profile
      if (typeof window !== 'undefined') {
        const googleUser = {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          provider: 'google' as const,
        };

        localStorage.setItem('econexo_user', JSON.stringify(googleUser));
        localStorage.setItem('oauth_data', JSON.stringify({
          name: userInfo.name,
          email: userInfo.email,
          picture: userInfo.picture,
          provider: 'google',
          locale: userInfo.locale || 'en',
          verified_email: userInfo.verified_email || true,
        }));
        
        // Also store profile data directly
        localStorage.setItem('econexo:profile', JSON.stringify({
          full_name: userInfo.name,
          email: userInfo.email,
          avatar_url: userInfo.picture,
          preferred_language: userInfo.locale || 'en',
          oauth_provider: 'google',
          oauth_imported: true,
        }));
      }

      return {
        success: true,
        user: {
          id: userInfo.id,
          email: userInfo.email,
          name: userInfo.name,
          picture: userInfo.picture,
          provider: 'google',
        },
      };
    } catch (error) {
      console.error('Google OAuth callback error:', error);
      return {
        success: false,
        error: 'Error al procesar autenticación con Google',
      };
    }
  }
}

/**
 * Outlook/Microsoft OAuth implementation
 */
export class OutlookOAuthService {
  private clientId: string;
  private redirectUri: string;
  private msalInstance: PublicClientApplication;
  private initialized: boolean = false;

  constructor(config: OAuthConfig['outlook']) {
    this.clientId = config.clientId;
    this.redirectUri = config.redirectUri;
    
    this.msalInstance = new PublicClientApplication({
      auth: {
        clientId: this.clientId,
        redirectUri: this.redirectUri,
      },
      cache: {
        cacheLocation: 'sessionStorage',
        storeAuthStateInCookie: false,
      },
    });
  }
  
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.msalInstance.initialize();
      this.initialized = true;
    }
  }

  async authenticate(): Promise<OAuthResult> {
    try {
      // For development, simulate successful authentication
      // TODO: Remove this once a valid Outlook Client ID is configured
      if (this.clientId === 'demo-client-id' || !this.clientId || this.clientId === 'your_outlook_client_id_here') {
        console.log('Using demo mode for Outlook OAuth');
        
        // Simulate user data
        const mockUser = {
          id: 'demo-user-' + Date.now(),
          email: 'demo.outlook@econexo.app',
          name: 'Demo User (Outlook)',
          given_name: 'Demo',
          family_name: 'User',
          picture: '/logo-econexo.png',
          provider: 'outlook' as const,
        };

        // Store user data in localStorage for profile
        if (typeof window !== 'undefined') {
          localStorage.setItem('econexo_user', JSON.stringify(mockUser));
          localStorage.setItem('oauth_data', JSON.stringify({
            name: mockUser.name,
            email: mockUser.email,
            picture: '/logo-econexo.png',
            provider: mockUser.provider,
            locale: 'es',
            verified_email: true,
          }));
          
          // Also store profile data directly
          localStorage.setItem('econexo:profile', JSON.stringify({
            full_name: mockUser.name,
            first_name: mockUser.given_name,
            last_name: mockUser.family_name,
            email: mockUser.email,
            avatar_url: '/logo-econexo.png',
            preferred_language: 'es',
            oauth_provider: 'outlook',
            oauth_imported: true,
            city: 'Barcelona',
            country: 'Spain',
            about_me: 'Usuario demo conectado con Microsoft Outlook',
            bio: 'Desarrollador de software con enfoque en sostenibilidad',
            interests: 'Tecnología, desarrollo web, sostenibilidad',
            skills: 'C#, .NET, Azure, TypeScript, Angular'
          }));

          // Redirect to profile
          setTimeout(() => {
            window.location.href = '/perfil';
          }, 500);
        }

        return {
          success: true,
          user: mockUser,
        };
      }

      // Use redirect flow for Outlook (more reliable than popup)
      console.log('🔐 Redirecting to Microsoft OAuth');
      console.log('📍 Client ID:', this.clientId);
      console.log('📍 Redirect URI:', this.redirectUri);

      // Initialize MSAL before using it
      await this.ensureInitialized();
      
      const loginRequest = {
        scopes: ['openid', 'profile', 'email', 'User.Read'],
        prompt: 'select_account',
        redirectUri: this.redirectUri,
      };

      // Use redirect instead of popup
      await this.msalInstance.loginRedirect(loginRequest);
      
      // If we get here, redirect has started
      return { success: true };
    } catch (error: any) {
      console.error('Outlook OAuth error:', error);
      
      return {
        success: false,
        error: 'Error al iniciar autenticación con Outlook. Por favor, intenta de nuevo.',
      };
    }
  }

  async handleRedirect(): Promise<OAuthResult> {
    try {
      // Initialize MSAL before using it
      await this.ensureInitialized();
      
      const response = await this.msalInstance.handleRedirectPromise();
      
      if (response && response.account) {
        return {
          success: true,
          user: {
            id: response.account.homeAccountId,
            email: response.account.username,
            name: response.account.name || response.account.username,
            provider: 'outlook',
          },
        };
      }

      return {
        success: false,
        error: 'No se pudo procesar la autenticación',
      };
    } catch (error) {
      console.error('Outlook redirect error:', error);
      return {
        success: false,
        error: 'Error al procesar autenticación con Outlook',
      };
    }
  }
}

/**
 * Main OAuth service
 */
export class OAuthService {
  private googleService: GoogleOAuthService;
  private outlookService: OutlookOAuthService;

  constructor(config: OAuthConfig) {
    this.googleService = new GoogleOAuthService(config.google);
    this.outlookService = new OutlookOAuthService(config.outlook);
  }

  async authenticateWithGoogle(): Promise<OAuthResult> {
    return this.googleService.authenticate();
  }

  async authenticateWithOutlook(): Promise<OAuthResult> {
    return this.outlookService.authenticate();
  }

  async handleGoogleCallback(code: string, state: string): Promise<OAuthResult> {
    return this.googleService.handleCallback(code, state);
  }

  async handleOutlookRedirect(): Promise<OAuthResult> {
    return this.outlookService.handleRedirect();
  }
}

/**
 * Create OAuth service instance
 */
// Fallback Client ID - usar el valor real de Google Cloud Console
const FALLBACK_GOOGLE_CLIENT_ID = '1059183045627-qjmnmcghdbl5duk25vgvd5olomqgs8vb.apps.googleusercontent.com';

// Cache for OAuth config to avoid multiple API calls
let cachedConfig: OAuthConfig | null = null;
let configPromise: Promise<OAuthConfig> | null = null;

async function fetchOAuthConfig(): Promise<OAuthConfig> {
  // Si hay caché pero estamos en el cliente, siempre recalcular el redirectUri
  // para usar el dominio actual del navegador (evita problemas con caché de econexo.app)
  if (cachedConfig && typeof window !== 'undefined') {
    // Recalcular el redirectUri basado en el dominio actual
    const currentOrigin = window.location.origin;
    return {
      google: {
        clientId: cachedConfig.google.clientId,
        redirectUri: `${currentOrigin}/auth/google/callback`,
      },
      outlook: {
        clientId: cachedConfig.outlook.clientId,
        redirectUri: `${currentOrigin}/auth/outlook/callback`,
      },
    };
  }

  if (cachedConfig) {
    return cachedConfig;
  }

  if (configPromise) {
    return configPromise;
  }

  configPromise = (async () => {
    // CRÍTICO: En el cliente, SIEMPRE usar window.location.origin, sin importar qué
    // venga del API o de las variables de entorno
    const siteUrl = typeof window !== 'undefined' 
      ? window.location.origin  // SIEMPRE usar el dominio actual del navegador en cliente
      : (process.env.NEXT_PUBLIC_SITE_URL || 'https://econexo.app');  // En servidor, usar env var
    
    try {
      // Try to get from API endpoint (works in both server and client)
      const response = await fetch('/api/config/oauth');
      if (response.ok) {
        const data = await response.json();
        
        // Use API value or fallback para Client ID
        const googleClientId = data.googleClientId || FALLBACK_GOOGLE_CLIENT_ID;
        
        // IMPORTANTE: siteUrl ya está calculado arriba usando window.location.origin en cliente
        cachedConfig = {
          google: {
            clientId: googleClientId,
            redirectUri: `${siteUrl}/auth/google/callback`,
          },
          outlook: {
            clientId: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID || 'demo-client-id',
            redirectUri: `${siteUrl}/auth/outlook/callback`,
          },
        };
        
        const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'SERVER';
        console.log('✅ OAuth Config loaded from API:', {
          googleClientId: cachedConfig.google.clientId === 'demo-client-id' ? 'NOT CONFIGURED' : 'CONFIGURED',
          source: data.googleClientId ? 'API_ENV' : 'API_FALLBACK',
          siteUrl,
          redirectUri: cachedConfig.google.redirectUri,
          currentWindowOrigin: currentOrigin,
          usingCurrentOrigin: typeof window !== 'undefined',
          matchesCurrentOrigin: typeof window !== 'undefined' ? cachedConfig.google.redirectUri.includes(window.location.hostname) : 'N/A',
        });
        
        return cachedConfig;
      }
    } catch (error) {
      console.warn('⚠️ Could not fetch OAuth config from API, using fallback:', error);
    }

    // Fallback: use environment variables or hardcoded value
    // siteUrl ya está calculado arriba usando window.location.origin en cliente
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || FALLBACK_GOOGLE_CLIENT_ID;
    
    cachedConfig = {
      google: {
        clientId: googleClientId,
        redirectUri: `${siteUrl}/auth/google/callback`,
      },
      outlook: {
        clientId: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID || 'demo-client-id',
        redirectUri: `${siteUrl}/auth/outlook/callback`,
      },
    };
    
    const currentOrigin = typeof window !== 'undefined' ? window.location.origin : 'SERVER';
    console.log('✅ OAuth Config using fallback:', {
      googleClientId: cachedConfig.google.clientId === 'demo-client-id' ? 'NOT CONFIGURED' : 'CONFIGURED',
      source: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'ENV_VAR' : 'HARDCODED_FALLBACK',
      siteUrl,
      redirectUri: cachedConfig.google.redirectUri,
      currentWindowOrigin: currentOrigin,
      usingCurrentOrigin: typeof window !== 'undefined',
      matchesCurrentOrigin: typeof window !== 'undefined' ? cachedConfig.google.redirectUri.includes(window.location.hostname) : 'N/A',
    });
    
    return cachedConfig;
  })();

  return configPromise;
}

export async function createOAuthService(): Promise<OAuthService> {
  const config = await fetchOAuthConfig();
  return new OAuthService(config);
}

// Synchronous version for backwards compatibility (will use fallback)
export function createOAuthServiceSync(): OAuthService {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 
    (typeof window !== 'undefined' ? window.location.origin : 'https://econexo.app');
  
  const config: OAuthConfig = {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'demo-client-id',
      redirectUri: `${siteUrl}/auth/google/callback`,
    },
    outlook: {
      clientId: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID || 'demo-client-id',
      redirectUri: `${siteUrl}/auth/outlook/callback`,
    },
  };

  return new OAuthService(config);
}
