"use client";

import { MapPin } from "lucide-react";
import { useI18n } from "@/lib/i18n";
import { usePathname, useRouter } from "next/navigation";

export default function MapNearMeCta({ className = "" }: { className?: string }) {
  const { t } = useI18n();
  const pathname = usePathname();
  const router = useRouter();

  const exploreNearMe = () => {
    const scrollAndLocate = () => {
      document.getElementById("tour-home-map")?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
      window.setTimeout(() => {
        window.dispatchEvent(new Event("econexo:explore-near-me"));
      }, 500);
    };

    if (pathname !== "/") {
      router.push("/#tour-home-map");
      window.setTimeout(scrollAndLocate, 400);
    } else {
      scrollAndLocate();
    }
  };

  return (
    <button
      type="button"
      onClick={exploreNearMe}
      className={`inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-emerald-600 to-teal-600 px-4 py-2.5 text-sm font-bold text-white shadow-lg shadow-emerald-900/20 hover:from-emerald-500 hover:to-teal-500 transition-all hover:scale-[1.02] active:scale-[0.98] ${className}`}
    >
      <MapPin className="h-4 w-4 shrink-0" aria-hidden />
      {t("exploreNearMe")}
    </button>
  );
}
