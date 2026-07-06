import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabaseClient';
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
    // This endpoint should be called by a cron job or scheduled task
    // For now, we'll make it callable manually for testing
    
    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({ 
        error: 'VAPID keys not configured' 
      }, { status: 503 });
    }

    const supabase = getSupabase();
    const now = new Date();
    const oneDayFromNow = new Date(now.getTime() + 24 * 60 * 60 * 1000);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    const inOneHour = new Date(now.getTime() + 60 * 60 * 1000);
    const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

    // Get all upcoming events
    const { data: events, error: eventsError } = await supabase
      .from('events')
      .select('*')
      .gte('date', now.toISOString().split('T')[0])
      .order('date', { ascending: true })
      .limit(100);

    if (eventsError) {
      console.error('Error fetching events:', eventsError);
      return NextResponse.json({ error: 'Failed to fetch events' }, { status: 500 });
    }

    if (!events || events.length === 0) {
      return NextResponse.json({ message: 'No upcoming events', sent: 0 });
    }

    // Get all active subscriptions
    const { data: subscriptions, error: subsError } = await supabase
      .from('push_subscriptions')
      .select('*');

    if (subsError) {
      console.error('Error fetching subscriptions:', subsError);
      return NextResponse.json({ error: 'Failed to fetch subscriptions' }, { status: 500 });
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({ message: 'No active subscriptions', sent: 0 });
    }

    let sentCount = 0;
    const errors: string[] = [];

    // Check each event and send notifications
    for (const event of events) {
      const eventDate = new Date(event.date);
      if (event.start_time) {
        const [hours, minutes] = event.start_time.split(':').map(Number);
        eventDate.setHours(hours, minutes, 0, 0);
      }

      const timeUntilEvent = eventDate.getTime() - now.getTime();
      const hoursUntilEvent = timeUntilEvent / (1000 * 60 * 60);

      // Determine notification type
      let notificationType: string | null = null;
      let notificationTitle = '';
      let notificationBody = '';

      if (hoursUntilEvent <= 1 && hoursUntilEvent > 0) {
        // Event starting in 1 hour
        notificationType = '1h_before';
        notificationTitle = `¡El evento "${event.title}" comienza en 1 hora!`;
        notificationBody = `${event.city}, ${event.country} - ${event.start_time || 'Próximamente'}`;
      } else if (hoursUntilEvent <= 24 && hoursUntilEvent > 23) {
        // Event starting in 24 hours
        notificationType = '24h_before';
        notificationTitle = `Recordatorio: "${event.title}" mañana`;
        notificationBody = `${event.city}, ${event.country} - ${event.start_time || 'Próximamente'}`;
      }

      if (!notificationType) continue;

      // Send notification to all subscriptions
      for (const sub of subscriptions) {
        try {
          // Check if we've already sent this notification
          const { data: existing } = await supabase
            .from('event_notifications')
            .select('id')
            .eq('event_id', event.id)
            .eq('subscription_id', sub.id)
            .eq('notification_type', notificationType)
            .single();

          if (existing) {
            // Already sent, skip
            continue;
          }

          // Prepare subscription object
          const subscription = {
            endpoint: sub.endpoint,
            keys: {
              p256dh: sub.p256dh,
              auth: sub.auth
            }
          };

          const payload = JSON.stringify({
            title: notificationTitle,
            body: notificationBody,
            url: `/eventos/${event.id}`,
            icon: '/logo-econexo.png',
            badge: '/logo-econexo.png'
          });

          // Send notification
          await webpush.sendNotification(subscription, payload);

          // Record that we sent this notification
          await supabase
            .from('event_notifications')
            .insert({
              event_id: event.id,
              subscription_id: sub.id,
              notification_type: notificationType
            });

          sentCount++;
        } catch (error: any) {
          // Handle expired subscriptions
          if (error.statusCode === 410 || error.statusCode === 404) {
            // Delete expired subscription
            await supabase
              .from('push_subscriptions')
              .delete()
              .eq('id', sub.id);
            errors.push(`Subscription ${sub.id} expired and was removed`);
          } else {
            errors.push(`Error sending to ${sub.id}: ${error.message}`);
          }
        }
      }
    }

    return NextResponse.json({ 
      message: 'Notifications processed',
      sent: sentCount,
      errors: errors.length > 0 ? errors : undefined
    });
  } catch (error) {
    console.error('Error checking events:', error);
    return NextResponse.json({ 
      error: 'Internal server error',
      message: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 });
  }
}

