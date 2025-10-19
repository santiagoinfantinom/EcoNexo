import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// Rutas que requieren autenticación
const protectedRoutes = [
  '/perfil',
  '/admin',
  '/mis-eventos',
  '/mis-trabajos'
];

// Rutas que son públicas pero pueden beneficiarse de autenticación
const optionalAuthRoutes = [
  '/eventos',
  '/trabajos',
  '/chat'
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Verificar si la ruta requiere autenticación
  const isProtectedRoute = protectedRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  const isOptionalAuthRoute = optionalAuthRoutes.some(route => 
    pathname.startsWith(route)
  );
  
  // Si es una ruta protegida, verificar autenticación
  if (isProtectedRoute) {
    // En una implementación real, aquí verificarías el token JWT
    // Por ahora, simplemente permitimos el acceso ya que la autenticación
    // se maneja en el cliente con Supabase
    
    // Opcional: Redirigir a login si no hay token
    // const token = request.cookies.get('auth-token');
    // if (!token) {
    //   return NextResponse.redirect(new URL('/login', request.url));
    // }
  }
  
  // Agregar headers para indicar el estado de autenticación
  const response = NextResponse.next();
  
  if (isProtectedRoute) {
    response.headers.set('x-requires-auth', 'true');
  } else if (isOptionalAuthRoute) {
    response.headers.set('x-optional-auth', 'true');
  }
  
  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!api|_next/static|_next/image|favicon.ico|public).*)',
  ],
};
