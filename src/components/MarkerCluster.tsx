"use client";
import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

type Project = {
  id: string;
  name: string;
  name_en?: string;
  name_de?: string;
  category: string;
  lat: number;
  lng: number;
  city: string;
  country: string;
  spots?: number;
};

type MarkerClusterProps = {
  projects: Project[];
};

export default function MarkerCluster({ projects }: MarkerClusterProps) {
  const map = useMap();

  useEffect(() => {
    // Create marker cluster group
    const markerClusterGroup = L.markerClusterGroup({
      chunkedLoading: true,
      maxClusterRadius: 50,
      spiderfyOnMaxZoom: true,
      showCoverageOnHover: false,
      zoomToBoundsOnClick: true,
      iconCreateFunction: function(cluster) {
        const childCount = cluster.getChildCount();
        let className = 'marker-cluster marker-cluster-';
        
        if (childCount < 10) {
          className += 'small';
        } else if (childCount < 100) {
          className += 'medium';
        } else {
          className += 'large';
        }

        return L.divIcon({
          html: `<div><span>${childCount}</span></div>`,
          className: className,
          iconSize: L.point(40, 40)
        });
      }
    });

    // Add markers to cluster group
    projects.forEach(project => {
      const marker = L.marker([project.lat, project.lng]);
      
      // Create popup content
      const popupContent = `
        <div class="grid gap-1">
          <div class="font-medium">${project.name}</div>
          <div class="text-xs text-gray-600">${project.city}, ${project.country}</div>
          <div class="text-xs">Categoría: ${project.category}</div>
          ${project.spots !== undefined ? `<div class="text-xs">Cupos disponibles: ${project.spots}</div>` : ''}
          <a href="/projects/${project.id}" class="text-green-700 underline text-sm mt-1">
            Ver detalles
          </a>
        </div>
      `;
      
      marker.bindPopup(popupContent);
      markerClusterGroup.addLayer(marker);
    });

    // Add cluster group to map
    map.addLayer(markerClusterGroup);

    // Cleanup function
    return () => {
      map.removeLayer(markerClusterGroup);
    };
  }, [map, projects]);

  return null;
}
