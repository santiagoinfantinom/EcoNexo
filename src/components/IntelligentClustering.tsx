"use client";
import React, { useState, useEffect, useMemo } from 'react';
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from 'react-leaflet';
import L from 'leaflet';
import { ensureEventImage } from "@/lib/eventImages";

interface Event {
  id: string;
  title: string;
  title_en?: string;
  title_de?: string;
  description?: string;
  description_en?: string;
  description_de?: string;
  image_url?: string;
  website?: string;
  lat: number;
  lng: number;
  category: string;
  date: string;
  maxVolunteers: number;
  currentVolunteers: number;
  impact: 'low' | 'medium' | 'high';
}

interface Cluster {
  id: string;
  lat: number;
  lng: number;
  events: Event[];
  radius: number;
  color: string;
}

interface IntelligentClusteringProps {
  events: Event[];
  onClusterClick?: (cluster: Cluster) => void;
  onEventClick?: (event: Event) => void;
}

export default function IntelligentClustering({ 
  events, 
  onClusterClick, 
  onEventClick 
}: IntelligentClusteringProps) {
  const [clusters, setClusters] = useState<Cluster[]>([]);
  const [zoomLevel, setZoomLevel] = useState(10);
  const [clusteringEnabled, setClusteringEnabled] = useState(true);

  // DBSCAN clustering algorithm
  const performDBSCAN = (events: Event[], eps: number, minPts: number): Cluster[] => {
    const visited = new Set<string>();
    const clusters: Cluster[] = [];
    let clusterId = 0;

    const getDistance = (e1: Event, e2: Event): number => {
      const R = 6371; // Earth's radius in km
      const dLat = (e2.lat - e1.lat) * Math.PI / 180;
      const dLon = (e2.lng - e1.lng) * Math.PI / 180;
      const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
                Math.cos(e1.lat * Math.PI / 180) * Math.cos(e2.lat * Math.PI / 180) *
                Math.sin(dLon/2) * Math.sin(dLon/2);
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
      return R * c;
    };

    const getNeighbors = (event: Event, eps: number): Event[] => {
      return events.filter(e => 
        e.id !== event.id && 
        getDistance(event, e) <= eps
      );
    };

    events.forEach(event => {
      if (visited.has(event.id)) return;

      const neighbors = getNeighbors(event, eps);
      
      if (neighbors.length < minPts) {
        visited.add(event.id);
        return;
      }

      const cluster: Cluster = {
        id: `cluster-${clusterId++}`,
        lat: event.lat,
        lng: event.lng,
        events: [event],
        radius: 0,
        color: getClusterColor(event.category)
      };

      visited.add(event.id);

      // Expand cluster
      const queue = [...neighbors];
      while (queue.length > 0) {
        const neighbor = queue.shift()!;
        
        if (!visited.has(neighbor.id)) {
          visited.add(neighbor.id);
          cluster.events.push(neighbor);
          
          const neighborNeighbors = getNeighbors(neighbor, eps);
          if (neighborNeighbors.length >= minPts) {
            queue.push(...neighborNeighbors.filter(n => !visited.has(n.id)));
          }
        }
      }

      // Calculate cluster center and radius
      const totalLat = cluster.events.reduce((sum, e) => sum + e.lat, 0);
      const totalLng = cluster.events.reduce((sum, e) => sum + e.lng, 0);
      cluster.lat = totalLat / cluster.events.length;
      cluster.lng = totalLng / cluster.events.length;

      // Calculate radius based on furthest event
      let maxDistance = 0;
      cluster.events.forEach(e => {
        const distance = getDistance(
          { lat: cluster.lat, lng: cluster.lng } as Event,
          e
        );
        maxDistance = Math.max(maxDistance, distance);
      });
      cluster.radius = maxDistance * 1000; // Convert to meters

      clusters.push(cluster);
    });

    return clusters;
  };

  const getClusterColor = (category: string): string => {
    switch (category) {
      case 'environment': return '#10B981';
      case 'education': return '#3B82F6';
      case 'community': return '#8B5CF6';
      case 'technology': return '#F59E0B';
      case 'health': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getClusterSize = (eventCount: number): number => {
    if (eventCount <= 3) return 20;
    if (eventCount <= 10) return 30;
    if (eventCount <= 25) return 40;
    return 50;
  };

  const getClusterOpacity = (eventCount: number): number => {
    return Math.min(0.8, 0.3 + (eventCount / 50) * 0.5);
  };

  // Recalculate clusters when events or zoom level changes
  useEffect(() => {
    if (!clusteringEnabled || events.length === 0) {
      setClusters([]);
      return;
    }

    // Adjust clustering parameters based on zoom level
    let eps = 5; // km
    let minPts = 2;

    if (zoomLevel > 12) {
      eps = 2;
      minPts = 2;
    } else if (zoomLevel > 10) {
      eps = 3;
      minPts = 2;
    } else if (zoomLevel > 8) {
      eps = 5;
      minPts = 3;
    } else {
      eps = 10;
      minPts = 4;
    }

    const newClusters = performDBSCAN(events, eps, minPts);
    setClusters(newClusters);
  }, [events, zoomLevel, clusteringEnabled]);

  // Separate clustered and unclustered events
  const clusteredEventIds = useMemo(() => {
    return new Set(clusters.flatMap(cluster => cluster.events.map(e => e.id)));
  }, [clusters]);

  const unclusteredEvents = useMemo(() => {
    return events.filter(event => !clusteredEventIds.has(event.id));
  }, [events, clusteredEventIds]);

  const handleClusterClick = (cluster: Cluster) => {
    onClusterClick?.(cluster);
  };

  const handleEventClick = (event: Event) => {
    onEventClick?.(event);
  };

  return (
    <div className="w-full h-full relative">
      {/* Clustering Controls */}
      <div className="absolute top-4 right-4 z-[1000] bg-white dark:bg-slate-800 rounded-lg shadow-lg p-3">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Clustering:
          </label>
          <button
            onClick={() => setClusteringEnabled(!clusteringEnabled)}
            className={`px-3 py-1 rounded-full text-sm font-medium transition-all ${
              clusteringEnabled
                ? 'bg-green-600 text-white'
                : 'bg-gray-200 text-gray-700 dark:bg-slate-600 dark:text-slate-300'
            }`}
          >
            {clusteringEnabled ? 'ON' : 'OFF'}
          </button>
        </div>
        {clusteringEnabled && (
          <div className="mt-2 text-xs text-slate-600 dark:text-slate-400">
            {clusters.length} clusters, {unclusteredEvents.length} individuales
          </div>
        )}
      </div>

      <MapContainer
        center={[50.1109, 8.6821]}
        zoom={zoomLevel}
        style={{ height: '100%', width: '100%' }}
        whenReady={(map) => {
          map.target.on('zoomend', () => {
            setZoomLevel(map.target.getZoom());
          });
        }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Render clusters */}
        {clusteringEnabled && clusters.map((cluster) => (
          <div key={cluster.id}>
            {/* Cluster circle */}
            <CircleMarker
              center={[cluster.lat, cluster.lng]}
              radius={getClusterSize(cluster.events.length)}
              pathOptions={{
                color: cluster.color,
                fillColor: cluster.color,
                fillOpacity: getClusterOpacity(cluster.events.length),
                weight: 2
              }}
              eventHandlers={{
                click: () => handleClusterClick(cluster)
              }}
            />
            
            {/* Cluster marker */}
            <Marker
              position={[cluster.lat, cluster.lng]}
              icon={L.divIcon({
                className: 'cluster-marker',
                html: `
                  <div style="
                    background: ${cluster.color};
                    color: white;
                    border-radius: 50%;
                    width: ${getClusterSize(cluster.events.length)}px;
                    height: ${getClusterSize(cluster.events.length)}px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-weight: bold;
                    font-size: 12px;
                    border: 2px solid white;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                  ">
                    ${cluster.events.length}
                  </div>
                `,
                iconSize: [getClusterSize(cluster.events.length), getClusterSize(cluster.events.length)],
                iconAnchor: [getClusterSize(cluster.events.length) / 2, getClusterSize(cluster.events.length) / 2]
              })}
              eventHandlers={{
                click: () => handleClusterClick(cluster)
              }}
            >
              <Popup>
                <div className="p-2">
                  <h3 className="font-semibold text-slate-900 mb-2">
                    {cluster.events.length} eventos cercanos
                  </h3>
                  <div className="space-y-1">
                    {cluster.events.slice(0, 5).map((event) => (
                      <div key={event.id} className="text-sm text-slate-600">
                        • {event.title}
                      </div>
                    ))}
                    {cluster.events.length > 5 && (
                      <div className="text-sm text-slate-500">
                        ... y {cluster.events.length - 5} más
                      </div>
                    )}
                  </div>
                  <button
                    onClick={() => handleClusterClick(cluster)}
                    className="mt-2 px-3 py-1 bg-green-600 text-white rounded text-sm hover:bg-green-700"
                  >
                    Ver todo
                  </button>
                </div>
              </Popup>
            </Marker>
          </div>
        ))}

        {/* Render unclustered events */}
        {(!clusteringEnabled || unclusteredEvents.length > 0) && unclusteredEvents.map((event) => (
          <Marker
            key={event.id}
            position={[event.lat, event.lng]}
            icon={L.divIcon({
              className: 'event-marker',
              html: `
                <div style="
                  background: ${getClusterColor(event.category)};
                  color: white;
                  border-radius: 50%;
                  width: 20px;
                  height: 20px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  font-weight: bold;
                  font-size: 10px;
                  border: 2px solid white;
                  box-shadow: 0 2px 4px rgba(0,0,0,0.3);
                ">
                  ${event.category.charAt(0).toUpperCase()}
                </div>
              `,
              iconSize: [20, 20],
              iconAnchor: [10, 10]
            })}
            eventHandlers={{
              click: () => handleEventClick(event)
            }}
          >
            <Popup>
              <div className="p-2">
                <h3 className="font-semibold text-slate-900 mb-1">
                  {event.title}
                </h3>
                {(() => {
                  const headerImageSrc = ensureEventImage({
                    image_url: event.image_url,
                    category: event.category,
                    website: event.website
                  });
                  return (
                    <div className="w-full h-28 overflow-hidden rounded mb-2 border border-gray-200">
                      <img
                        src={headerImageSrc}
                        alt={event.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                        referrerPolicy="no-referrer"
                        decoding="async"
                        crossOrigin="anonymous"
                      />
                    </div>
                  );
                })()}
                <div className="text-sm text-slate-600 space-y-1">
                  <div>📅 {new Date(event.date).toLocaleDateString()}</div>
                  <div>👥 {event.currentVolunteers}/{event.maxVolunteers} voluntarixs</div>
                  <div>🎯 Impacto: {event.impact}</div>
                </div>
                <button
                  onClick={() => handleEventClick(event)}
                  className="mt-2 px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
                >
                  Ver detalles
                </button>
              </div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
