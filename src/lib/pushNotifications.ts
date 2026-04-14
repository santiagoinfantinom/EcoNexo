import { useState, useEffect } from 'react';
import { trackEvent } from '@/lib/analytics';

interface NotificationPermission {
  granted: boolean;
  denied: boolean;
  default: boolean;
}

export function usePushNotifications() {
  const [permission, setPermission] = useState<NotificationPermission>({
    granted: false,
    denied: false,
    default: true
  });
  const [subscription, setSubscription] = useState<PushSubscription | null>(null);
  const [isSupported, setIsSupported] = useState(false);

  const updatePermissionState = () => {
    const currentPermission = Notification.permission;
    setPermission({
      granted: currentPermission === 'granted',
      denied: currentPermission === 'denied',
      default: currentPermission === 'default'
    });
  };

  useEffect(() => {
    const supported = 'serviceWorker' in navigator && 'PushManager' in window;
    setIsSupported(supported);
    if (supported) updatePermissionState();
  }, []);

  const requestPermission = async () => {
    if (!isSupported) return false;
    
    try {
      const permission = await Notification.requestPermission();
      updatePermissionState();
      
      if (permission === 'granted') {
        trackEvent('Push Notification Permission Granted');
        await subscribeToPush();
        return true;
      } else {
        trackEvent('Push Notification Permission Denied');
        return false;
      }
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  };

  const subscribeToPush = async () => {
    if (!isSupported || !permission.granted) return;

    try {
      const registration = await navigator.serviceWorker.ready;
      const subscription = await registration.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
      });

      setSubscription(subscription);
      
      // Send subscription to server
      await fetch('/api/push/subscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      trackEvent('Push Notification Subscribed');
    } catch (error) {
      console.error('Error subscribing to push notifications:', error);
    }
  };

  const unsubscribeFromPush = async () => {
    if (!subscription) return;

    try {
      await subscription.unsubscribe();
      setSubscription(null);
      
      // Remove subscription from server
      await fetch('/api/push/unsubscribe', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(subscription),
      });

      trackEvent('Push Notification Unsubscribed');
    } catch (error) {
      console.error('Error unsubscribing from push notifications:', error);
    }
  };

  return {
    permission,
    subscription,
    isSupported,
    requestPermission,
    subscribeToPush,
    unsubscribeFromPush
  };
}
