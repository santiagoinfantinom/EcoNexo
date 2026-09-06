"use client";
import { useCallback, useState } from "react";
import { Capacitor } from "@capacitor/core";
import { Geolocation as CapacitorGeolocation } from "@capacitor/geolocation";

export type LocationErrorKind = "permission" | "unavailable" | "timeout" | "insecure" | "unsupported";
export type LocationStatus = "idle" | "requesting" | "granted" | "denied";

export interface UserLocation {
  lat: number;
  lng: number;
}

function getCurrentPositionWithHardTimeout(options: PositionOptions, hardTimeoutMs = 10000) {
  return new Promise<GeolocationPosition>((resolve, reject) => {
    let didFinish = false;
    const hardTimeout = window.setTimeout(() => {
      if (didFinish) return;
      didFinish = true;
      reject(new Error("hard-timeout"));
    }, hardTimeoutMs);

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        if (didFinish) return;
        didFinish = true;
        window.clearTimeout(hardTimeout);
        resolve(pos);
      },
      (err) => {
        if (didFinish) return;
        didFinish = true;
        window.clearTimeout(hardTimeout);
        reject(err);
      },
      options
    );
  });
}

/**
 * Requests the user's current position, supporting both the Capacitor
 * native runtime (iOS/Android app) and the mobile/desktop web browser,
 * with permission and timeout handling for each.
 */
export function useUserLocation() {
  const [location, setLocation] = useState<UserLocation | null>(null);
  const [status, setStatus] = useState<LocationStatus>("idle");
  const [error, setError] = useState<LocationErrorKind | null>(null);

  const requestLocation = useCallback(async (): Promise<UserLocation | null> => {
    if (typeof window === "undefined") return null;
    setStatus("requesting");
    setError(null);

    if (Capacitor.isNativePlatform()) {
      try {
        const permission = await CapacitorGeolocation.requestPermissions();
        if (permission.location !== "granted" && permission.coarseLocation !== "granted") {
          setStatus("denied");
          setError("permission");
          return null;
        }
        const pos = await CapacitorGeolocation.getCurrentPosition({
          enableHighAccuracy: true,
          timeout: 15000,
        });
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setLocation(loc);
        setStatus("granted");
        return loc;
      } catch {
        setStatus("denied");
        setError("unavailable");
        return null;
      }
    }

    const isLocalhost = window.location.hostname === "localhost" || window.location.hostname === "127.0.0.1";
    if (!window.isSecureContext && !isLocalhost) {
      setStatus("denied");
      setError("insecure");
      return null;
    }

    if (!("geolocation" in navigator)) {
      setStatus("denied");
      setError("unsupported");
      return null;
    }

    try {
      const pos = await getCurrentPositionWithHardTimeout({
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000,
      });
      const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
      setLocation(loc);
      setStatus("granted");
      return loc;
    } catch (err: any) {
      setStatus("denied");
      if (err?.code === 1) setError("permission");
      else if (err?.message === "hard-timeout" || err?.code === 3) setError("timeout");
      else setError("unavailable");
      return null;
    }
  }, []);

  return { location, status, error, requestLocation };
}

/** Great-circle distance between two coordinates, in kilometers. */
export function haversineDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}
