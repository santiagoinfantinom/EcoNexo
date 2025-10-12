"use client";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import EcoNexoLogo from "./EcoNexoLogo";

interface ProfileData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  aboutMe: string;
  passions: string;
  areasOfExpertise: string;
  hobbies: string;
  interests: string;
  skills: string;
  languages: string;
  linkedin: string;
  twitter: string;
  instagram: string;
  website: string;
  profilePhoto: string;
}

export default function ProfileComponent() {
  const { t, locale } = useI18n();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    city: "",
    country: "",
    aboutMe: "",
    passions: "",
    areasOfExpertise: "",
    hobbies: "",
    interests: "",
    skills: "",
    languages: "",
    linkedin: "",
    twitter: "",
    instagram: "",
    website: "",
    profilePhoto: "/logo-econexo.png"
  });

  // Load profile data from localStorage on component mount
  useEffect(() => {
    const savedProfile = localStorage.getItem('econexo:profile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
  }, []);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        const updatedProfile = { ...profileData, profilePhoto: result };
        setProfileData(updatedProfile);
        // Save immediately when photo is changed
        localStorage.setItem('econexo:profile', JSON.stringify(updatedProfile));
        setShowSuccess(true);
        setTimeout(() => setShowSuccess(false), 2000);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Save to localStorage
      localStorage.setItem('econexo:profile', JSON.stringify(profileData));
      
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    // Reload from localStorage to discard changes
    const savedProfile = localStorage.getItem('econexo:profile');
    if (savedProfile) {
      setProfileData(JSON.parse(savedProfile));
    }
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">{t("myProfile")}</h1>
            <p className="text-green-100 text-sm mt-1">
              {isEditing ? 
                (locale === 'de' ? "Bearbeitungsmodus" : locale === 'en' ? "Edit mode" : "Modo edición") : 
                (locale === 'de' ? "Profilansicht" : locale === 'en' ? "Profile view" : "Vista de perfil")
              }
            </p>
          </div>
          <div className="flex gap-3">
            {isEditing ? (
              <>
                <button
                  onClick={handleCancel}
                  className="bg-white/20 hover:bg-white/30 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
                >
                  {t("cancel")}
                </button>
                <button
                  onClick={handleSave}
                  disabled={isLoading}
                  className="bg-white hover:bg-green-50 text-green-600 px-4 py-2 rounded-lg transition-colors text-sm font-medium disabled:opacity-50"
                >
                  {isLoading ? 
                    (locale === 'de' ? "Speichern..." : locale === 'en' ? "Saving..." : "Guardando...") : 
                    t("saveChanges")
                  }
                </button>
              </>
            ) : (
              <button
                onClick={() => setIsEditing(true)}
                className="bg-white hover:bg-green-50 text-green-600 px-4 py-2 rounded-lg transition-colors text-sm font-medium"
              >
                {t("editProfile")}
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Success Message */}
      {showSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 mx-6 mt-4 rounded">
          {t("profileUpdated")}
        </div>
      )}

      <div className="p-6">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {profileData.profilePhoto && profileData.profilePhoto !== "/logo-econexo.png" ? (
              <img
                src={profileData.profilePhoto}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-200 dark:border-green-700"
              />
            ) : (
              <EcoNexoLogo 
                className="w-32 h-32 border-4 border-green-200 dark:border-green-700" 
                size={128}
              />
            )}
            {isEditing && (
              <button
                onClick={triggerFileInput}
                className="absolute bottom-0 right-0 bg-green-600 text-white rounded-full p-2 hover:bg-green-700 transition-colors shadow-lg"
                title={t("changePhoto")}
              >
                📷
              </button>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handlePhotoChange}
            className="hidden"
          />
          {isEditing && (
            <div className="mt-3 flex gap-2">
              <button
                onClick={triggerFileInput}
                className="text-sm text-green-600 hover:text-green-700 font-medium"
              >
                {t("changePhoto")}
              </button>
              {profileData.profilePhoto && profileData.profilePhoto !== "/logo-econexo.png" && (
                <button
                  onClick={() => handleInputChange('profilePhoto', '/logo-econexo.png')}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  Usar Logo
                </button>
              )}
            </div>
          )}
        </div>

        {/* Personal Information */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {t("personalInformation")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("firstName")}
              </label>
              <input
                type="text"
                value={profileData.firstName}
                onChange={(e) => handleInputChange('firstName', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                placeholder={locale === 'de' ? "Vorname eingeben" : locale === 'en' ? "Enter first name" : "Ingresa tu nombre"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("lastName")}
              </label>
              <input
                type="text"
                value={profileData.lastName}
                onChange={(e) => handleInputChange('lastName', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                placeholder={locale === 'de' ? "Nachname eingeben" : locale === 'en' ? "Enter last name" : "Ingresa tu apellido"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("email")}
              </label>
              <input
                type="email"
                value={profileData.email}
                onChange={(e) => handleInputChange('email', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                placeholder={locale === 'de' ? "E-Mail eingeben" : locale === 'en' ? "Enter email" : "Ingresa tu email"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("phone")}
              </label>
              <input
                type="tel"
                value={profileData.phone}
                onChange={(e) => handleInputChange('phone', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                placeholder={locale === 'de' ? "Telefon eingeben" : locale === 'en' ? "Enter phone" : "Ingresa tu teléfono"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("city")}
              </label>
              <input
                type="text"
                value={profileData.city}
                onChange={(e) => handleInputChange('city', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                placeholder={locale === 'de' ? "Stadt eingeben" : locale === 'en' ? "Enter city" : "Ingresa tu ciudad"}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("country")}
              </label>
              <input
                type="text"
                value={profileData.country}
                onChange={(e) => handleInputChange('country', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                placeholder={locale === 'de' ? "Land eingeben" : locale === 'en' ? "Enter country" : "Ingresa tu país"}
              />
            </div>
          </div>
        </div>

        {/* About Me */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {t("aboutMe")}
          </h2>
          <textarea
            value={profileData.aboutMe}
            onChange={(e) => handleInputChange('aboutMe', e.target.value)}
            disabled={!isEditing}
            rows={4}
            className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
            placeholder={locale === 'de' ? "Erzähle etwas über dich..." : locale === 'en' ? "Tell us about yourself..." : "Cuéntanos sobre ti..."}
          />
        </div>

        {/* Passions and Expertise */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("passions")}
            </h2>
            <textarea
              value={profileData.passions}
              onChange={(e) => handleInputChange('passions', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
              placeholder={t("passionsPlaceholder")}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("areasOfExpertise")}
            </h2>
            <textarea
              value={profileData.areasOfExpertise}
              onChange={(e) => handleInputChange('areasOfExpertise', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
              placeholder={t("expertisePlaceholder")}
            />
          </div>
        </div>

        {/* Hobbies and Interests */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("hobbies")}
            </h2>
            <textarea
              value={profileData.hobbies}
              onChange={(e) => handleInputChange('hobbies', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
              placeholder={t("hobbiesPlaceholder")}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("interests")}
            </h2>
            <textarea
              value={profileData.interests}
              onChange={(e) => handleInputChange('interests', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
              placeholder={t("interestsPlaceholder")}
            />
          </div>
        </div>

        {/* Skills and Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("skills")}
            </h2>
            <textarea
              value={profileData.skills}
              onChange={(e) => handleInputChange('skills', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
              placeholder={t("skillsPlaceholder")}
            />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {t("languages")}
            </h2>
            <textarea
              value={profileData.languages}
              onChange={(e) => handleInputChange('languages', e.target.value)}
              disabled={!isEditing}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
              placeholder={t("languagesPlaceholder")}
            />
          </div>
        </div>

        {/* Social Media */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
            {t("socialMedia")}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("linkedin")}
              </label>
              <input
                type="url"
                value={profileData.linkedin}
                onChange={(e) => handleInputChange('linkedin', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                placeholder="https://linkedin.com/in/tu-perfil"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("twitter")}
              </label>
              <input
                type="url"
                value={profileData.twitter}
                onChange={(e) => handleInputChange('twitter', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                placeholder="https://twitter.com/tu-usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("instagram")}
              </label>
              <input
                type="url"
                value={profileData.instagram}
                onChange={(e) => handleInputChange('instagram', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                placeholder="https://instagram.com/tu-usuario"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("website")}
              </label>
              <input
                type="url"
                value={profileData.website}
                onChange={(e) => handleInputChange('website', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
                placeholder="https://tu-sitio-web.com"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
