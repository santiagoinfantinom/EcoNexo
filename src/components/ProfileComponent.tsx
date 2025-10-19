"use client";
import { useState, useEffect, useRef } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabaseClient";
import EcoNexoLogo from "./EcoNexoLogo";
import AuthButton from "./AuthButton";

interface ProfileData {
  // Basic Information
  full_name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  
  // Personal Details
  birthdate: string;
  birth_place: string;
  pronouns: string;
  gender: string;
  
  // Location
  city: string;
  country: string;
  timezone: string;
  
  // Profile Content
  about_me: string;
  bio: string;
  avatar_url: string;
  
  // Interests and Skills
  passions: string;
  hobbies: string;
  interests: string;
  skills: string;
  areas_of_expertise: string;
  languages: string;
  
  // Social Media
  linkedin_url: string;
  twitter_url: string;
  instagram_url: string;
  website_url: string;
  github_url: string;
  
  // Preferences
  preferred_language: string;
  newsletter_subscribed: boolean;
  notifications_enabled: boolean;
  profile_visibility: string;
}

export default function ProfileComponent() {
  const { t, locale } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [profileData, setProfileData] = useState<ProfileData>({
    // Basic Information
    full_name: "",
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    
    // Personal Details
    birthdate: "",
    birth_place: "",
    pronouns: "",
    gender: "",
    
    // Location
    city: "",
    country: "",
    timezone: "",
    
    // Profile Content
    about_me: "",
    bio: "",
    avatar_url: "/logo-econexo.png",
    
    // Interests and Skills
    passions: "",
    hobbies: "",
    interests: "",
    skills: "",
    areas_of_expertise: "",
    languages: "",
    
    // Social Media
    linkedin_url: "",
    twitter_url: "",
    instagram_url: "",
    website_url: "",
    github_url: "",
    
    // Preferences
    preferred_language: locale,
    newsletter_subscribed: false,
    notifications_enabled: true,
    profile_visibility: "public"
  });

  // Load profile data from Supabase or localStorage
  useEffect(() => {
    const loadProfile = async () => {
      if (!user) {
        // Load from localStorage if no user
        const savedProfile = localStorage.getItem('econexo:profile');
        if (savedProfile) {
          setProfileData(JSON.parse(savedProfile));
        }
        return;
      }

      if (!isSupabaseConfigured()) {
        // Fallback to localStorage if Supabase not configured
        const savedProfile = localStorage.getItem('econexo:profile');
        if (savedProfile) {
          setProfileData(JSON.parse(savedProfile));
        }
        return;
      }

      try {
        const supabase = getSupabase();
        const { data, error } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 = no rows returned
          console.error('Error loading profile:', error);
          setError('Error cargando perfil');
          return;
        }

        if (data) {
          setProfileData(prev => ({
            ...prev,
            ...data,
            avatar_url: data.avatar_url || "/logo-econexo.png"
          }));
        }
      } catch (err) {
        console.error('Error loading profile:', err);
        setError('Error cargando perfil');
      }
    };

    loadProfile();
  }, [user]);

  const handleInputChange = (field: keyof ProfileData, value: string) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handlePhotoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        alert(t('pleaseSelectValidImage' + locale.charAt(0).toUpperCase() + locale.slice(1)));
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert(t('imageTooLarge' + locale.charAt(0).toUpperCase() + locale.slice(1)));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        if (result) {
          const updatedProfile = { ...profileData, profilePhoto: result };
          setProfileData(updatedProfile);
          // Save immediately when photo is changed
          localStorage.setItem('econexo:profile', JSON.stringify(updatedProfile));
          setShowSuccess(true);
          setTimeout(() => setShowSuccess(false), 3000);
          console.log('Photo uploaded and saved successfully');
        }
      };
      reader.onerror = () => {
        alert(t('errorLoadingImage' + locale.charAt(0).toUpperCase() + locale.slice(1)));
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    setError("");
    
    try {
      if (user && isSupabaseConfigured()) {
        // Save to Supabase
        const supabase = getSupabase();
        const { error } = await supabase
          .from('profiles')
          .upsert({
            id: user.id,
            ...profileData,
            updated_at: new Date().toISOString()
          });

        if (error) {
          console.error('Error saving profile:', error);
          setError('Error guardando perfil');
          return;
        }
      } else {
        // Fallback to localStorage
        localStorage.setItem('econexo:profile', JSON.stringify(profileData));
      }
      
      setIsEditing(false);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 3000);
    } catch (error) {
      console.error('Error saving profile:', error);
      setError('Error guardando perfil');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = async () => {
    // Reload from Supabase or localStorage to discard changes
    if (user && isSupabaseConfigured()) {
      try {
        const supabase = getSupabase();
        const { data } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', user.id)
          .single();

        if (data) {
          setProfileData(prev => ({
            ...prev,
            ...data,
            avatar_url: data.avatar_url || "/logo-econexo.png"
          }));
        }
      } catch (err) {
        console.error('Error reloading profile:', err);
      }
    } else {
      const savedProfile = localStorage.getItem('econexo:profile');
      if (savedProfile) {
        setProfileData(JSON.parse(savedProfile));
      }
    }
    setIsEditing(false);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  // Show loading state while auth is loading
  if (authLoading) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 text-white">
          <div className="animate-pulse">
            <div className="h-8 bg-green-500 rounded w-48 mb-2"></div>
            <div className="h-4 bg-green-400 rounded w-32"></div>
          </div>
        </div>
        <div className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-32 w-32 bg-gray-200 dark:bg-gray-700 rounded-full mx-auto"></div>
            <div className="space-y-2">
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Show auth prompt if not logged in
  if (!user) {
    return (
      <div className="max-w-4xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-700 px-6 py-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold">{t("myProfile")}</h1>
              <p className="text-green-100 text-sm mt-1">
                {t("signInToAccessProfile")}
              </p>
            </div>
            <EcoNexoLogo className="w-12 h-12" size={48} />
          </div>
        </div>
        <div className="p-6 text-center">
          <div className="mb-6">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {t("accessYourProfile")}
            </h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {t("signInToManageProfile")}
            </p>
            <AuthButton size="lg" />
          </div>
          <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-4">
            <h3 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
              {t("whatYouCanDo")}
            </h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• {t("managePersonalInfo")}</li>
              <li>• {t("setPreferences")}</li>
              <li>• {t("trackActivities")}</li>
              <li>• {t("connectWithCommunity")}</li>
            </ul>
          </div>
        </div>
      </div>
    );
  }

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
                    (t('saving' + locale.charAt(0).toUpperCase() + locale.slice(1))) : 
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

      {/* Error Message */}
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 mx-6 mt-4 rounded">
          <div className="flex items-center gap-2">
            <span>⚠️</span>
            <span>{error}</span>
          </div>
        </div>
      )}

      <div className="p-6">
        {/* Profile Photo Section */}
        <div className="flex flex-col items-center mb-8">
          <div className="relative">
            {profileData.avatar_url && profileData.avatar_url !== "/logo-econexo.png" ? (
              <img
                src={profileData.avatar_url}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-green-200 dark:border-green-700"
              />
            ) : (
              <EcoNexoLogo 
                className="w-32 h-32" 
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
              {profileData.avatar_url && profileData.avatar_url !== "/logo-econexo.png" && (
                <button
                  onClick={() => {
                    const updatedProfile = { ...profileData, avatar_url: '/logo-econexo.png' };
                    setProfileData(updatedProfile);
                    if (!user || !isSupabaseConfigured()) {
                      localStorage.setItem('econexo:profile', JSON.stringify(updatedProfile));
                    }
                    setShowSuccess(true);
                    setTimeout(() => setShowSuccess(false), 2000);
                    console.log('Switched back to EcoNexo logo');
                  }}
                  className="text-sm text-gray-500 hover:text-gray-700 font-medium"
                >
                  {t("useLogo")}
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
                value={profileData.first_name}
                onChange={(e) => handleInputChange('first_name', e.target.value)}
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
                value={profileData.last_name}
                onChange={(e) => handleInputChange('last_name', e.target.value)}
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
                {t("birthdate")}
              </label>
              <input
                type="date"
                value={profileData.birthdate}
                onChange={(e) => handleInputChange('birthdate', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("pronouns")}
              </label>
              <select
                value={profileData.pronouns}
                onChange={(e) => handleInputChange('pronouns', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
              >
                <option value="">{t("selectPronouns")}</option>
                <option value="él/ella">{t("heShe")}</option>
                <option value="they/them">{t("theyThem")}</option>
                <option value="er/sie">{t("erSie")}</option>
                <option value="other">{t("other")}</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                {t("gender")}
              </label>
              <select
                value={profileData.gender}
                onChange={(e) => handleInputChange('gender', e.target.value)}
                disabled={!isEditing}
                className="w-full px-3 py-2 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent dark:bg-slate-700 dark:text-slate-100 disabled:bg-gray-100 dark:disabled:bg-slate-600"
              >
                <option value="">{t("selectGender")}</option>
                <option value="male">{t("male")}</option>
                <option value="female">{t("female")}</option>
                <option value="non-binary">{t("nonBinary")}</option>
                <option value="prefer-not-to-say">{t("preferNotToSay")}</option>
              </select>
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
            value={profileData.about_me}
            onChange={(e) => handleInputChange('about_me', e.target.value)}
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
              value={profileData.areas_of_expertise}
              onChange={(e) => handleInputChange('areas_of_expertise', e.target.value)}
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
                value={profileData.linkedin_url}
                onChange={(e) => handleInputChange('linkedin_url', e.target.value)}
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
                value={profileData.twitter_url}
                onChange={(e) => handleInputChange('twitter_url', e.target.value)}
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
                value={profileData.instagram_url}
                onChange={(e) => handleInputChange('instagram_url', e.target.value)}
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
                value={profileData.website_url}
                onChange={(e) => handleInputChange('website_url', e.target.value)}
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
