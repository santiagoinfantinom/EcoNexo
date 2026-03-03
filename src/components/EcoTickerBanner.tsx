"use client";

import Link from "next/link";
import React from "react";

const ecoLinks = [
    { title: "Descubre cómo reducir tu huella de carbono hoy mismo", url: "#" },
    { title: "Nuevas políticas ambientales en la Unión Europea: lo que debes saber", url: "#" },
    { title: "5 proyectos de reforestación que están cambiando el mundo", url: "#" },
    { title: "Energías renovables: el futuro es ahora", url: "#" },
    { title: "Guía práctica para un estilo de vida cero residuos", url: "#" },
    { title: "El impacto del fast fashion y cómo elegir moda sostenible", url: "#" },
];

export default function EcoTickerBanner() {
    return (
        <div className="fixed bottom-0 left-0 w-full bg-[#10b981] text-white z-50 overflow-hidden py-2.5 shadow-[0_-4px_6px_rgba(0,0,0,0.1)] border-t border-[#059669]">
            <div className="flex w-max animate-[ticker_50s_linear_infinite] hover:[animation-play-state:paused]">
                {/* Renderizamos la lista cuatro veces para asegurar un flujo continuo (marquee effect) */}
                {[...ecoLinks, ...ecoLinks, ...ecoLinks, ...ecoLinks].map((link, i) => (
                    <div key={i} className="flex items-center mx-6">
                        <span className="mr-3 text-lg">🌱</span>
                        <Link
                            href={link.url}
                            className="text-sm font-semibold tracking-wide hover:underline hover:text-[#d1fae5] transition-colors"
                        >
                            {link.title}
                        </Link>
                    </div>
                ))}
            </div>
            <style dangerouslySetInnerHTML={{
                __html: `
        @keyframes ticker {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
      `}} />
        </div>
    );
}
