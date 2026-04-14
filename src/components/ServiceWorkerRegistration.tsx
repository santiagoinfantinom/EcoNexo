"use client";
import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!('serviceWorker' in navigator)) return;

    const CLEANUP_FLAG = "econexo:sw-cleanup:v1";
    const alreadyCleaned = sessionStorage.getItem(CLEANUP_FLAG) === "done";
    if (alreadyCleaned) return;

    navigator.serviceWorker.getRegistrations().then(async (registrations) => {
      for (const registration of registrations) {
        await registration.unregister();
        console.log('Unregistered stale service worker.');
      }

      // Clear cache storage once per session, but do not force reload.
      if ('caches' in window) {
        const names = await caches.keys();
        await Promise.all(names.map((name) => caches.delete(name)));
      }

      sessionStorage.setItem(CLEANUP_FLAG, "done");
    }).catch((err) => {
      console.warn('Service worker cleanup failed:', err);
    });
  }, []);

  return null;
}
