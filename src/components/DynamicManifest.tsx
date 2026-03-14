"use client";

import { useEffect } from 'react';
import { useI18n } from '@/lib/i18n';

export default function DynamicManifest() {
  const { locale } = useI18n();

  useEffect(() => {
    // Update the manifest link in the document head
    const isGH = typeof window !== 'undefined' && window.location.hostname.includes('github.io');
    const prefix = isGH ? '/EcoNexo' : '';

    // On static GH Pages, we can't use the dynamic API route
    // We'll fallback to the default manifest if the API fails
    const manifestHref = isGH ? `${prefix}/manifest.json` : `/api/manifest?locale=${locale}`;

    const existingManifest = document.querySelector('link[rel="manifest"]');
    if (existingManifest) {
      existingManifest.setAttribute('href', manifestHref);
    } else {
      const manifestLink = document.createElement('link');
      manifestLink.rel = 'manifest';
      manifestLink.href = manifestHref;
      document.head.appendChild(manifestLink);
    }
  }, [locale]);

  return null;
}
