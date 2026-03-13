"use client";
import { useEffect } from "react";

export default function IOSMetaTags() {
  useEffect(() => {
    // Agregar meta tags dinámicamente para iOS
    const metaTags = [
      { name: "apple-mobile-web-app-capable", content: "yes" },
      { name: "apple-mobile-web-app-status-bar-style", content: "black-translucent" },
      { name: "apple-mobile-web-app-title", content: "EcoNexo" },
      { name: "format-detection", content: "telephone=no" },
      { name: "mobile-web-app-capable", content: "yes" },
    ];

    metaTags.forEach(({ name, content }) => {
      let meta = document.querySelector(`meta[name="${name}"]`);
      if (!meta) {
        meta = document.createElement("meta");
        meta.setAttribute("name", name);
        document.head.appendChild(meta);
      }
      meta.setAttribute("content", content);
    });

    // Agregar apple-touch-icon si no existe
    let appleIcon = document.querySelector('link[rel="apple-touch-icon"]');
    if (!appleIcon) {
      appleIcon = document.createElement("link");
      appleIcon.setAttribute("rel", "apple-touch-icon");
      appleIcon.setAttribute("href", "/logo-econexo.png");
      document.head.appendChild(appleIcon);
    }
  }, []);

  return null;
}

