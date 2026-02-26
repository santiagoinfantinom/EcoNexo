"use client";
import { useEffect } from 'react';

export default function ServiceWorkerRegistration() {
  useEffect(() => {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.getRegistrations().then((registrations) => {
        let hasUnregistered = false;
        for (let registration of registrations) {
          registration.unregister();
          hasUnregistered = true;
          console.log('Unregistered stale service worker.');
        }

        // Let's clear the caches storage as well to be absolutely sure
        if (hasUnregistered && 'caches' in window) {
          caches.keys().then((names) => {
            for (let name of names) {
              caches.delete(name);
            }
          }).then(() => {
            // Give it a tiny bit of time then window reload to show fresh content
            setTimeout(() => {
              window.location.reload();
            }, 500);
          });
        }
      });
    }
  }, []);

  return null;
}
