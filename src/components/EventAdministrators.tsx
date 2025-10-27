"use client";
import React, { useState, useEffect } from "react";
import { useAuth } from "@/lib/auth";
import { useI18n } from "@/lib/i18n";

interface Administrator {
  id: string;
  user_id: string;
  event_id: string;
  created_at: string;
  profiles?: {
    full_name?: string;
    email?: string;
    avatar_url?: string;
  };
}

interface EventAdministratorsProps {
  eventId: string;
  isCreator?: boolean;
}

export default function EventAdministrators({ eventId, isCreator }: EventAdministratorsProps) {
  const { t } = useI18n();
  const { user } = useAuth();
  const [administrators, setAdministrators] = useState<Administrator[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);

  useEffect(() => {
    fetchAdministrators();
  }, [eventId]);

  const fetchAdministrators = async () => {
    try {
      const res = await fetch(`/api/events/${eventId}/administrators`);
      if (res.ok) {
        const data = await res.json();
        setAdministrators(data || []);
      }
    } catch (err) {
      console.error("Error fetching administrators:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddAdministrator = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setAdding(true);
    try {
      // First, get user ID from email by searching profiles
      // For now, we'll use the email as the identifier
      const res = await fetch(`/api/events/${eventId}/administrators`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user_id: email }), // This is simplified - in production you'd look up the user_id
      });

      if (res.ok) {
        setEmail("");
        setShowAddForm(false);
        fetchAdministrators();
      } else {
        alert("Error adding administrator");
      }
    } catch (err) {
      console.error("Error adding administrator:", err);
      alert("Error adding administrator");
    } finally {
      setAdding(false);
    }
  };

  const handleRemoveAdministrator = async (adminId: string) => {
    if (!confirm("Are you sure you want to remove this administrator?")) return;

    try {
      const res = await fetch(
        `/api/events/${eventId}/administrators?user_id=${adminId}`,
        { method: "DELETE" }
      );

      if (res.ok) {
        fetchAdministrators();
      } else {
        alert("Error removing administrator");
      }
    } catch (err) {
      console.error("Error removing administrator:", err);
      alert("Error removing administrator");
    }
  };

  const isCurrentUserAdmin = administrators.some(
    (admin) => admin.user_id === user?.id
  );

  if (loading) return <div>{t("loading")}...</div>;

  return (
    <div className="mt-6 border-t pt-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">{t("eventAdministrators")}</h3>
        {(isCreator || isCurrentUserAdmin) && (
          <button
            onClick={() => setShowAddForm(!showAddForm)}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 text-sm"
          >
            {t("addAdministrator")}
          </button>
        )}
      </div>

      {showAddForm && (isCreator || isCurrentUserAdmin) && (
        <form
          onSubmit={handleAddAdministrator}
          className="mb-4 p-4 bg-gray-50 rounded-lg"
        >
          <input
            type="text"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={t("administratorEmail")}
            className="w-full px-3 py-2 border rounded-lg mb-2"
            required
          />
          <div className="flex gap-2">
            <button
              type="submit"
              disabled={adding}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 text-sm"
            >
              {adding ? t("loading") : t("addAsAdministrator")}
            </button>
            <button
              type="button"
              onClick={() => {
                setShowAddForm(false);
                setEmail("");
              }}
              className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 text-sm"
            >
              {t("cancel")}
            </button>
          </div>
        </form>
      )}

      {administrators.length === 0 ? (
        <p className="text-gray-500">{t("noAdministrators")}</p>
      ) : (
        <ul className="space-y-2">
          {administrators.map((admin) => (
            <li
              key={admin.id}
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                {admin.profiles?.avatar_url && (
                  <img
                    src={admin.profiles.avatar_url}
                    alt=""
                    className="w-10 h-10 rounded-full"
                  />
                )}
                <div>
                  <div className="font-medium">
                    {admin.profiles?.full_name || admin.user_id}
                  </div>
                  {admin.profiles?.email && (
                    <div className="text-sm text-gray-500">
                      {admin.profiles.email}
                    </div>
                  )}
                  {isCreator && (
                    <span className="text-xs text-green-600 font-semibold">
                      {t("eventCreator")}
                    </span>
                  )}
                </div>
              </div>
              {isCreator && admin.user_id !== user?.id && (
                <button
                  onClick={() => handleRemoveAdministrator(admin.user_id)}
                  className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
                  title={t("removeAdministrator")}
                >
                  ✕
                </button>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

