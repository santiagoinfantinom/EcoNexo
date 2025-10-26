import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');
    const error = request.nextUrl.searchParams.get('error');

    if (error) {
      return NextResponse.json(
        { success: false, error },
        { status: 400 }
      );
    }

    if (!code || !state) {
      return NextResponse.json(
        { success: false, error: 'Missing code or state' },
        { status: 400 }
      );
    }

    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    const redirectUri = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/google/callback`;

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId || '',
        client_secret: clientSecret || '',
        code,
        grant_type: 'authorization_code',
        redirect_uri: redirectUri,
      }),
    });

    const tokens = await tokenResponse.json();
    
    if (tokens.error) {
      return NextResponse.json(
        { success: false, error: tokens.error_description || 'Error al obtener tokens' },
        { status: 400 }
      );
    }

    // Get user info from Google
    const userResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    const userInfo = await userResponse.json();
    
    console.log('🔍 User info from Google:', userInfo);
    
    // Try to get more detailed info from People API if available
    let detailedInfo = {};
    try {
      const peopleResponse = await fetch('https://people.googleapis.com/v1/people/me?personFields=names,emailAddresses,photos', {
        headers: {
          Authorization: `Bearer ${tokens.access_token}`,
        },
      });
      if (peopleResponse.ok) {
        detailedInfo = await peopleResponse.json();
        console.log('📋 Detailed info from People API:', detailedInfo);
      }
    } catch (err) {
      console.log('⚠️ People API not available, using basic info');
    }

    // Extract first and last name from Google profile
    let fullName = userInfo.name || '';
    let givenName = userInfo.given_name || '';
    let familyName = userInfo.family_name || '';
    
    // Try to get detailed info from People API
    if (detailedInfo.names && detailedInfo.names.length > 0) {
      const primaryName = detailedInfo.names.find((n: any) => n.metadata?.primary) || detailedInfo.names[0];
      fullName = primaryName.displayName || fullName;
      givenName = primaryName.givenName || givenName;
      familyName = primaryName.familyName || familyName;
    }
    
    // Split full name if given/family names are not available
    let firstName = givenName;
    let lastName = familyName;
    
    if (!firstName && !lastName && fullName) {
      const nameParts = fullName.trim().split(' ');
      if (nameParts.length > 0) {
        firstName = nameParts[0];
        lastName = nameParts.slice(1).join(' ');
      }
    }

    // Return user data
    return NextResponse.json({
      success: true,
      user: {
        id: userInfo.id,
        email: userInfo.email,
        name: userInfo.name,
        given_name: firstName,
        family_name: lastName,
        picture: userInfo.picture,
        provider: 'google',
        locale: userInfo.locale,
        verified_email: userInfo.verified_email,
      },
    });
  } catch (error) {
    console.error('Google OAuth callback error:', error);
    return NextResponse.json(
      { success: false, error: 'Error al procesar autenticación con Google' },
      { status: 500 }
    );
  }
}

