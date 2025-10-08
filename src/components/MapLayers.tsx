"use client";
import { useState, useEffect } from "react";
import L from "leaflet";
import { useMap } from "react-leaflet";
import { useI18n } from "@/lib/i18n";

type MapLayersProps = {
  onLayerChange?: (layerType: string) => void;
};

export default function MapLayers({ onLayerChange }: MapLayersProps) {
  const { t, locale } = useI18n();
  const map = useMap();
  const [activeLayer, setActiveLayer] = useState("light");

  // Providers with built-in fallbacks ordered by reliability
  const layers = {
    light: {
      name: locale === 'es' ? "Claro" : locale === 'de' ? "Hell" : "Light",
      urls: [
        // OpenStreetMap standard (most reliable)
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        // CARTO light
        "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      ],
      attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
    },
    dark: {
      name: locale === 'es' ? "Oscuro" : locale === 'de' ? "Dunkel" : "Dark", 
      urls: [
        // CARTO dark
        "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
        // Fallback to OSM standard if dark fails
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      attribution: '&copy; OpenStreetMap contributors, &copy; CARTO'
    },
    satellite: {
      name: t("satellite"),
      urls: [
        // Esri imagery
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        // Fallback to OSM if blocked
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      attribution: '&copy; Esri, &copy; OpenStreetMap contributors'
    },
    terrain: {
      name: t("terrain"),
      urls: [
        // OpenTopoMap
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        // Fallback to OSM
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      ],
      attribution: '&copy; OpenTopoMap, &copy; OpenStreetMap contributors'
    }
  } as const;

  useEffect(() => {
    // Remove existing tile layers
    map.eachLayer((layer) => {
      if ((layer as any).getAttribution && layer instanceof (L as any).TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer with fallback on error
    const layerConfig = layers[activeLayer as keyof typeof layers];
    let urlIndex = 0;
    const addWithFallback = () => {
      const url = layerConfig.urls[urlIndex];
      const tile = L.tileLayer(url, { attribution: layerConfig.attribution });
      tile.on('tileerror', () => {
        // try next provider
        if (urlIndex < layerConfig.urls.length - 1) {
          map.removeLayer(tile);
          urlIndex += 1;
          addWithFallback();
        }
      });
      tile.addTo(map);
    };
    addWithFallback();

    onLayerChange?.(activeLayer);
  }, [activeLayer, map, onLayerChange]);

  return (
    <div className="absolute bottom-2 left-2 z-[1000] bg-white/95 backdrop-blur rounded-lg shadow-lg border p-1">
      <div className="flex gap-1">
        {Object.entries(layers).map(([key, layer]) => (
          <button
            key={key}
            onClick={() => setActiveLayer(key)}
            className={`px-2 py-1 text-xs rounded-md transition-colors ${
              activeLayer === key
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
            title={layer.name}
          >
            {layer.name}
          </button>
        ))}
      </div>
    </div>
  );
}
