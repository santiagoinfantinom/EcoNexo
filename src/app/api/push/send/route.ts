import { NextRequest, NextResponse } from 'next/server';
import webpush from 'web-push';

// Configure VAPID keys
const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY;

if (vapidPublicKey && vapidPrivateKey) {
  webpush.setVapidDetails(
    'mailto:contacto@econexo.app',
    vapidPublicKey,
    vapidPrivateKey
  );
}

export async function POST(request: NextRequest) {
  try {
    const { subscription, title, body, url } = await request.json();
    
    if (!subscription || !title || !body) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn('VAPID keys not configured, skipping push notification');
      return NextResponse.json({ 
        success: false, 
        error: 'VAPID keys not configured' 
      }, { status: 503 });
    }

    const payload = JSON.stringify({
      title,
      body,
      url: url || '/',
      icon: '/logo-econexo.png',
      badge: '/logo-econexo.png'
    });

    try {
      await webpush.sendNotification(subscription, payload);
      return NextResponse.json({ success: true });
    } catch (error: any) {
      // Handle expired/invalid subscriptions
      if (error.statusCode === 410 || error.statusCode === 404) {
        console.warn('Subscription expired or invalid:', subscription.endpoint);
        // Could delete from database here
        return NextResponse.json({ 
          success: false, 
          error: 'Subscription expired' 
        }, { status: 410 });
      }
      throw error;
    }
  } catch (error) {
    console.error('Error sending notification:', error);
    return NextResponse.json({ error: 'Failed to send notification' }, { status: 500 });
  }
}
