"use client";
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

interface RouteOption {
  id: string;
  type: 'walking' | 'cycling' | 'public_transport' | 'driving';
  name: string;
  duration: number; // minutes
  distance: number; // km
  co2Emission: number; // kg CO2
  cost: number; // euros
  polyline: [number, number][];
  instructions: string[];
}

interface SustainableRoutesProps {
  startLocation: [number, number];
  endLocation: [number, number];
  onRouteSelect?: (route: RouteOption) => void;
}

export default function SustainableRoutes({ 
  startLocation, 
  endLocation, 
  onRouteSelect 
}: SustainableRoutesProps) {
  const [routes, setRoutes] = useState<RouteOption[]>([]);
  const [selectedRoute, setSelectedRoute] = useState<RouteOption | null>(null);
  const [loading, setLoading] = useState(false);

  // CO2 emission factors (kg CO2 per km)
  const emissionFactors = {
    walking: 0,
    cycling: 0,
    public_transport: 0.041,
    driving: 0.192
  };

  // Cost factors (euros per km)
  const costFactors = {
    walking: 0,
    cycling: 0,
    public_transport: 0.15,
    driving: 0.35
  };

  useEffect(() => {
    if (startLocation && endLocation) {
      calculateRoutes();
    }
  }, [startLocation, endLocation]);

  const calculateRoutes = async () => {
    setLoading(true);
    try {
      // Calculate distance using Haversine formula
      const distance = calculateDistance(startLocation, endLocation);
      
      // Generate route options
      const routeOptions: RouteOption[] = [
        {
          id: 'walking',
          type: 'walking',
          name: 'Caminar',
          duration: Math.round(distance * 12), // 5 km/h average
          distance: distance,
          co2Emission: 0,
          cost: 0,
          polyline: [startLocation, endLocation],
          instructions: [`Caminar ${distance.toFixed(1)} km hacia el destino`]
        },
        {
          id: 'cycling',
          type: 'cycling',
          name: 'En bicicleta',
          duration: Math.round(distance * 4), // 15 km/h average
          distance: distance,
          co2Emission: 0,
          cost: 0,
          polyline: generateCyclingRoute(startLocation, endLocation),
          instructions: [`Ciclar ${distance.toFixed(1)} km hacia el destino`]
        },
        {
          id: 'public_transport',
          type: 'public_transport',
          name: 'Transporte público',
          duration: Math.round(distance * 3 + 10), // includes waiting time
          distance: distance,
          co2Emission: distance * emissionFactors.public_transport,
          cost: distance * costFactors.public_transport,
          polyline: generatePublicTransportRoute(startLocation, endLocation),
          instructions: [
            'Caminar 200m a la parada de autobús',
            'Tomar línea 42 hacia el centro',
            'Transbordar a línea 15',
            'Caminar 300m al destino'
          ]
        },
        {
          id: 'driving',
          type: 'driving',
          name: 'En coche',
          duration: Math.round(distance * 2), // 30 km/h average in city
          distance: distance,
          co2Emission: distance * emissionFactors.driving,
          cost: distance * costFactors.driving,
          polyline: generateDrivingRoute(startLocation, endLocation),
          instructions: [`Conducir ${distance.toFixed(1)} km hacia el destino`]
        }
      ];

      setRoutes(routeOptions);
    } catch (error) {
      console.error('Error calculating routes:', error);
    } finally {
      setLoading(false);
    }
  };

  const calculateDistance = (start: [number, number], end: [number, number]): number => {
    const R = 6371; // Earth's radius in km
    const dLat = (end[0] - start[0]) * Math.PI / 180;
    const dLon = (end[1] - start[1]) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(start[0] * Math.PI / 180) * Math.cos(end[0] * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  const generateCyclingRoute = (start: [number, number], end: [number, number]): [number, number][] => {
    // Simple route generation - in real app, use routing API
    const midPoint: [number, number] = [
      (start[0] + end[0]) / 2,
      (start[1] + end[1]) / 2
    ];
    return [start, midPoint, end];
  };

  const generatePublicTransportRoute = (start: [number, number], end: [number, number]): [number, number][] => {
    // Simulate public transport route with stops
    const stop1: [number, number] = [start[0] + 0.001, start[1] + 0.001];
    const stop2: [number, number] = [end[0] - 0.001, end[1] - 0.001];
    return [start, stop1, stop2, end];
  };

  const generateDrivingRoute = (start: [number, number], end: [number, number]): [number, number][] => {
    // Simulate driving route with waypoints
    const waypoint1: [number, number] = [start[0] + 0.002, start[1]];
    const waypoint2: [number, number] = [end[0], end[1] - 0.002];
    return [start, waypoint1, waypoint2, end];
  };

  const getRouteColor = (type: string) => {
    switch (type) {
      case 'walking': return '#10B981';
      case 'cycling': return '#3B82F6';
      case 'public_transport': return '#8B5CF6';
      case 'driving': return '#EF4444';
      default: return '#6B7280';
    }
  };

  const getRouteIcon = (type: string) => {
    switch (type) {
      case 'walking': return '🚶';
      case 'cycling': return '🚴';
      case 'public_transport': return '🚌';
      case 'driving': return '🚗';
      default: return '📍';
    }
  };

  const handleRouteSelect = (route: RouteOption) => {
    setSelectedRoute(route);
    onRouteSelect?.(route);
  };

  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg p-6">
      <h3 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mb-4">
        Rutas Sostenibles
      </h3>
      
      {loading ? (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
        </div>
      ) : (
        <div className="space-y-3">
          {routes.map((route) => (
            <div
              key={route.id}
              className={`p-4 rounded-lg border-2 cursor-pointer transition-all ${
                selectedRoute?.id === route.id
                  ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
                  : 'border-gray-200 dark:border-slate-600 hover:border-green-300'
              }`}
              onClick={() => handleRouteSelect(route)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{getRouteIcon(route.type)}</span>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-slate-100">
                      {route.name}
                    </h4>
                    <div className="flex items-center gap-4 text-sm text-slate-600 dark:text-slate-400">
                      <span>⏱️ {route.duration} min</span>
                      <span>📏 {route.distance.toFixed(1)} km</span>
                      <span>🌱 {route.co2Emission.toFixed(3)} kg CO₂</span>
                      <span>💰 €{route.cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {route.co2Emission === 0 && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                      Cero emisiones
                    </span>
                  )}
                  {route.type === 'walking' || route.type === 'cycling' ? (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                      Más sostenible
                    </span>
                  ) : null}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Route Instructions */}
      {selectedRoute && (
        <div className="mt-6 p-4 bg-slate-50 dark:bg-slate-700 rounded-lg">
          <h4 className="font-medium text-slate-900 dark:text-slate-100 mb-2">
            Instrucciones de ruta
          </h4>
          <ol className="space-y-1">
            {selectedRoute.instructions.map((instruction, index) => (
              <li key={index} className="text-sm text-slate-600 dark:text-slate-400">
                {index + 1}. {instruction}
              </li>
            ))}
          </ol>
        </div>
      )}
    </div>
  );
}
