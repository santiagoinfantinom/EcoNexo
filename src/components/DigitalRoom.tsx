"use client";
import React, { useState, useEffect, useRef } from 'react';
import { useI18n } from '@/lib/i18n';
import { useAuth } from '@/lib/auth';

interface RoomMessage {
  id: string;
  senderId: string;
  senderName: string;
  content: string;
  timestamp: number;
}

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

interface DigitalRoomProps {
  room: DigitalRoom;
  onLeave?: () => void;
}

export default function DigitalRoom({ room, onLeave }: DigitalRoomProps) {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const [messages, setMessages] = useState<RoomMessage[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [timeRemaining, setTimeRemaining] = useState(room.timeRemaining || 0);
  const [isExpired, setIsExpired] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const pollIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Format time remaining
  const formatTimeRemaining = (ms: number) => {
    if (ms <= 0) return locale === 'es' ? 'Expirado' : locale === 'de' ? 'Abgelaufen' : 'Expired';
    
    const minutes = Math.floor(ms / 60000);
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  // Update time remaining
  useEffect(() => {
    const updateTime = () => {
      const remaining = Math.max(0, room.expiresAt - Date.now());
      setTimeRemaining(remaining);
      
      if (remaining <= 0 && !isExpired) {
        setIsExpired(true);
        if (pollIntervalRef.current) {
          clearInterval(pollIntervalRef.current);
        }
      }
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    pollIntervalRef.current = interval;

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [room.expiresAt, isExpired]);

  // Load messages
  useEffect(() => {
    const loadMessages = async () => {
      try {
        const response = await fetch(`/api/rooms/messages?roomId=${room.id}`);
        if (response.ok) {
          const data = await response.json();
          if (data.success) {
            setMessages(data.messages || []);
          }
        }
      } catch (error) {
        console.error('Error loading messages:', error);
      }
    };

    loadMessages();
    
    // Poll for new messages every 2 seconds
    const interval = setInterval(loadMessages, 2000);
    
    return () => clearInterval(interval);
  }, [room.id]);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!user || !newMessage.trim() || isExpired) return;

    const senderName = user.email?.split('@')[0] || 'Usuario';
    const senderId = user.id || user.email || 'anonymous';

    try {
      const response = await fetch('/api/rooms/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          roomId: room.id,
          senderId,
          senderName,
          content: newMessage.trim(),
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setMessages(prev => [...prev, data.message]);
          setNewMessage('');
        }
      }
    } catch (error) {
      console.error('Error sending message:', error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const formatTime = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(locale === 'de' ? 'de-DE' : locale === 'en' ? 'en-US' : 'es-ES', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isExpired) {
    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-6xl mb-4">💥</div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {locale === 'es'
            ? 'Sala Destruida'
            : locale === 'de'
            ? 'Raum zerstört'
            : 'Room Destroyed'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          {locale === 'es'
            ? 'Esta sala se ha autodestruido según lo programado. Todos los mensajes han sido eliminados permanentemente.'
            : locale === 'de'
            ? 'Dieser Raum wurde wie geplant selbstzerstört. Alle Nachrichten wurden dauerhaft gelöscht.'
            : 'This room has self-destructed as scheduled. All messages have been permanently deleted.'}
        </p>
        {onLeave && (
          <button
            onClick={onLeave}
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            {locale === 'es' ? 'Volver' : locale === 'de' ? 'Zurück' : 'Go Back'}
          </button>
        )}
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg flex flex-col h-[600px]">
      {/* Header */}
      <div className="border-b border-gray-200 dark:border-slate-700 p-4">
        <div className="flex items-center justify-between mb-2">
          <div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              {room.name}
            </h2>
            {room.description && (
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                {room.description}
              </p>
            )}
          </div>
          <div className="text-right">
            <div className={`text-sm font-semibold ${
              timeRemaining < 60000 ? 'text-red-600' : 
              timeRemaining < 300000 ? 'text-orange-600' : 
              'text-green-600'
            }`}>
              ⏱️ {formatTimeRemaining(timeRemaining)}
            </div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
              {locale === 'es'
                ? `${room.participants.length} participantes`
                : locale === 'de'
                ? `${room.participants.length} Teilnehmer`
                : `${room.participants.length} participants`}
            </div>
          </div>
        </div>
        {onLeave && (
          <button
            onClick={onLeave}
            className="text-sm text-red-600 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
          >
            {locale === 'es' ? 'Salir de la sala' : locale === 'de' ? 'Raum verlassen' : 'Leave room'}
          </button>
        )}
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.length === 0 ? (
          <div className="text-center text-gray-500 dark:text-gray-400 py-8">
            {locale === 'es'
              ? 'No hay mensajes aún. Sé el primero en escribir!'
              : locale === 'de'
              ? 'Noch keine Nachrichten. Sei der Erste!'
              : 'No messages yet. Be the first to write!'}
          </div>
        ) : (
          messages.map((message) => {
            const isOwn = message.senderId === (user?.id || user?.email);
            return (
              <div
                key={message.id}
                className={`flex ${isOwn ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[75%] rounded-lg p-3 ${
                    isOwn
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-900 dark:text-gray-100'
                  }`}
                >
                  {!isOwn && (
                    <div className="text-xs opacity-80 mb-1 font-semibold">
                      {message.senderName}
                    </div>
                  )}
                  <div className="whitespace-pre-wrap">{message.content}</div>
                  <div className={`text-xs mt-1 ${
                    isOwn ? 'text-green-100' : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {formatTime(message.timestamp)}
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-200 dark:border-slate-700 p-4">
        <div className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder={
              locale === 'es'
                ? 'Escribe un mensaje...'
                : locale === 'de'
                ? 'Nachricht schreiben...'
                : 'Type a message...'
            }
            className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 bg-white dark:bg-slate-700 text-gray-900 dark:text-gray-100"
            disabled={!user || isExpired}
          />
          <button
            onClick={handleSendMessage}
            disabled={!user || !newMessage.trim() || isExpired}
            className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            {locale === 'es' ? 'Enviar' : locale === 'de' ? 'Senden' : 'Send'}
          </button>
        </div>
        {!user && (
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            {locale === 'es'
              ? 'Inicia sesión para enviar mensajes'
              : locale === 'de'
              ? 'Melde dich an, um Nachrichten zu senden'
              : 'Sign in to send messages'}
          </p>
        )}
      </div>
    </div>
  );
}

