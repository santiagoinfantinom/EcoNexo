"use client";
import { useState, useEffect } from "react";
import { useMap } from "react-leaflet";
import { useI18n } from "@/lib/i18n";

type MapLayersProps = {
  onLayerChange?: (layerType: string) => void;
};

export default function MapLayers({ onLayerChange }: MapLayersProps) {
  const { t } = useI18n();
  const map = useMap();
  const [activeLayer, setActiveLayer] = useState("light");

  const layers = {
    light: {
      name: "Light",
      url: "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap & CARTO'
    },
    dark: {
      name: "Dark", 
      url: "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png",
      attribution: '&copy; OpenStreetMap & CARTO'
    },
    satellite: {
      name: t("satellite"),
      url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      attribution: '&copy; Esri'
    },
    terrain: {
      name: t("terrain"),
      url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
      attribution: '&copy; OpenTopoMap'
    }
  };

  useEffect(() => {
    // Remove existing tile layers
    map.eachLayer((layer) => {
      if (layer instanceof L.TileLayer) {
        map.removeLayer(layer);
      }
    });

    // Add new tile layer
    const layerConfig = layers[activeLayer as keyof typeof layers];
    L.tileLayer(layerConfig.url, {
      attribution: layerConfig.attribution
    }).addTo(map);

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
