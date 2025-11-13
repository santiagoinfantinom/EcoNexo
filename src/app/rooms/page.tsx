"use client";
import React, { useState, useEffect } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';
import DigitalRoom from '@/components/DigitalRoom';
import { useRouter } from 'next/navigation';

interface DigitalRoom {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
  expiresAt: number;
  autoDestroyMinutes: number;
  participants: string[];
  isActive: boolean;
  timeRemaining?: number;
}

export default function RoomsPage() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [rooms, setRooms] = useState<DigitalRoom[]>([]);
  const [selectedRoom, setSelectedRoom] = useState<DigitalRoom | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Create room form
  const [roomName, setRoomName] = useState('');
  const [roomDescription, setRoomDescription] = useState('');
  const [autoDestroyMinutes, setAutoDestroyMinutes] = useState(60);

  useEffect(() => {
    loadRooms();
    // Refresh rooms every 10 seconds
    const interval = setInterval(loadRooms, 10000);
    return () => clearInterval(interval);
  }, [user]);

  const loadRooms = async () => {
    try {
      const url = user 
        ? `/api/rooms?userId=${user.id || user.email}`
        : '/api/rooms';
      const response = await fetch(url);
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRooms(data.rooms || []);
        }
      }
    } catch (error) {
      console.error('Error loading rooms:', error);
    }
  };

  const handleCreateRoom = async () => {
    if (!user || !roomName.trim()) return;

    setIsLoading(true);
    try {
      const response = await fetch('/api/rooms', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: roomName.trim(),
          description: roomDescription.trim() || undefined,
          createdBy: user.id || user.email,
          autoDestroyMinutes: parseInt(autoDestroyMinutes.toString()),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setRooms(prev => [data.room, ...prev]);
          setSelectedRoom(data.room);
          setShowCreateModal(false);
          setRoomName('');
          setRoomDescription('');
          setAutoDestroyMinutes(60);
        }
      }
    } catch (error) {
      console.error('Error creating room:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoinRoom = async (roomId: string) => {
    if (!user) {
      router.push('/auth');
      return;
    }

    try {
      const response = await fetch('/api/rooms', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId,
          userId: user.id || user.email,
          action: 'join',
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSelectedRoom(data.room);
        }
      }
    } catch (error) {
      console.error('Error joining room:', error);
    }
  };

  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return locale === 'es' ? 'Expirado' : locale === 'de' ? 'Abgelaufen' : 'Expired';
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (hours > 0) return `${hours}h ${mins}m`;
    return `${mins}m`;
  };

  if (selectedRoom) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
        <div className="max-w-4xl mx-auto">
          <DigitalRoom
            room={selectedRoom}
            onLeave={() => setSelectedRoom(null)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
              {locale === 'es'
                ? 'Digital Rooms'
                : locale === 'de'
                ? 'Digitale Räume'
                : 'Digital Rooms'}
            </h1>
            <p className="text-gray-600 dark:text-gray-400">
              {locale === 'es'
                ? 'Salas temporales con autodestrucción. Chats privadísimos que desaparecen automáticamente.'
                : locale === 'de'
                ? 'Temporäre Räume mit Selbstzerstörung. Sehr private Chats, die automatisch verschwinden.'
                : 'Temporary rooms with self-destruction. Ultra-private chats that disappear automatically.'}
            </p>
          </div>
          {user && (
            <button
              onClick={() => setShowCreateModal(true)}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              {locale === 'es' ? '+ Crear Sala' : locale === 'de' ? '+ Raum erstellen' : '+ Create Room'}
            </button>
          )}
        </div>

        {/* Rooms Grid */}
        {rooms.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-12 text-center">
            <div className="text-6xl mb-4">💬</div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
              {locale === 'es'
                ? 'No hay salas activas'
                : locale === 'de'
                ? 'Keine aktiven Räume'
                : 'No active rooms'}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {locale === 'es'
                ? user
                  ? 'Crea tu primera sala temporal'
                  : 'Inicia sesión para crear una sala'
                : locale === 'de'
                ? user
                  ? 'Erstelle deinen ersten temporären Raum'
                  : 'Melde dich an, um einen Raum zu erstellen'
                : user
                ? 'Create your first temporary room'
                : 'Sign in to create a room'}
            </p>
            {user && (
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                {locale === 'es' ? 'Crear Sala' : locale === 'de' ? 'Raum erstellen' : 'Create Room'}
              </button>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {rooms.map((room) => (
              <div
                key={room.id}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer"
                onClick={() => handleJoinRoom(room.id)}
              >
                <div className="flex items-start justify-between mb-4">
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                    {room.name}
                  </h3>
                  <div className={`text-sm font-semibold px-2 py-1 rounded ${
                    (room.timeRemaining || 0) < 60000 ? 'bg-red-100 text-red-800' : 
                    (room.timeRemaining || 0) < 300000 ? 'bg-orange-100 text-orange-800' : 
                    'bg-green-100 text-green-800'
                  }`}>
                    ⏱️ {formatTimeRemaining(room.timeRemaining || 0)}
                  </div>
                </div>
                
                {room.description && (
                  <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                    {room.description}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500 dark:text-gray-400">
                  <span>
                    👥 {room.participants.length}{' '}
                    {locale === 'es'
                      ? 'participantes'
                      : locale === 'de'
                      ? 'Teilnehmer'
                      : 'participants'}
                  </span>
                  <span>
                    {locale === 'es'
                      ? 'Se destruye en'
                      : locale === 'de'
                      ? 'Zerstört sich in'
                      : 'Destroys in'}{' '}
                    {room.autoDestroyMinutes}{' '}
                    {locale === 'es' ? 'min' : locale === 'de' ? 'Min' : 'min'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Create Room Modal */}
        {showCreateModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl max-w-md w-full p-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                {locale === 'es'
                  ? 'Crear Digital Room'
                  : locale === 'de'
                  ? 'Digitalen Raum erstellen'
                  : 'Create Digital Room'}
              </h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'es' ? 'Nombre de la sala' : locale === 'de' ? 'Raumname' : 'Room name'} *
                  </label>
                  <input
                    type="text"
                    value={roomName}
                    onChange={(e) => setRoomName(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    placeholder={locale === 'es' ? 'Mi sala privada' : locale === 'de' ? 'Mein privater Raum' : 'My private room'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'es' ? 'Descripción (opcional)' : locale === 'de' ? 'Beschreibung (optional)' : 'Description (optional)'}
                  </label>
                  <textarea
                    value={roomDescription}
                    onChange={(e) => setRoomDescription(e.target.value)}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                    placeholder={locale === 'es' ? 'Descripción de la sala...' : locale === 'de' ? 'Raumbeschreibung...' : 'Room description...'}
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    {locale === 'es'
                      ? 'Autodestrucción después de (minutos)'
                      : locale === 'de'
                      ? 'Selbstzerstörung nach (Minuten)'
                      : 'Auto-destroy after (minutes)'} *
                  </label>
                  <select
                    value={autoDestroyMinutes}
                    onChange={(e) => setAutoDestroyMinutes(parseInt(e.target.value))}
                    className="w-full px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
                  >
                    <option value={5}>5 {locale === 'es' ? 'minutos' : locale === 'de' ? 'Minuten' : 'minutes'}</option>
                    <option value={15}>15 {locale === 'es' ? 'minutos' : locale === 'de' ? 'Minuten' : 'minutes'}</option>
                    <option value={30}>30 {locale === 'es' ? 'minutos' : locale === 'de' ? 'Minuten' : 'minutes'}</option>
                    <option value={60}>1 {locale === 'es' ? 'hora' : locale === 'de' ? 'Stunde' : 'hour'}</option>
                    <option value={120}>2 {locale === 'es' ? 'horas' : locale === 'de' ? 'Stunden' : 'hours'}</option>
                    <option value={240}>4 {locale === 'es' ? 'horas' : locale === 'de' ? 'Stunden' : 'hours'}</option>
                    <option value={480}>8 {locale === 'es' ? 'horas' : locale === 'de' ? 'Stunden' : 'hours'}</option>
                    <option value={1440}>24 {locale === 'es' ? 'horas' : locale === 'de' ? 'Stunden' : 'hours'}</option>
                  </select>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {locale === 'es'
                      ? 'La sala y todos los mensajes se eliminarán automáticamente después de este tiempo'
                      : locale === 'de'
                      ? 'Der Raum und alle Nachrichten werden nach dieser Zeit automatisch gelöscht'
                      : 'The room and all messages will be automatically deleted after this time'}
                  </p>
                </div>
              </div>
              
              <div className="flex gap-3 mt-6">
                <button
                  onClick={() => {
                    setShowCreateModal(false);
                    setRoomName('');
                    setRoomDescription('');
                    setAutoDestroyMinutes(60);
                  }}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors"
                >
                  {locale === 'es' ? 'Cancelar' : locale === 'de' ? 'Abbrechen' : 'Cancel'}
                </button>
                <button
                  onClick={handleCreateRoom}
                  disabled={!roomName.trim() || isLoading}
                  className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {isLoading
                    ? locale === 'es' ? 'Creando...' : locale === 'de' ? 'Erstellen...' : 'Creating...'
                    : locale === 'es' ? 'Crear' : locale === 'de' ? 'Erstellen' : 'Create'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

