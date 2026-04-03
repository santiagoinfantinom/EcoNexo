"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { Map, Calendar, Crosshair, User } from "lucide-react";
import { useState, useEffect } from "react";

export default function MobileBottomTabBar() {
  const { t, locale } = useI18n();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Don't render on server to avoid hydration mismatch
  if (!mounted) return null;

  const navItems = [
    { href: "/", label: t("map") || "Mapa", icon: Map, id: "tab-home" },
    { href: "/eventos", label: t("events") || "Eventos", icon: Calendar, id: "tab-events" },
    { href: "/misiones", label: locale === 'es' ? 'Misiones' : locale === 'de' ? 'Missionen' : 'Missions', icon: Crosshair, id: "tab-missions" },
    { href: "/perfil", label: t("profile") || "Perfil", icon: User, id: "tab-profile" },
  ];

  return (
    <nav 
      id="mobile-bottom-nav"
      className="md:hidden fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10"
      style={{
        background: 'rgba(11, 43, 38, 0.97)',
        backdropFilter: 'blur(20px)',
        WebkitBackdropFilter: 'blur(20px)',
        paddingBottom: 'env(safe-area-inset-bottom, 0px)',
        boxShadow: '0 -10px 40px rgba(0,0,0,0.35)',
      }}
    >
      <div className="flex items-center justify-around px-2 pt-2 pb-2">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname?.startsWith(item.href));
          
          return (
            <Link
              key={item.href}
              href={item.href}
              id={item.id}
              className="flex flex-col items-center justify-center min-w-[72px] py-1 transition-all duration-300"
              style={{ 
                WebkitTapHighlightColor: 'transparent',
                color: isActive ? '#4ade80' : 'rgba(255,255,255,0.55)',
                transform: isActive ? 'scale(1.1)' : 'scale(1)',
              }}
            >
              <item.icon 
                className="w-6 h-6 mb-1" 
                style={isActive ? { filter: 'drop-shadow(0 0 8px rgba(74,222,128,0.5))' } : {}}
              />
              <span 
                className="font-bold tracking-wider"
                style={{ 
                  fontSize: '10px',
                  opacity: isActive ? 1 : 0.8,
                }}
              >
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
