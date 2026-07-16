"use client";
import dynamic from 'next/dynamic';

const MapWithNoSSR = dynamic(() => import('./EuropeMap'), {
  ssr: false,
  loading: () => <div style={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>Cargando mapa...</div>
});

export default function MapWrapper(props: any) {
  return <MapWithNoSSR {...props} />;
}