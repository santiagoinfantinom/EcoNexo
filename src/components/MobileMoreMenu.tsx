"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  X,
  Newspaper,
  MessageCircle,
  Briefcase,
  Crosshair,
  Users,
  User,
  Info,
} from "lucide-react";
import { useI18n } from "@/lib/i18n";

type MobileMoreMenuProps = {
  open: boolean;
  onClose: () => void;
};

export default function MobileMoreMenu({ open, onClose }: MobileMoreMenuProps) {
  const { t, locale } = useI18n();
  const pathname = usePathname();

  if (!open) return null;

  const links = [
    { href: "/noticias", label: t("news") || "News", icon: Newspaper },
    { href: "/chat", label: t("chat"), icon: MessageCircle },
    { href: "/trabajos", label: t("jobs"), icon: Briefcase },
    { href: "/misiones", label: t("missions"), icon: Crosshair },
    {
      href: "/proyectos-comunitarios",
      label: locale === "es" ? "Proyectos comunitarios" : "Community projects",
      icon: Users,
    },
    { href: "/perfil", label: t("profile"), icon: User },
    { href: "/about", label: t("aboutUs"), icon: Info },
  ];

  return (
    <div className="md:hidden fixed inset-0 z-[110]" role="dialog" aria-modal="true">
      <button
        type="button"
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        aria-label={t("close")}
        onClick={onClose}
      />
      <div className="absolute bottom-0 left-0 right-0 rounded-t-2xl border-t border-white/10 bg-[#0b2b26] p-4 pb-[calc(1rem+env(safe-area-inset-bottom))] shadow-2xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-bold text-white">{t("mobileMore")}</h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-2 text-white/70 hover:bg-white/10 hover:text-white"
            aria-label={t("close")}
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {links.map((item) => {
            const active =
              pathname === item.href ||
              (item.href !== "/" && pathname?.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-3 rounded-xl border px-4 py-3 transition-colors ${
                  active
                    ? "border-green-400/50 bg-green-500/20 text-green-200"
                    : "border-white/10 bg-white/5 text-white/85 hover:bg-white/10"
                }`}
              >
                <item.icon className="h-5 w-5 shrink-0 text-green-400" />
                <span className="text-sm font-semibold leading-tight">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}