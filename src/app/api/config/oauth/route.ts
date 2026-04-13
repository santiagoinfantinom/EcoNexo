import { NextResponse } from 'next/server';

// Fallback Client ID - usar el valor real de Google Cloud Console
const FALLBACK_GOOGLE_CLIENT_ID = 'demo-client-id';

export async function GET() {
  // Try to get from environment variable first
  let googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
  let githubClientId: string | null = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID || null;
  
  // If not available, use fallback
  if (!googleClientId || googleClientId === 'demo-client-id' || googleClientId === 'your_google_client_id_here') {
    console.warn('⚠️ NEXT_PUBLIC_GOOGLE_CLIENT_ID not found in env, using fallback');
    googleClientId = FALLBACK_GOOGLE_CLIENT_ID;
  }
  if (!githubClientId || githubClientId === 'demo-client-id' || githubClientId === 'your_github_client_id_here') {
    githubClientId = null;
  }
  
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://econexo.app';
  
  console.log('🔍 API Config OAuth:', {
    googleClientId: googleClientId ? 'CONFIGURED' : 'NOT CONFIGURED',
    googleClientIdSource: process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ? 'ENV_VAR' : 'FALLBACK',
    googleClientIdValue: googleClientId ? `${googleClientId.substring(0, 30)}...` : 'null',
    githubClientId: githubClientId ? 'CONFIGURED' : 'NOT CONFIGURED',
    siteUrl,
  });
  
  return NextResponse.json({
    googleClientId: googleClientId || null,
    githubClientId: githubClientId || null,
    siteUrl,
    configured: !!googleClientId,
  });
}

// Force dynamic rendering
export const dynamic = 'force-dynamic';
export const revalidate = 0;

