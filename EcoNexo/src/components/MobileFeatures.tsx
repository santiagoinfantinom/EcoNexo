"use client";
import { useEffect, useState, useCallback } from 'react';
import { Capacitor } from '@capacitor/core';
import { Geolocation } from '@capacitor/geolocation';
import { Camera, CameraResultType, CameraSource } from '@capacitor/camera';
import { PushNotifications, Token, ActionPerformed, PushNotificationSchema } from '@capacitor/push-notifications';

interface LocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

interface MobileFeaturesProps {
  onLocationUpdate?: (location: LocationData) => void;
  onImageCapture?: (imageUrl: string) => void;
}

export default function MobileFeatures({ onLocationUpdate, onImageCapture }: MobileFeaturesProps) {
  const [isNative, setIsNative] = useState(false);
  const [location, setLocation] = useState<LocationData | null>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);

  const setupPushNotifications = useCallback(async () => {
    try {
      // Solicitar permisos
      const permStatus = await PushNotifications.requestPermissions();
      
      if (permStatus.receive === 'granted') {
        setNotificationsEnabled(true);
        
        // Registrar para notificaciones push
        await PushNotifications.register();
        
        // Escuchar eventos de notificaciones
        PushNotifications.addListener('registration', (token: Token) => {
          console.log('Push registration success, token: ' + token.value);
        });

        PushNotifications.addListener('registrationError', (err: any) => {
          console.error('Error on registration: ' + JSON.stringify(err));
        });

        PushNotifications.addListener('pushNotificationReceived', (notification: PushNotificationSchema) => {
          console.log('Push notification received: ', notification);
        });

        PushNotifications.addListener('pushNotificationActionPerformed', (notification: ActionPerformed) => {
          console.log('Push notification action performed', notification.actionId, notification.inputValue);
        });
      }
    } catch (error) {
      console.warn('Push notifications not available:', error);
    }
  }, []);

  const getCurrentLocation = useCallback(async () => {
    try {
      const coordinates = await Geolocation.getCurrentPosition({
        enableHighAccuracy: true,
        timeout: 10000,
      });

      const locationData: LocationData = {
        latitude: coordinates.coords.latitude,
        longitude: coordinates.coords.longitude,
        accuracy: coordinates.coords.accuracy || 0,
      };

      setLocation(locationData);
      onLocationUpdate?.(locationData);
    } catch (error) {
      console.warn('Geolocation not available:', error);
    }
  }, [onLocationUpdate]);

  const initializeMobileFeatures = useCallback(async () => {
    try {
      // Configurar notificaciones push
      await setupPushNotifications();
      
      // Obtener ubicación actual
      await getCurrentLocation();
    } catch (error) {
      console.warn('Error initializing mobile features:', error);
    }
  }, [getCurrentLocation, setupPushNotifications]);

  useEffect(() => {
    setIsNative(Capacitor.isNativePlatform());
    if (Capacitor.isNativePlatform()) {
      initializeMobileFeatures();
    }
  }, [initializeMobileFeatures]);

  const captureImage = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Camera,
      });

      if (image.dataUrl) {
        onImageCapture?.(image.dataUrl);
      }
    } catch (error) {
      console.warn('Camera not available:', error);
    }
  };

  const selectImageFromGallery = async () => {
    try {
      const image = await Camera.getPhoto({
        quality: 90,
        allowEditing: false,
        resultType: CameraResultType.DataUrl,
        source: CameraSource.Photos,
      });

      if (image.dataUrl) {
        onImageCapture?.(image.dataUrl);
      }
    } catch (error) {
      console.warn('Photo gallery not available:', error);
    }
  };

  // Solo mostrar en apps nativas
  if (!isNative) {
    return null;
  }

  return (
    <div className="mobile-features bg-gls-primary/10 p-4 rounded-lg mb-4">
      <h3 className="text-lg font-semibold text-gls-primary mb-3">
        📱 Funcionalidades Móviles
      </h3>
      
      <div className="space-y-3">
        {/* Ubicación */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gls-secondary">📍 Ubicación GPS</p>
            {location && (
              <p className="text-xs text-gls-secondary/70">
                Lat: {location.latitude.toFixed(4)}, Lng: {location.longitude.toFixed(4)}
              </p>
            )}
          </div>
          <button
            onClick={getCurrentLocation}
            className="btn-gls-secondary text-xs px-3 py-1"
          >
            Actualizar
          </button>
        </div>

        {/* Notificaciones */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gls-secondary">🔔 Notificaciones</p>
            <p className="text-xs text-gls-secondary/70">
              {notificationsEnabled ? 'Activadas' : 'No disponibles'}
            </p>
          </div>
        </div>

        {/* Cámara */}
        <div className="flex gap-2">
          <button
            onClick={captureImage}
            className="btn-gls-primary text-xs px-3 py-1 flex-1"
          >
            📷 Tomar Foto
          </button>
          <button
            onClick={selectImageFromGallery}
            className="btn-gls-secondary text-xs px-3 py-1 flex-1"
          >
            🖼️ Galería
          </button>
        </div>
      </div>
    </div>
  );
}
