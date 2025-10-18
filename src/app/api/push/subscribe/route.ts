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
    const subscription = await request.json();
    
    // In a real app, you would save this to a database
    // For now, we'll just validate the subscription
    if (!subscription.endpoint || !subscription.keys) {
      return NextResponse.json({ error: 'Invalid subscription' }, { status: 400 });
    }

    // Save subscription to database (mock)
    console.log('Subscription saved:', subscription);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error saving subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const subscription = await request.json();
    
    // Remove subscription from database (mock)
    console.log('Subscription removed:', subscription);
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error removing subscription:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
