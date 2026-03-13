import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabaseClient';
import { cookies } from 'next/headers';

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json();
    const userAgent = request.headers.get('user-agent') || '';
    
    // Validate subscription
    if (!subscription.endpoint || !subscription.keys || !subscription.keys.p256dh || !subscription.keys.auth) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // Get user ID from auth (if available)
    let userId: string | null = null;
    try {
      const cookieStore = await cookies();
      const supabase = getSupabase();
      // Try to get user from session
      const { data: { user } } = await supabase.auth.getUser();
      userId = user?.id || null;
    } catch (error) {
      console.warn('Could not get user ID:', error);
    }

    // Save subscription to database
    const supabase = getSupabase();
    const { data, error } = await supabase
      .from('push_subscriptions')
      .upsert({
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        user_id: userId,
        user_agent: userAgent,
        updated_at: new Date().toISOString()
      }, {
        onConflict: 'endpoint',
        ignoreDuplicates: false
      })
      .select()
      .single();

    if (error) {
      console.error('Error saving subscription:', error);
      // Continue anyway - subscription might still work
    }
    
    return NextResponse.json({ success: true, id: data?.id });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const subscription = await request.json();
    
    if (!subscription.endpoint) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // Remove subscription from database
    const supabase = getSupabase();
    const { error } = await supabase
      .from('push_subscriptions')
      .delete()
      .eq('endpoint', subscription.endpoint);

    if (error) {
      console.error('Error removing subscription:', error);
      // Continue anyway
    }
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
