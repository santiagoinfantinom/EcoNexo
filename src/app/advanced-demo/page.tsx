import EcoNexoAdvanced from '@/components/EcoNexoAdvanced';

// Mock data for demonstration
const mockEvents = [
  {
    id: 'e1',
    title: 'Plantación de árboles nativos',
    lat: 52.5200,
    lng: 13.4050,
    category: 'environment',
    date: '2024-12-02',
    maxVolunteers: 30,
    currentVolunteers: 12,
    impact: 'high' as const,
    description: 'Únete a nuestra plantación comunitaria de especies nativas para restaurar el ecosistema local.',
    time: '09:00',
    duration: 3,
    location: {
      lat: 52.5200,
      lng: 13.4050,
      address: 'Bosque Urbano Norte, Berlín'
    },
    organizer: 'Green City Initiative',
    difficulty: 'easy' as const,
    accessibility: true,
    cost: 0,
    tags: ['reforestación', 'comunidad', 'naturaleza']
  },
  {
    id: 'e2',
    title: 'Taller de energía solar',
    lat: 40.4168,
    lng: -3.7038,
    category: 'education',
    date: '2024-12-04',
    maxVolunteers: 20,
    currentVolunteers: 15,
    impact: 'medium' as const,
    description: 'Aprende sobre instalación y beneficios de paneles solares residenciales.',
    time: '14:00',
    duration: 3,
    location: {
      lat: 40.4168,
      lng: -3.7038,
      address: 'Centro de Innovación Verde, Madrid'
    },
    organizer: 'SolarTech Academy',
    difficulty: 'medium' as const,
    accessibility: true,
    cost: 25,
    tags: ['energía', 'solar', 'educación']
  },
  {
    id: 'e3',
    title: 'Mercado de productos locales',
    lat: 41.3851,
    lng: 2.1734,
    category: 'community',
    date: '2024-12-06',
    maxVolunteers: 40,
    currentVolunteers: 25,
    impact: 'low' as const,
    description: 'Feria de productos orgánicos y artesanías locales sostenibles.',
    time: '10:00',
    duration: 6,
    location: {
      lat: 41.3851,
      lng: 2.1734,
      address: 'Plaza del Mercado, Barcelona'
    },
    organizer: 'Asociación de Productores Locales',
    difficulty: 'easy' as const,
    accessibility: true,
    cost: 0,
    tags: ['mercado', 'local', 'orgánico']
  },
  {
    id: 'e4',
    title: 'Limpieza de río',
    lat: 45.4642,
    lng: 9.1900,
    category: 'environment',
    date: '2025-02-14',
    maxVolunteers: 25,
    currentVolunteers: 18,
    impact: 'high' as const,
    description: 'Participa en la limpieza del río Verde para mejorar la calidad del agua.',
    time: '08:00',
    duration: 3,
    location: {
      lat: 45.4642,
      lng: 9.1900,
      address: 'Río Verde, Milán'
    },
    organizer: 'River Guardians',
    difficulty: 'medium' as const,
    accessibility: false,
    cost: 0,
    tags: ['limpieza', 'río', 'agua']
  },
  {
    id: 'e5',
    title: 'Conferencia sobre cambio climático',
    lat: 48.8566,
    lng: 2.3522,
    category: 'education',
    date: '2025-03-05',
    maxVolunteers: 200,
    currentVolunteers: 150,
    impact: 'medium' as const,
    description: 'Asiste a esta conferencia informativa sobre los efectos del cambio climático.',
    time: '18:00',
    duration: 2,
    location: {
      lat: 48.8566,
      lng: 2.3522,
      address: 'Auditorio Municipal, París'
    },
    organizer: 'Local Climate Institute',
    difficulty: 'easy' as const,
    accessibility: true,
    cost: 15,
    tags: ['conferencia', 'clima', 'educación']
  }
];

// Force dynamic rendering to avoid SSR issues with window object
export const dynamic = 'force-dynamic';

export default function AdvancedDemoPage() {
  return (
    <div className="min-h-screen bg-modern">
      <EcoNexoAdvanced 
        events={mockEvents}
        userId="demo-user"
      />
    </div>
  );
}
