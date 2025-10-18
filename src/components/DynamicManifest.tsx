"use client";

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

export default function DynamicManifest() {
  const { locale } = useI18n();

  useEffect(() => {
    // Update the manifest link in the document head
    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      existingManifest.setAttribute('href', `/api/manifest?locale=${locale}`);
    } else {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = `/api/manifest?locale=${locale}`;
      document.head.appendChild(manifestLink);
    }
  }, [locale]);

  return null;
}
