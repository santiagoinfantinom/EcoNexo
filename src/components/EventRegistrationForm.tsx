"use client";
import React, { useState } from 'react';
import { useI18n } from "@/lib/i18n";

interface EventRegistrationFormProps {
  event: {
    id: string;
    title: string;
    date: string;
    time: string;
    location: string;
    maxVolunteers: number;
    currentVolunteers: number;
  };
  onRegister: (registrationData: RegistrationData) => void;
  onCancel: () => void;
}

interface RegistrationData {
  name: string;
  email: string;
  phone: string;
  emergencyContact: string;
  emergencyPhone: string;
  dietaryRestrictions?: string;
  accessibilityNeeds?: string;
  experience: 'beginner' | 'intermediate' | 'expert';
  motivation: string;
  agreeToTerms: boolean;
  agreeToPhotos: boolean;
}

export default function EventRegistrationForm({ event, onRegister, onCancel }: EventRegistrationFormProps) {
  const { t, locale } = useI18n();
  const [formData, setFormData] = useState<RegistrationData>({
    name: '',
    email: '',
    phone: '',
    emergencyContact: '',
    emergencyPhone: '',
    dietaryRestrictions: '',
    accessibilityNeeds: '',
    experience: 'beginner',
    motivation: '',
    agreeToTerms: false,
    agreeToPhotos: false
  });
  const [errors, setErrors] = useState<Partial<RegistrationData>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateForm = (): boolean => {
    const newErrors: Partial<RegistrationData> = {};

    // Required fields validation
    if (!formData.name.trim()) {
      newErrors.name = t('fullNameRequired');
    }

    if (!formData.email.trim()) {
      newErrors.email = t('emailRequired');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = t('emailInvalid');
    }

    if (!formData.phone.trim()) {
      newErrors.phone = t('phoneRequired');
    } else if (!/^[\+]?[0-9\s\-\(\)]{9,15}$/.test(formData.phone.replace(/\s/g, ''))) {
      newErrors.phone = t('phoneInvalid');
    }

    if (!formData.emergencyContact.trim()) {
      newErrors.emergencyContact = t('emergencyContactNameRequired');
    }

    if (!formData.emergencyPhone.trim()) {
      newErrors.emergencyPhone = t('emergencyContactPhoneRequired');
    } else if (!/^[\+]?[0-9\s\-\(\)]{9,15}$/.test(formData.emergencyPhone.replace(/\s/g, ''))) {
      newErrors.emergencyPhone = t('phoneInvalid');
    }

    if (!formData.motivation.trim()) {
      newErrors.motivation = t('motivationRequired');
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = t('termsRequired');
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      onRegister(formData);
    } catch (error) {
      console.error('Error registering:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof RegistrationData, value: string | boolean) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const formatPhoneNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');
    
    // Format based on length
    if (digits.length <= 3) {
      return digits;
    } else if (digits.length <= 6) {
      return `${digits.slice(0, 3)} ${digits.slice(3)}`;
    } else if (digits.length <= 9) {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6)}`;
    } else {
      return `${digits.slice(0, 3)} ${digits.slice(3, 6)} ${digits.slice(6, 9)}`;
    }
  };

  const spotsLeft = event.maxVolunteers - event.currentVolunteers;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[9999] p-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                {t('registerForEvent')}
              </h2>
              <p className="text-slate-600 dark:text-slate-400 mt-1">
                {event.title}
              </p>
            </div>
            <button
              onClick={onCancel}
              className="text-gray-500 hover:text-gray-700 dark:text-slate-400 dark:hover:text-slate-200 text-2xl font-bold hover:bg-gray-100 dark:hover:bg-slate-700 rounded-full w-8 h-8 flex items-center justify-center transition-colors"
            >
              ×
            </button>
          </div>

          {/* Event Info */}
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4 mb-6">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-slate-500 dark:text-slate-400">📅 {t('date')}:</span>
                <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
                  {new Date(event.date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">⏰ {t('time')}:</span>
                <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
                  {event.time}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">📍 {t('location')}:</span>
                <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">
                  {event.location}
                </span>
              </div>
              <div>
                <span className="text-slate-500 dark:text-slate-400">👥 {t('availableSpots')}:</span>
                <span className="ml-2 font-medium text-slate-900 dark:text-slate-100">{spotsLeft}</span>
              </div>
            </div>
          </div>

          {/* Registration Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Personal Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                {t('personalInformation')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('fullName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange('name', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 ${
                      errors.name ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder={t('fullName')}
                  />
                  {errors.name && (
                    <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Email *
                  </label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => handleInputChange('email', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 ${
                      errors.email ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder="tu@email.com"
                  />
                  {errors.email && (
                    <p className="text-red-500 text-sm mt-1">{errors.email}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('phoneNumber')} *
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => handleInputChange('phone', formatPhoneNumber(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 ${
                      errors.phone ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder="+34 123 456 789"
                  />
                  {errors.phone && (
                    <p className="text-red-500 text-sm mt-1">{errors.phone}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('experienceLevel')}
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => handleInputChange('experience', e.target.value as RegistrationData['experience'])}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                  >
                    <option value="beginner">{t('beginner')}</option>
                    <option value="intermediate">{t('intermediate')}</option>
                    <option value="expert">{t('expert')}</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Emergency Contact */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                {t('emergencyContact')}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('emergencyContactName')} *
                  </label>
                  <input
                    type="text"
                    value={formData.emergencyContact}
                    onChange={(e) => handleInputChange('emergencyContact', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 ${
                      errors.emergencyContact ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder={t('emergencyContactName')}
                  />
                  {errors.emergencyContact && (
                    <p className="text-red-500 text-sm mt-1">{errors.emergencyContact}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('emergencyContactPhone')} *
                  </label>
                  <input
                    type="tel"
                    value={formData.emergencyPhone}
                    onChange={(e) => handleInputChange('emergencyPhone', formatPhoneNumber(e.target.value))}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 ${
                      errors.emergencyPhone ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder="+34 123 456 789"
                  />
                  {errors.emergencyPhone && (
                    <p className="text-red-500 text-sm mt-1">{errors.emergencyPhone}</p>
                  )}
                </div>
              </div>
            </div>

            {/* Additional Information */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                {t('additionalInformation')}
              </h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('motivationToParticipate')} *
                  </label>
                  <textarea
                    value={formData.motivation}
                    onChange={(e) => handleInputChange('motivation', e.target.value)}
                    rows={3}
                    className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 ${
                      errors.motivation ? 'border-red-500' : 'border-gray-300 dark:border-slate-600'
                    }`}
                    placeholder={t('motivationToParticipate')}
                  />
                  {errors.motivation && (
                    <p className="text-red-500 text-sm mt-1">{errors.motivation}</p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('dietaryRestrictions')}
                  </label>
                  <input
                    type="text"
                    value={formData.dietaryRestrictions}
                    onChange={(e) => handleInputChange('dietaryRestrictions', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                    placeholder="z. B. Vegetarisch, Allergien, etc."
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    {t('accessibilityNeeds')}
                  </label>
                  <input
                    type="text"
                    value={formData.accessibilityNeeds}
                    onChange={(e) => handleInputChange('accessibilityNeeds', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100"
                    placeholder="z. B. Rollstuhl, eingeschränkte Mobilität, etc."
                  />
                </div>
              </div>
            </div>

            {/* Terms and Conditions */}
            <div>
              <h3 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
                {t('consents')}
              </h3>
              <div className="space-y-3">
                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToTerms}
                    onChange={(e) => handleInputChange('agreeToTerms', e.target.checked)}
                    className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{t('acceptTerms')} *</span>
                </label>
                {errors.agreeToTerms && (
                  <p className="text-red-500 text-sm">{errors.agreeToTerms}</p>
                )}

                <label className="flex items-start gap-3">
                  <input
                    type="checkbox"
                    checked={formData.agreeToPhotos}
                    onChange={(e) => handleInputChange('agreeToPhotos', e.target.checked)}
                    className="mt-1 w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-slate-700 dark:text-slate-300">{t('photoVideoConsent')}</span>
                </label>
              </div>
            </div>

            {/* Submit Buttons */}
            <div className="flex gap-4 pt-6 border-t border-gray-200 dark:border-slate-600">
              <button
                type="button"
                onClick={onCancel}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-300 rounded-lg hover:bg-gray-50 dark:hover:bg-slate-700 transition-colors font-medium"
              >
                {t('cancel')}
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isSubmitting ? (
                  <div className="flex items-center justify-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    {t('registering')}
                  </div>
                ) : (
                  t('register')
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
