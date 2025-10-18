'use client';

import { useState, useEffect } from 'react';
import { usePushNotifications } from '@/lib/pushNotifications';
import { useGamification } from '@/lib/gamification';
import { useI18n } from '@/lib/i18n';

export function NotificationSettings() {
  const { t, locale } = useI18n();
  const { permission, isSupported, requestPermission, subscription, unsubscribeFromPush } = usePushNotifications();
  const { addPoints } = useGamification();
  const [isLoading, setIsLoading] = useState(false);

  const handleEnableNotifications = async () => {
    setIsLoading(true);
    try {
      const granted = await requestPermission();
      if (granted) {
        addPoints(10, 'Enabled Push Notifications');
        trackEvent('Notifications Enabled');
      }
    } catch (error) {
      console.error('Error enabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDisableNotifications = async () => {
    setIsLoading(true);
    try {
      await unsubscribeFromPush();
      trackEvent('Notifications Disabled');
    } catch (error) {
      console.error('Error disabling notifications:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isSupported) {
    return (
      <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
        <div className="flex">
          <div className="flex-shrink-0">
            <span className="text-yellow-400">⚠️</span>
          </div>
          <div className="ml-3">
            <h3 className="text-sm font-medium text-yellow-800">
              {t('notificationsNotSupported')}
            </h3>
            <p className="mt-1 text-sm text-yellow-700">
              {t('browserNotSupportPush')}
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🔔 {t('notificationSettings')}
      </h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h4 className="text-sm font-medium text-gray-900">{t('pushNotifications')}</h4>
            <p className="text-sm text-gray-500">
              {t('receiveNotificationsAboutEvents')}
            </p>
          </div>
          
          {permission.granted ? (
            <div className="flex items-center space-x-3">
              <span className="text-green-600 text-sm font-medium">✅ {t('activated')}</span>
              <button
                onClick={handleDisableNotifications}
                disabled={isLoading}
                className="text-red-600 hover:text-red-800 text-sm font-medium disabled:opacity-50"
              >
                {isLoading ? t('deactivating') : t('deactivate')}
              </button>
            </div>
          ) : (
            <button
              onClick={handleEnableNotifications}
              disabled={isLoading || permission.denied}
              className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? t('activating') : t('activate')}
            </button>
          )}
        </div>

        {permission.denied && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-3">
            <p className="text-sm text-red-700">
              {t('notificationsBlocked')}
            </p>
          </div>
        )}

        {subscription && (
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <p className="text-sm text-green-700">
              ✅ {t('subscribedToPushNotifications')}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
