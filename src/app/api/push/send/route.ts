import { NextRequest, NextResponse } from 'next/server';
// import webpush from 'web-push';

// Configure VAPID keys
// webpush.setVapidDetails(
//   'mailto:contacto@econexo.org',
//   process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
//   process.env.VAPID_PRIVATE_KEY!
// );

export async function POST(request: NextRequest) {
  try {
    const { subscription, title, body, url } = await request.json();
    
    if (!subscription || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      icon: '/favicon.ico',
      badge: '/favicon.ico'
    });

    // await webpush.sendNotification(subscription, payload);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
