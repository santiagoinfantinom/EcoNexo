"use client";
import { useState } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoGrupoPage() {
  const { t, locale } = useI18n();
  const { user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    city: "",
    country: "",
    region: "",
    is_public: true,
    tags: [] as string[],
  });
  const [tagInput, setTagInput] = useState("");

  const availableTags = [
    locale === 'es' ? 'Medio ambiente' : locale === 'de' ? 'Umwelt' : 'Environment',
    locale === 'es' ? 'Educación' : locale === 'de' ? 'Bildung' : 'Education',
    locale === 'es' ? 'Comunidad' : locale === 'de' ? 'Gemeinschaft' : 'Community',
    locale === 'es' ? 'Sostenibilidad' : locale === 'de' ? 'Nachhaltigkeit' : 'Sustainability',
    locale === 'es' ? 'Energía renovable' : locale === 'de' ? 'Erneuerbare Energie' : 'Renewable Energy',
    locale === 'es' ? 'Reciclaje' : locale === 'de' ? 'Recycling' : 'Recycling',
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      setError(locale === 'es' ? 'Debes iniciar sesión' : locale === 'de' ? 'Du musst dich anmelden' : 'You must sign in');
      return;
    }

    setLoading(true);
    setError("");

    try {
      // TODO: Replace with actual API call
      const response = await fetch("/api/social/groups", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        throw new Error("Failed to create group");
      }

      const data = await response.json();
      router.push(`/comunidad/grupos/${data.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creating group");
    } finally {
      setLoading(false);
    }
  };

  const addTag = (tag: string) => {
    if (tag && !formData.tags.includes(tag)) {
      setFormData({ ...formData, tags: [...formData.tags, tag] });
      setTagInput("");
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags.filter(t => t !== tag) });
  };

  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-8 max-w-md text-center">
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {locale === 'es'
              ? 'Debes iniciar sesión para crear un grupo'
              : locale === 'de'
              ? 'Du musst dich anmelden, um eine Gruppe zu erstellen'
              : 'You must sign in to create a group'}
          </p>
          <Link
            href="/perfil"
            className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block"
          >
            {locale === 'es' ? 'Iniciar Sesión' : locale === 'de' ? 'Anmelden' : 'Sign In'}
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
      <div className="max-w-3xl mx-auto px-4 py-8">
        <Link
          href="/comunidad/grupos"
          className="text-green-600 hover:text-green-700 mb-4 inline-block"
        >
          ← {locale === 'es' ? 'Volver a Grupos' : locale === 'de' ? 'Zurück zu Gruppen' : 'Back to Groups'}
        </Link>

        <h1 className="text-4xl font-bold text-gray-800 dark:text-white mb-8">
          {locale === 'es' ? 'Crear Nuevo Grupo' : locale === 'de' ? 'Neue Gruppe erstellen' : 'Create New Group'}
        </h1>

        <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 space-y-6">
          {error && (
            <div className="bg-red-100 dark:bg-red-900/30 border border-red-400 text-red-700 dark:text-red-400 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {locale === 'es' ? 'Nombre del Grupo' : locale === 'de' ? 'Gruppenname' : 'Group Name'} *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              required
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={locale === 'es' ? 'Ej: Berlín Sostenible' : locale === 'de' ? 'z.B. Berlin Nachhaltig' : 'e.g. Berlin Sustainable'}
            />
          </div>

          {/* Description */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {locale === 'es' ? 'Descripción' : locale === 'de' ? 'Beschreibung' : 'Description'} *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              rows={4}
              className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder={locale === 'es' ? 'Describe el propósito y objetivos del grupo...' : locale === 'de' ? 'Beschreibe den Zweck und die Ziele der Gruppe...' : 'Describe the purpose and goals of the group...'}
            />
          </div>

          {/* Location */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {locale === 'es' ? 'Ciudad' : locale === 'de' ? 'Stadt' : 'City'} *
              </label>
              <input
                type="text"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {locale === 'es' ? 'País' : locale === 'de' ? 'Land' : 'Country'} *
              </label>
              <input
                type="text"
                value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {locale === 'es' ? 'Región' : locale === 'de' ? 'Region' : 'Region'}
              </label>
              <input
                type="text"
                value={formData.region}
                onChange={(e) => setFormData({ ...formData, region: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>
          </div>

          {/* Tags */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {locale === 'es' ? 'Etiquetas' : locale === 'de' ? 'Tags' : 'Tags'}
            </label>
            <div className="flex flex-wrap gap-2 mb-2">
              {formData.tags.map((tag, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm flex items-center gap-2"
                >
                  {tag}
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="text-green-600 dark:text-green-400 hover:text-green-800 dark:hover:text-green-200"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="text"
                value={tagInput}
                onChange={(e) => setTagInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    addTag(tagInput);
                  }
                }}
                placeholder={locale === 'es' ? 'Agregar etiqueta...' : locale === 'de' ? 'Tag hinzufügen...' : 'Add tag...'}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-slate-700 rounded-lg bg-white dark:bg-slate-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              />
              <button
                type="button"
                onClick={() => addTag(tagInput)}
                className="px-4 py-2 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600"
              >
                {locale === 'es' ? 'Agregar' : locale === 'de' ? 'Hinzufügen' : 'Add'}
              </button>
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              {availableTags
                .filter(tag => !formData.tags.includes(tag))
                .map((tag, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => addTag(tag)}
                    className="px-2 py-1 text-xs bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-slate-600"
                  >
                    + {tag}
                  </button>
                ))}
            </div>
          </div>

          {/* Privacy */}
          <div className="flex items-center gap-2">
            <input
              type="checkbox"
              id="is_public"
              checked={formData.is_public}
              onChange={(e) => setFormData({ ...formData, is_public: e.target.checked })}
              className="rounded border-gray-300 text-green-600 focus:ring-green-500"
            />
            <label htmlFor="is_public" className="text-sm text-gray-700 dark:text-gray-300">
              {locale === 'es'
                ? 'Grupo público (cualquiera puede unirse)'
                : locale === 'de'
                ? 'Öffentliche Gruppe (jeder kann beitreten)'
                : 'Public group (anyone can join)'}
            </label>
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium disabled:opacity-50"
            >
              {loading
                ? (locale === 'es' ? 'Creando...' : locale === 'de' ? 'Erstellen...' : 'Creating...')
                : (locale === 'es' ? 'Crear Grupo' : locale === 'de' ? 'Gruppe erstellen' : 'Create Group')}
            </button>
            <Link
              href="/comunidad/grupos"
              className="px-6 py-3 bg-gray-200 dark:bg-slate-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-300 dark:hover:bg-slate-600 transition-colors"
            >
              {locale === 'es' ? 'Cancelar' : locale === 'de' ? 'Abbrechen' : 'Cancel'}
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}

