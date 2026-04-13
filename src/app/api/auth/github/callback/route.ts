import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const code = request.nextUrl.searchParams.get('code');
    const state = request.nextUrl.searchParams.get('state');

    if (!code || !state) {
      return NextResponse.json({ success: false, error: 'Missing code or state' }, { status: 400 });
    }

    const clientId = process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID;
    const clientSecret = process.env.GITHUB_CLIENT_SECRET;

    if (!clientId || !clientSecret) {
      return NextResponse.json(
        { success: false, error: 'GitHub OAuth not configured in environment variables' },
        { status: 500 }
      );
    }

    const origin = request.nextUrl.origin || process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    const redirectUri = `${origin}/auth/github/callback`;

    const tokenRes = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        client_id: clientId,
        client_secret: clientSecret,
        code,
        redirect_uri: redirectUri,
      }),
    });

    const tokenData = await tokenRes.json();
    if (!tokenRes.ok || tokenData.error || !tokenData.access_token) {
      return NextResponse.json(
        { success: false, error: tokenData.error_description || tokenData.error || 'Failed to fetch GitHub token' },
        { status: 400 }
      );
    }

    const accessToken = tokenData.access_token as string;

    const userRes = await fetch('https://api.github.com/user', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });
    const userData = await userRes.json();
    if (!userRes.ok) {
      return NextResponse.json({ success: false, error: 'Failed to fetch GitHub user' }, { status: 400 });
    }

    const emailsRes = await fetch('https://api.github.com/user/emails', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        Accept: 'application/vnd.github+json',
      },
    });
    const emailsData = emailsRes.ok ? await emailsRes.json() : [];
    const primaryEmailObj =
      Array.isArray(emailsData)
        ? emailsData.find((e: any) => e.primary && e.verified) ||
          emailsData.find((e: any) => e.primary) ||
          emailsData.find((e: any) => e.verified)
        : null;

    const email = userData.email || primaryEmailObj?.email || '';
    const fullName = userData.name || userData.login || '';
    const [firstName, ...rest] = fullName.split(' ').filter(Boolean);

    return NextResponse.json({
      success: true,
      user: {
        id: String(userData.id),
        email,
        name: fullName,
        given_name: firstName || '',
        family_name: rest.join(' '),
        picture: userData.avatar_url || '',
        provider: 'github',
        locale: 'en',
        verified_email: !!primaryEmailObj?.verified,
      },
    });
  } catch (error) {
    console.error('GitHub OAuth callback error:', error);
    return NextResponse.json({ success: false, error: 'Error processing GitHub OAuth' }, { status: 500 });
  }
}
