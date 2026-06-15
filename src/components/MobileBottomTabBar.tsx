"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useI18n } from "@/lib/i18n";
import { Map, Calendar, MapPin, LayoutGrid } from "lucide-react";
import { useState, useEffect } from "react";
import MobileMoreMenu from "./MobileMoreMenu";

export default function MobileBottomTabBar() {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [moreOpen, setMoreOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const exploreNearMe = () => {
    if (pathname !== "/") {
      router.push("/#tour-home-map");
      window.setTimeout(() => {
        document.getElementById("tour-home-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
        window.dispatchEvent(new Event("econexo:explore-near-me"));
      }, 400);
    } else {
      document.getElementById("tour-home-map")?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.setTimeout(() => window.dispatchEvent(new Event("econexo:explore-near-me")), 400);
    }
  };

  const navItems = [
    { type: "link" as const, href: "/", label: t("map") || "Mapa", icon: Map, id: "tab-home", tour: "tab-home" },
    { type: "link" as const, href: "/eventos", label: t("events") || "Eventos", icon: Calendar, id: "tab-events", tour: "tab-events" },
    { type: "action" as const, label: t("exploreNearMe"), icon: MapPin, id: "tab-explore", action: exploreNearMe },
    { type: "more" as const, label: t("mobileMore"), icon: LayoutGrid, id: "tab-more" },
  ];

  return (
    <>
      <MobileMoreMenu open={moreOpen} onClose={() => setMoreOpen(false)} />
      <nav
        id="mobile-bottom-nav"
        className="md:hidden fixed bottom-0 left-0 right-0 z-[100] border-t border-white/10"
        style={{
          background: "rgba(11, 43, 38, 0.97)",
          backdropFilter: "blur(20px)",
          WebkitBackdropFilter: "blur(20px)",
          paddingBottom: "env(safe-area-inset-bottom, 0px)",
          boxShadow: "0 -10px 40px rgba(0,0,0,0.35)",
        }}
      >
        <div className="flex items-center justify-around px-1 pt-2 pb-2">
          {navItems.map((item) => {
            const isActive =
              item.type === "link" &&
              (pathname === item.href ||
                (item.href !== "/" && pathname?.startsWith(item.href)));

            const color = isActive ? "#4ade80" : "rgba(255,255,255,0.55)";

            if (item.type === "link") {
              return (
                <Link
                  key={item.id}
                  href={item.href}
                  id={item.id}
                  data-tour={item.tour}
                  className="flex flex-col items-center justify-center min-w-[64px] py-1 transition-all duration-300"
                  style={{
                    WebkitTapHighlightColor: "transparent",
                    color,
                    transform: isActive ? "scale(1.08)" : "scale(1)",
                  }}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="font-bold tracking-wider text-[9px] leading-tight text-center px-0.5">
                    {item.label}
                  </span>
                </Link>
              );
            }

            if (item.type === "action") {
              return (
                <button
                  key={item.id}
                  type="button"
                  id={item.id}
                  onClick={item.action}
                  className="flex flex-col items-center justify-center min-w-[64px] py-1 transition-all duration-300"
                  style={{ WebkitTapHighlightColor: "transparent", color }}
                >
                  <item.icon className="w-6 h-6 mb-1" />
                  <span className="font-bold tracking-wider text-[9px] leading-tight text-center px-0.5">
                    {item.label}
                  </span>
                </button>
              );
            }

            return (
              <button
                key={item.id}
                type="button"
                id={item.id}
                onClick={() => setMoreOpen(true)}
                className="flex flex-col items-center justify-center min-w-[64px] py-1 transition-all duration-300"
                style={{
                  WebkitTapHighlightColor: "transparent",
                  color: moreOpen ? "#4ade80" : "rgba(255,255,255,0.55)",
                }}
              >
                <item.icon className="w-6 h-6 mb-1" />
                <span className="font-bold tracking-wider text-[9px] leading-tight text-center px-0.5">
                  {item.label}
                </span>
              </button>
            );
          })}
        </div>
      </nav>
    </>
  );
}
