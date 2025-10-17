"use client";
import React from "react";

function urlBase64ToUint8Array(base64String: string) {
  const padding = '='.repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, '+').replace(/_/g, '/');
  const rawData = typeof window !== 'undefined' ? window.atob(base64) : Buffer.from(base64, 'base64').toString('binary');
  const outputArray = new Uint8Array(rawData.length);
  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

export default function NotificationConsent() {
  const [supported, setSupported] = React.useState<boolean>(false);
  const [permission, setPermission] = React.useState<NotificationPermission>(typeof Notification !== 'undefined' ? Notification.permission : 'default');
  const [loading, setLoading] = React.useState<boolean>(false);

  React.useEffect(() => {
    setSupported(typeof window !== 'undefined' && 'serviceWorker' in navigator && 'PushManager' in window);
    if (typeof Notification !== 'undefined') setPermission(Notification.permission);
  }, []);

  const subscribe = async () => {
    try {
      setLoading(true);
      const reg = await navigator.serviceWorker.ready;
      const vapidPub = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
      if (!vapidPub) {
        alert('Notifications not configured');
        setLoading(false);
        return;
      }
      const sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidPub),
      });
      await fetch('/api/push', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(sub) });
      setPermission('granted');
      alert('Notificaciones activadas');
    } catch (e) {
      console.error(e);
      alert('No se pudo activar notificaciones');
    } finally {
      setLoading(false);
    }
  };

  const request = async () => {
    if (typeof Notification === 'undefined') return;
    const result = await Notification.requestPermission();
    setPermission(result);
    if (result === 'granted') await subscribe();
  };

  if (!supported) return null;

  return (
    <button
      onClick={permission === 'granted' ? undefined : request}
      disabled={permission === 'granted' || loading}
      className={`btn-gls-secondary ${permission === 'granted' ? 'opacity-60 cursor-default' : ''}`}
      title={permission === 'granted' ? 'Notificaciones activas' : 'Activar notificaciones'}
    >
      {permission === 'granted' ? '🔔 On' : '🔔 Notificar'}
    </button>
  );
}


