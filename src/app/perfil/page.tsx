"use client";
import React, { useState, useEffect } from "react";
import { useI18n } from "@/lib/i18n";

type Profile = {
  name: string;
  email: string;
  bio: string;
  interests: string;
  language: "es" | "en" | "de";
};

export default function ProfilePage() {
  const { t, locale, setLocale } = useI18n();
  const [profile, setProfile] = useState<Profile>({
    name: "",
    email: "",
    bio: "",
    interests: "",
    language: locale,
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch(`/api/profiles?id=demo-user`, { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          setProfile(data);
        }
      } catch {}
    })();
  }, []);

  const save = async () => {
    try {
      await fetch(`/api/profiles`, { method: "POST", body: JSON.stringify({ id: "demo-user", ...profile }) });
    } catch {}
    setSaved(true);
    setTimeout(() => setSaved(false), 1500);
    setLocale(profile.language);
  };

  return (
    <div className="container mx-auto max-w-3xl">
      <h1 className="text-2xl font-bold mb-6">{t("editProfile")}</h1>
      <div className="space-y-4 bg-white dark:bg-slate-800 p-6 rounded-xl shadow">
        <div>
          <label className="block text-sm mb-1">{t("fullName")}</label>
          <input className="w-full border rounded p-2 dark:bg-slate-700" value={profile.name} onChange={(e)=>setProfile({...profile,name:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-1">Email</label>
          <input className="w-full border rounded p-2 dark:bg-slate-700" value={profile.email} onChange={(e)=>setProfile({...profile,email:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-1">{t("bio")}</label>
          <textarea className="w-full border rounded p-2 dark:bg-slate-700" rows={3} value={profile.bio} onChange={(e)=>setProfile({...profile,bio:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-1">{t("interests")}</label>
          <input className="w-full border rounded p-2 dark:bg-slate-700" value={profile.interests} onChange={(e)=>setProfile({...profile,interests:e.target.value})} />
        </div>
        <div>
          <label className="block text-sm mb-1">{t("language")}</label>
          <select className="w-full border rounded p-2 dark:bg-slate-700" value={profile.language} onChange={(e)=>setProfile({...profile,language:e.target.value as Profile["language"]})}>
            <option value="es">Español</option>
            <option value="en">English</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
        <button onClick={save} className="px-4 py-2 bg-green-600 text-white rounded">
          {t("saveProfile")}
        </button>
        {saved && <p className="text-green-600">{t("saved")}</p>}
      </div>
    </div>
  );
}


