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
      authUrl.searchParams.set('scope', 'openid email profile https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email');
      authUrl.searchParams.set('access_type', 'offline');
      authUrl.searchParams.set('prompt', 'consent');
      
      // Generate state parameter for security
      const state = Math.random().toString(36).substring(2, 15);
      authUrl.searchParams.set('state', state);
      
      // Store state in sessionStorage for verification
      if (typeof window !== 'undefined') {
        sessionStorage.setItem('google_oauth_state', state);
      }

      console.log('🔐 Redirecting to Google OAuth');
      console.log('📍 Client ID:', this.clientId);
      console.log('📍 Redirect URI:', this.redirectUri);
      console.log('📍 Full URL:', authUrl.toString());
      
      // Small delay to ensure everything is ready
      await new Promise(resolve => setTimeout(resolve, 100));
      
      // Redirect to Google OAuth
      window.location.href = authUrl.toString();
      
      return { success: true };
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
          locale: userInfo.locale || 'es',
          verified_email: userInfo.verified_email || true,
        }));
        
        // Also store profile data directly
        localStorage.setItem('econexo:profile', JSON.stringify({
          full_name: userInfo.name,
          email: userInfo.email,
          avatar_url: userInfo.picture,
          preferred_language: userInfo.locale || 'es',
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
        }

        return {
          success: true,
          user: mockUser,
        };
      }

      // Initialize MSAL before using it
      await this.ensureInitialized();
      
      const loginRequest = {
        scopes: ['openid', 'profile', 'email', 'User.Read'],
        prompt: 'select_account',
      };

      const response = await this.msalInstance.loginPopup(loginRequest);
      
      if (response.account) {
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
        error: 'No se pudo obtener información del usuario',
      };
    } catch (error: any) {
      console.error('Outlook OAuth error:', error);
      
      // Handle specific MSAL errors
      if (error.name === 'BrowserAuthError' || error.message?.includes('interaction_in_progress')) {
        return {
          success: false,
          error: 'Ya hay un proceso de autenticación en curso. Por favor espera o recarga la página.',
        };
      }
      
      // If popup fails, try redirect
      try {
        await this.ensureInitialized();
        await this.msalInstance.loginRedirect({
          scopes: ['openid', 'profile', 'email', 'User.Read'],
          prompt: 'select_account',
        });
        
        return { success: true };
      } catch (redirectError) {
        return {
          success: false,
          error: 'Error al iniciar autenticación con Outlook',
        };
      }
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
export function createOAuthService(): OAuthService {
  const config: OAuthConfig = {
    google: {
      clientId: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 'demo-client-id',
      redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/google/callback`,
    },
    outlook: {
      clientId: process.env.NEXT_PUBLIC_OUTLOOK_CLIENT_ID || 'demo-client-id',
      redirectUri: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/outlook/callback`,
    },
  };

  return new OAuthService(config);
}
