"use client";
import dynamic from 'next/dynamic';
import { useI18n } from '@/lib/i18n';

function MapLoadingFallback() {
  const { t } = useI18n();
  return <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{t('loadingMap')}</div>;
}

const MapWithNoSSR = dynamic(() => import('./EuropeMap'), {
  ssr: false,
  loading: MapLoadingFallback
});

export default function MapWrapper(props: any) {
  return <MapWithNoSSR {...props} />;
}