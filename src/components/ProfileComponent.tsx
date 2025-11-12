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
  
  // OAuth Data
  oauth_provider?: string;
  oauth_data?: {
    age?: number;
    verified_email?: boolean;
    locale?: string;
    hd?: string;
    tenant_id?: string;
    preferred_username?: string;
    upn?: string;
    raw_metadata?: any;
  };
}

export default function ProfileComponent() {
  const { t, locale } = useI18n();
  const { user, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
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
      let isFirstLogin = false;
      
      // Check for OAuth imported data first
      const oauthData = localStorage.getItem('oauth_data');
      if (oauthData) {
        try {
          const importedData = JSON.parse(oauthData);
          console.log('📥 Datos OAuth importados:', importedData);
          
          // Import OAuth data into profile
          setProfileData(prev => ({
            ...prev,
            full_name: importedData.name || prev.full_name,
            email: importedData.email || prev.email,
                    avatar_url: importedData.picture || '/logo-econexo.png',
            preferred_language: importedData.locale || prev.preferred_language,
            // Mark as imported
            oauth_imported: true,
            oauth_provider: importedData.provider
          }));
          
          // Clear OAuth data after import
          localStorage.removeItem('oauth_data');
          
          // Show success message
          setSuccessMessage(`✅ Datos importados desde ${importedData.provider === 'google' ? 'Google' : 'Microsoft'}`);
          setTimeout(() => setSuccessMessage(''), 5000);
          
          // Mark as first login to show edit mode
          isFirstLogin = true;
          
        } catch (err) {
          console.error('Error importing OAuth data:', err);
        }
      }
      
      if (!user) {
        // Load from localStorage if no user
        const authProvider = localStorage.getItem('econexo_auth_provider');
        const savedProfile = localStorage.getItem('econexo:profile');
        
        if (authProvider && savedProfile) {
          // User is logged in via OAuth but not via Supabase
          const parsedProfile = JSON.parse(savedProfile);
          console.log('📥 Cargando perfil desde localStorage:', parsedProfile);
          
          // Check if this is a first login by checking oauth_imported flag
          if (parsedProfile.oauth_imported && parsedProfile.oauth_imported === true) {
            isFirstLogin = true;
            // Remove the flag so it doesn't trigger again
            parsedProfile.oauth_imported = false;
            localStorage.setItem('econexo:profile', JSON.stringify(parsedProfile));
          }
          
          setProfileData(prev => ({
            ...prev,
            ...parsedProfile,
                   avatar_url: parsedProfile.avatar_url || '/logo-econexo.png'
          }));
        }
        
        setIsLoading(false);
        
        // Show edit mode on first login
        if (isFirstLogin) {
          setIsEditing(true);
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

  // Check if user is logged in via OAuth (localStorage)
  const isOAuthLoggedIn = typeof window !== 'undefined' && 
    localStorage.getItem('econexo_auth_provider') && 
    localStorage.getItem('econexo:profile');
  
  // Show auth prompt if not logged in
  if (!user && !isOAuthLoggedIn) {
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
            <p className="text-slate-600 dark:text-slate-400 mb-6">
              {t("signInToManageProfile")}
            </p>
            <AuthButton size="lg" />
          </div>
          <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
            <h3 className="font-semibold text-slate-900 dark:text-slate-100 mb-2">
              {t("whatYouCanDo")}
            </h3>
            <ul className="text-sm text-slate-600 dark:text-slate-400 space-y-1">
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
              <div className="flex items-center gap-3">
                <h1 className="text-3xl font-bold">{t("myProfile")}</h1>
                {profileData.oauth_provider && (
                  <div className="flex items-center gap-2 bg-white/20 px-3 py-1 rounded-full">
                    {profileData.oauth_provider === 'google' ? (
                      <>
                        <svg className="w-4 h-4" viewBox="0 0 24 24">
                          <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                          <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                          <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                          <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                        </svg>
                        <span className="text-sm font-medium">Google</span>
                      </>
                    ) : profileData.oauth_provider === 'azure' ? (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M1 12L11 2L13.5 4.5L6.5 11.5H23L13 21.5L10.5 19L17.5 12H1Z"/>
                        </svg>
                        <span className="text-sm font-medium">Microsoft</span>
                      </>
                    ) : (
                      <span className="text-sm font-medium">{profileData.oauth_provider}</span>
                    )}
                  </div>
                )}
              </div>
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
                  className="bg-green-600 hover:bg-green-700 text-white px-6 py-3 rounded-lg transition-colors text-sm font-semibold disabled:opacity-50 shadow-md hover:shadow-lg border-2 border-green-700"
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
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 text-green-800 dark:text-green-200 px-4 py-3 mx-6 mt-4 rounded-lg font-medium">
          {t("profileUpdated")}
        </div>
      )}

      {/* OAuth Import Success Message */}
      {successMessage && (
        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-800 dark:text-blue-200 px-4 py-3 mx-6 mt-4 rounded-lg font-medium">
          {successMessage}
        </div>
      )}

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-800 dark:text-red-200 px-4 py-3 mx-6 mt-4 rounded-lg font-medium">
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
                className="text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 font-semibold transition-colors"
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
                  className="text-sm text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300 font-semibold transition-colors"
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
                <option value={t("pronounHe")}>{t("pronounHe")}</option>
                <option value={t("pronounShe")}>{t("pronounShe")}</option>
                <option value={t("pronounThey")}>{t("pronounThey")}</option>
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

        {/* OAuth Provider Information */}
        {profileData.oauth_provider && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
              {profileData.oauth_provider === 'google' ? t('googleInformation') : 
               profileData.oauth_provider === 'azure' ? t('microsoftInformation') : 
               t('providerInformation')}
            </h2>
            <div className="bg-slate-50 dark:bg-slate-700 rounded-lg p-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {profileData.oauth_data?.age && (
                  <div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t('calculatedAge')}:
                    </span>
                    <p className="text-slate-900 dark:text-slate-100 font-semibold">
                      {profileData.oauth_data.age} {t('years')}
                    </p>
                  </div>
                )}
                {profileData.oauth_data?.verified_email && (
                  <div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t('verifiedEmail')}:
                    </span>
                    <p className="text-green-600 dark:text-green-400 font-semibold">
                      ✅ {t('verified')}
                    </p>
                  </div>
                )}
                {profileData.oauth_data?.locale && (
                  <div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t('preferredLanguage')}:
                    </span>
                    <p className="text-slate-900 dark:text-slate-100 font-semibold">
                      {profileData.oauth_data.locale}
                    </p>
                  </div>
                )}
                {profileData.oauth_data?.hd && (
                  <div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t('googleWorkspaceDomain')}:
                    </span>
                    <p className="text-slate-900 dark:text-slate-100 font-semibold">
                      {profileData.oauth_data.hd}
                    </p>
                  </div>
                )}
                {profileData.oauth_data?.tenant_id && (
                  <div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t('tenantId')}:
                    </span>
                    <p className="text-slate-900 dark:text-slate-100 font-semibold">
                      {profileData.oauth_data.tenant_id}
                    </p>
                  </div>
                )}
                {profileData.oauth_data?.preferred_username && (
                  <div>
                    <span className="text-sm font-medium text-slate-600 dark:text-slate-400">
                      {t('preferredUsername')}:
                    </span>
                    <p className="text-slate-900 dark:text-slate-100 font-semibold">
                      {profileData.oauth_data.preferred_username}
                    </p>
                  </div>
                )}
              </div>
              <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-600">
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  {t('extractedFromOAuth')}
                </p>
              </div>
            </div>
          </div>
        )}

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
