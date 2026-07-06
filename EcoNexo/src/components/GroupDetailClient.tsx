"use client";
import { useState, useEffect, useCallback } from "react";
import { useI18n } from "@/lib/i18n";
import { useAuth } from "@/lib/auth";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { LocalGroup, GroupMember } from "@/lib/social-types";
import UserAvatar from "@/components/UserAvatar";

export default function GroupDetailClient({ groupId }: { groupId: string }) {
    const { t, locale } = useI18n();
    const { user } = useAuth();
    const router = useRouter();

    const [group, setGroup] = useState<LocalGroup | null>(null);
    const [members, setMembers] = useState<GroupMember[]>([]);
    const [isMember, setIsMember] = useState(false);
    const [userRole, setUserRole] = useState<'admin' | 'moderator' | 'member' | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState<'overview' | 'members' | 'events'>('overview');

    const loadGroup = useCallback(async () => {
        try {
            // TODO: Replace with actual API call
            const mockGroup: LocalGroup = {
                id: groupId,
                name: 'Berlín Sostenible',
                description: 'Comunidad de activistas ambientales en Berlín. Organizamos eventos de limpieza, talleres de sostenibilidad y campañas de concienciación.',
                city: 'Berlín',
                country: 'Alemania',
                region: 'Berlin',
                avatar_url: '/logo-econexo.png',
                cover_image_url: undefined,
                created_by: 'user1',
                created_by_name: 'María García',
                members_count: 45,
                events_count: 12,
                is_public: true,
                tags: ['Medio ambiente', 'Comunidad', 'Sostenibilidad'],
                created_at: new Date().toISOString()
            };
            setGroup(mockGroup);
        } catch (error) {
            console.error('Error loading group:', error);
        } finally {
            setLoading(false);
        }
    }, [groupId]);

    const checkMembership = async () => {
        try {
            // TODO: Replace with actual API call
            setIsMember(true);
            setUserRole('member');
        } catch (error) {
            console.error('Error checking membership:', error);
        }
    };

    useEffect(() => {
        if (groupId) {
            loadGroup();
            if (user) {
                checkMembership();
            }
        }
    }, [groupId, loadGroup, user]);

    const handleJoin = async () => {
        if (!user) {
            router.push(`/perfil?next=${encodeURIComponent(window.location.pathname)}`);
            return;
        }

        try {
            const response = await fetch(`/api/social/groups/${groupId}/join`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to join group');

            setIsMember(true);
            setUserRole('member');
            if (group) {
                setGroup({ ...group, members_count: group.members_count + 1 });
            }
        } catch (error) {
            console.error('Error joining group:', error);
        }
    };

    const handleLeave = async () => {
        try {
            const response = await fetch(`/api/social/groups/${groupId}/leave`, {
                method: 'POST',
            });

            if (!response.ok) throw new Error('Failed to leave group');

            setIsMember(false);
            setUserRole(null);
            if (group) {
                setGroup({ ...group, members_count: group.members_count - 1 });
            }
        } catch (error) {
            console.error('Error leaving group:', error);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
            </div>
        );
    }

    if (!group) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <p className="text-gray-600 dark:text-gray-400 mb-4">
                        {t("groupNotFound")}
                    </p>
                    <Link
                        href="/community/groups"
                        className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors inline-block"
                    >
                        {t("backToGroups")}
                    </Link>
                </div>
            </div>
        );
    }

    const isCreator = user?.id === group.created_by;
    const creatorAvatar = isCreator
        ? (user?.profile?.avatar_url || user?.profile?.picture || group.avatar_url || '/logo-econexo.png')
        : (group.avatar_url || '/logo-econexo.png');
    const creatorName = isCreator
        ? (user?.profile?.full_name || user?.email?.split('@')[0] || group.created_by_name)
        : group.created_by_name;

    return (
        <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 dark:from-slate-900 dark:to-slate-800">
            <div className="max-w-7xl mx-auto px-4 py-8">
                <Link
                    href="/community/groups"
                    className="text-green-600 hover:text-green-700 mb-4 inline-block"
                >
                    ← {t("backToGroups")}
                </Link>

                {group.cover_image_url ? (
                    <img
                        src={group.cover_image_url}
                        alt={group.name}
                        className="w-full h-64 object-cover rounded-lg mb-6"
                    />
                ) : (
                    <div className="w-full h-64 bg-gradient-to-r from-green-500 to-blue-500 rounded-lg mb-6"></div>
                )}

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg p-6 mb-6">
                    <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                        <div className="flex items-start gap-4">
                            <UserAvatar
                                src={creatorAvatar}
                                alt={group.name}
                                name={creatorName}
                                sizeClassName="w-20 h-20"
                                className="border-4 border-white dark:border-slate-800"
                            />
                            <div>
                                <h1 className="text-3xl font-bold text-gray-800 dark:text-white mb-2">{group.name}</h1>
                                <p className="text-gray-600 dark:text-gray-400 mb-2">
                                    📍 {group.city}, {group.country}
                                </p>
                                <p className="text-sm text-gray-500 dark:text-gray-500">
                                    {t("createdBy")} {creatorName}
                                </p>
                            </div>
                        </div>
                        <div className="flex gap-2">
                            {isCreator && (
                                <Link
                                    href={`/community/groups/${groupId}/editar`}
                                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                >
                                    {t("editLabel")}
                                </Link>
                            )}
                            {isMember ? (
                                <button
                                    onClick={handleLeave}
                                    className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                                >
                                    {t("leaveLabel")}
                                </button>
                            ) : (
                                <button
                                    onClick={handleJoin}
                                    className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                >
                                    {t("joinLabel")}
                                </button>
                            )}
                        </div>
                    </div>

                    {group.description && (
                        <p className="mt-4 text-gray-700 dark:text-gray-300">{group.description}</p>
                    )}

                    {group.tags && group.tags.length > 0 && (
                        <div className="flex flex-wrap gap-2 mt-4">
                            {group.tags.map((tag, idx) => (
                                <span
                                    key={idx}
                                    className="px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}

                    <div className="flex gap-6 mt-6 pt-6 border-t border-gray-200 dark:border-slate-700">
                        <div>
                            <div className="text-2xl font-bold text-green-600">{group.members_count}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {t("membersLabel")}
                            </div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-blue-600">{group.events_count}</div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                                {t("events")}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white dark:bg-slate-800 rounded-lg shadow-lg">
                    <div className="flex border-b border-gray-200 dark:border-slate-700">
                        {[
                            { id: 'overview', label: t("overviewLabel") },
                            { id: 'members', label: t("membersLabel") },
                            { id: 'events', label: t("events") }
                        ].map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id as any)}
                                className={`px-6 py-3 font-medium border-b-2 transition-colors ${activeTab === tab.id
                                    ? 'border-green-600 text-green-600 dark:text-green-400'
                                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200'
                                    }`}
                            >
                                {tab.label}
                            </button>
                        ))}
                    </div>

                    <div className="p-6">
                        {activeTab === 'overview' && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">
                                    {t("aboutThisGroup")}
                                </h2>
                                <p className="text-gray-700 dark:text-gray-300">{group.description}</p>
                            </div>
                        )}

                        {activeTab === 'members' && (
                            <div>
                                <h2 className="text-xl font-bold mb-4">
                                    {t("membersLabel")} ({group.members_count})
                                </h2>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t("memberListSoon")}
                                </p>
                            </div>
                        )}

                        {activeTab === 'events' && (
                            <div>
                                <div className="flex justify-between items-center mb-4">
                                    <h2 className="text-xl font-bold">
                                        {t("groupEventsTitle")} ({group.events_count})
                                    </h2>
                                    {isMember && (
                                        <Link
                                            href={`/eventos?group=${groupId}`}
                                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                                        >
                                            {t("createEvent")}
                                        </Link>
                                    )}
                                </div>
                                <p className="text-gray-600 dark:text-gray-400">
                                    {t("eventListSoon")}
                                </p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
