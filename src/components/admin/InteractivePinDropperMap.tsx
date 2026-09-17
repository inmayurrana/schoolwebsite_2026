"use client";

import React, { useEffect, useRef, useState } from "react";
import {
  MapPin,
  Crosshair,
  Navigation,
  Layers,
  Search,
  CheckCircle2,
  Sparkles,
  Save,
  Loader2,
  ExternalLink,
  Compass,
  Maximize2,
  ZoomIn,
  ZoomOut,
} from "lucide-react";

interface InteractivePinDropperMapProps {
  initialLat: number;
  initialLng: number;
  initialZoom?: number;
  initialLayer?: string;
  onLocationChange: (lat: string, lng: string, zoom: string) => void;
  onSave?: (lat: string, lng: string, zoom: string) => Promise<void>;
  schoolAddress?: string;
}

export default function InteractivePinDropperMap({
  initialLat = 31.7078,
  initialLng = 76.9311,
  initialZoom = 15,
  initialLayer = "m",
  onLocationChange,
  onSave,
  schoolAddress,
}: InteractivePinDropperMapProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const tileLayerRef = useRef<any>(null);

  const [currentLat, setCurrentLat] = useState<number>(initialLat || 31.7078);
  const [currentLng, setCurrentLng] = useState<number>(initialLng || 76.9311);
  const [currentZoom, setCurrentZoom] = useState<number>(initialZoom || 15);
  const [activeLayer, setActiveLayer] = useState<"STREET" | "SATELLITE" | "TOPO">("STREET");
  const [searchQuery, setSearchQuery] = useState("");
  const [searching, setSearching] = useState(false);
  const [searchError, setSearchError] = useState("");
  const [detecting, setDetecting] = useState(false);
  const [savingLocation, setSavingLocation] = useState(false);
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [isLeafletReady, setIsLeafletReady] = useState(false);

  // Sync state if props change initially
  useEffect(() => {
    if (initialLat && !isNaN(initialLat) && initialLng && !isNaN(initialLng)) {
      setCurrentLat(initialLat);
      setCurrentLng(initialLng);
    }
  }, [initialLat, initialLng]);

  // Load Leaflet CSS and Initialize Map
  useEffect(() => {
    let isMounted = true;

    async function initMap() {
      if (typeof window === "undefined" || !mapContainerRef.current) return;

      // Inject Leaflet CSS if not already present
      if (!document.getElementById("leaflet-css")) {
        const link = document.createElement("link");
        link.id = "leaflet-css";
        link.rel = "stylesheet";
        link.href = "https://unpkg.com/leaflet@1.9.4/dist/leaflet.css";
        document.head.appendChild(link);
      }

      const L = (await import("leaflet")).default;
      if (!isMounted || !mapContainerRef.current) return;

      // Fix default marker icons in Next.js bundler
      const customIcon = L.divIcon({
        className: "custom-map-pin-container",
        html: `
          <div style="position: relative; display: flex; flex-direction: column; align-items: center; transform: translate(-50%, -100%); cursor: grab;">
            <div style="background: linear-gradient(135deg, #f59e0b, #d97706); color: #020617; padding: 6px 12px; border-radius: 9999px; font-weight: 800; font-size: 11px; white-space: nowrap; box-shadow: 0 10px 25px -5px rgba(0,0,0,0.5); border: 2px solid white; display: flex; align-items: center; gap: 4px;">
              <span>🏫 CIS Mandi Pin</span>
            </div>
            <div style="width: 32px; height: 32px; background: #f59e0b; border: 3px solid #ffffff; border-radius: 50% 50% 50% 0; transform: rotate(-45deg); display: flex; align-items: center; justify-content: center; box-shadow: 0 4px 15px rgba(0,0,0,0.4); margin-top: 4px;">
              <div style="width: 10px; height: 10px; background: #0f172a; border-radius: 50%; transform: rotate(45deg);"></div>
            </div>
            <div style="width: 12px; height: 6px; background: rgba(0,0,0,0.4); border-radius: 50%; filter: blur(1px); margin-top: -2px;"></div>
          </div>
        `,
        iconSize: [40, 60],
        iconAnchor: [20, 60],
      });

      // Cleanup existing map if any
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }

      const map = L.map(mapContainerRef.current, {
        center: [currentLat, currentLng],
        zoom: currentZoom,
        zoomControl: false,
      });

      // Add Zoom control at top-right
      L.control.zoom({ position: "topright" }).addTo(map);

      // Tile layers definition
      const streetLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          maxZoom: 19,
        }
      );

      const satelliteLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
          maxZoom: 19,
        }
      );

      const topoLayer = L.tileLayer(
        "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
        {
          attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a>',
          maxZoom: 17,
        }
      );

      // Select active layer
      let activeTile = streetLayer;
      if (activeLayer === "SATELLITE") activeTile = satelliteLayer;
      if (activeLayer === "TOPO") activeTile = topoLayer;
      activeTile.addTo(map);
      tileLayerRef.current = { streetLayer, satelliteLayer, topoLayer, current: activeTile };

      // Add draggable Marker at the pin position
      const marker = L.marker([currentLat, currentLng], {
        draggable: true,
        icon: customIcon,
      }).addTo(map);

      // Drag event on marker
      marker.on("dragend", () => {
        const pos = marker.getLatLng();
        const latFixed = parseFloat(pos.lat.toFixed(6));
        const lngFixed = parseFloat(pos.lng.toFixed(6));
        setCurrentLat(latFixed);
        setCurrentLng(lngFixed);
        onLocationChange(latFixed.toString(), lngFixed.toString(), map.getZoom().toString());
      });

      // Click anywhere on map to drop / move pin
      map.on("click", (e: any) => {
        const { lat, lng } = e.latlng;
        const latFixed = parseFloat(lat.toFixed(6));
        const lngFixed = parseFloat(lng.toFixed(6));
        marker.setLatLng([latFixed, lngFixed]);
        setCurrentLat(latFixed);
        setCurrentLng(lngFixed);
        onLocationChange(latFixed.toString(), lngFixed.toString(), map.getZoom().toString());
      });

      // Zoom change listener
      map.on("zoomend", () => {
        const z = map.getZoom();
        setCurrentZoom(z);
        onLocationChange(currentLat.toString(), currentLng.toString(), z.toString());
      });

      mapInstanceRef.current = map;
      markerRef.current = marker;
      setIsLeafletReady(true);
    }

    initMap();

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when layer switch button is clicked
  const switchLayer = (type: "STREET" | "SATELLITE" | "TOPO") => {
    setActiveLayer(type);
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const { streetLayer, satelliteLayer, topoLayer, current } = tileLayerRef.current;
    if (current) mapInstanceRef.current.removeLayer(current);

    let newTile = streetLayer;
    if (type === "SATELLITE") newTile = satelliteLayer;
    if (type === "TOPO") newTile = topoLayer;

    newTile.addTo(mapInstanceRef.current);
    tileLayerRef.current.current = newTile;
  };

  // Move marker and map center to new coordinates
  const flyToCoordinates = (lat: number, lng: number, zoomLevel: number = 16) => {
    setCurrentLat(lat);
    setCurrentLng(lng);
    setCurrentZoom(zoomLevel);
    onLocationChange(lat.toString(), lng.toString(), zoomLevel.toString());

    if (mapInstanceRef.current && markerRef.current) {
      markerRef.current.setLatLng([lat, lng]);
      mapInstanceRef.current.flyTo([lat, lng], zoomLevel, { duration: 1.2 });
    }
  };

  // Search Address / Landmark via OpenStreetMap Geocoding
  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchQuery.trim()) return;

    setSearching(true);
    setSearchError("");

    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          searchQuery + " Mandi Himachal Pradesh India"
        )}&limit=1`
      );
      const data = await res.json();

      if (data && data.length > 0) {
        const lat = parseFloat(parseFloat(data[0].lat).toFixed(6));
        const lng = parseFloat(parseFloat(data[0].lon).toFixed(6));
        flyToCoordinates(lat, lng, 16);
      } else {
        // Fallback search without Mandi suffix if not found
        const fallbackRes = await fetch(
          `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
            searchQuery
          )}&limit=1`
        );
        const fallbackData = await fallbackRes.json();
        if (fallbackData && fallbackData.length > 0) {
          const lat = parseFloat(parseFloat(fallbackData[0].lat).toFixed(6));
          const lng = parseFloat(parseFloat(fallbackData[0].lon).toFixed(6));
          flyToCoordinates(lat, lng, 16);
        } else {
          setSearchError("Location not found. Try entering landmark name or clicking directly on the map.");
        }
      }
    } catch (err: any) {
      setSearchError("Search service unavailable. You can click directly on the map to drop the pin.");
    } finally {
      setSearching(false);
    }
  };

  // Detect Device GPS
  const handleDetectDeviceGPS = () => {
    if (typeof window === "undefined" || !navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setDetecting(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const lat = parseFloat(pos.coords.latitude.toFixed(6));
        const lng = parseFloat(pos.coords.longitude.toFixed(6));
        flyToCoordinates(lat, lng, 17);
        setDetecting(false);
      },
      (err) => {
        setDetecting(false);
        alert("GPS detection failed: " + err.message);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  // Direct 1-Click Save Location Button
  const handleDirectSave = async () => {
    if (!onSave) return;
    setSavingLocation(true);
    setSavedSuccess(false);
    try {
      await onSave(currentLat.toString(), currentLng.toString(), currentZoom.toString());
      setSavedSuccess(true);
      setTimeout(() => setSavedSuccess(false), 5000);
    } catch (e) {
      console.error("Failed to direct save location:", e);
    } finally {
      setSavingLocation(false);
    }
  };

  // Format DMS Coordinate string
  const formatDMS = (lat: number, lng: number) => {
    const latDeg = Math.floor(Math.abs(lat));
    const latMin = Math.floor((Math.abs(lat) - latDeg) * 60);
    const latSec = Math.floor(((Math.abs(lat) - latDeg) * 60 - latMin) * 60);
    const latDir = lat >= 0 ? "N" : "S";

    const lngDeg = Math.floor(Math.abs(lng));
    const lngMin = Math.floor((Math.abs(lng) - lngDeg) * 60);
    const lngSec = Math.floor(((Math.abs(lng) - lngDeg) * 60 - lngMin) * 60);
    const lngDir = lng >= 0 ? "E" : "W";

    return `${latDir} ${latDeg}° ${latMin}' ${latSec}'' | ${lngDir} ${lngDeg}° ${lngMin}' ${lngSec}''`;
  };

  return (
    <div className="space-y-4">
      {/* Search & Tool Bar Above Map */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 bg-[#051329] p-3 rounded-2xl border border-slate-800">
        {/* Address Geosearch Input */}
        <form onSubmit={handleSearch} className="flex-1 flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search landmark (e.g. Gutkar, Victoria Bridge, Ner Chowk)..."
              className="w-full bg-[#0d1f33] text-white pl-9 pr-4 py-2 rounded-xl text-xs border border-slate-700 focus:outline-none focus:border-amber-400"
            />
          </div>
          <button
            type="submit"
            disabled={searching}
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-3.5 py-2 rounded-xl text-xs transition-colors flex items-center space-x-1.5 flex-shrink-0 cursor-pointer"
          >
            {searching ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <span>Find</span>
            )}
          </button>
        </form>

        {/* GPS Detect + Layer Toggles */}
        <div className="flex items-center gap-2 flex-wrap">
          <button
            type="button"
            onClick={handleDetectDeviceGPS}
            disabled={detecting}
            className="bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 px-3 py-2 rounded-xl text-xs font-semibold flex items-center space-x-1.5 transition-colors cursor-pointer"
            title="Detect GPS from current device"
          >
            {detecting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-amber-400" />
            ) : (
              <Navigation className="w-3.5 h-3.5 text-amber-400" />
            )}
            <span>My GPS</span>
          </button>

          {/* Map Layer Switcher */}
          <div className="bg-slate-900 p-1 rounded-xl border border-slate-700 flex items-center space-x-1">
            <button
              type="button"
              onClick={() => switchLayer("STREET")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeLayer === "STREET"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Street
            </button>
            <button
              type="button"
              onClick={() => switchLayer("SATELLITE")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeLayer === "SATELLITE"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Satellite
            </button>
            <button
              type="button"
              onClick={() => switchLayer("TOPO")}
              className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all ${
                activeLayer === "TOPO"
                  ? "bg-amber-400 text-slate-950 shadow"
                  : "text-slate-400 hover:text-white"
              }`}
            >
              Terrain
            </button>
          </div>
        </div>
      </div>

      {searchError && (
        <div className="p-2.5 bg-rose-950/70 border border-rose-500/40 text-rose-300 text-xs rounded-xl flex items-center space-x-2">
          <span>⚠️ {searchError}</span>
        </div>
      )}

      {/* Main Interactive Map Container */}
      <div className="relative w-full h-[460px] rounded-2xl overflow-hidden border-2 border-amber-400/40 shadow-2xl bg-slate-950">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Floating Top Banner: Live Dropped Pin Coordinates */}
        <div className="absolute top-3 left-3 z-[1000] bg-slate-950/95 backdrop-blur-md border border-amber-400/40 text-white px-3.5 py-2 rounded-xl shadow-xl flex items-center space-x-2.5 pointer-events-auto">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <div className="text-xs font-mono">
            <p className="font-bold text-amber-300 flex items-center space-x-1">
              <span>📍 Lat: {currentLat.toFixed(6)} | Lng: {currentLng.toFixed(6)}</span>
            </p>
            <p className="text-[10px] text-slate-400 mt-0.5">
              {formatDMS(currentLat, currentLng)} (Zoom: {currentZoom}x)
            </p>
          </div>
        </div>

        {/* Floating Pin Drop Instructions */}
        <div className="absolute top-3 right-14 z-[1000] hidden sm:flex items-center space-x-1.5 bg-slate-950/90 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-700 text-slate-300 text-[11px] pointer-events-none">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" />
          <span>Click anywhere or drag marker to drop pin</span>
        </div>

        {/* Floating Bottom Action Bar */}
        <div className="absolute bottom-3 inset-x-3 z-[1000] flex flex-col sm:flex-row items-center justify-between gap-2.5 pointer-events-none">
          {/* Quick Presets Pills */}
          <div className="flex flex-wrap items-center gap-1.5 pointer-events-auto bg-slate-950/95 backdrop-blur-md p-1.5 rounded-xl border border-slate-700">
            <span className="text-[10px] font-bold text-slate-400 px-1 uppercase">Presets:</span>
            <button
              type="button"
              onClick={() => flyToCoordinates(31.7078, 76.9311, 16)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-amber-300 rounded-lg text-[10px] font-bold border border-slate-600 transition-colors"
            >
              Main Campus
            </button>
            <button
              type="button"
              onClick={() => flyToCoordinates(31.692, 76.921, 16)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-sky-300 rounded-lg text-[10px] font-bold border border-slate-600 transition-colors"
            >
              Gutkar Bypass
            </button>
            <button
              type="button"
              onClick={() => flyToCoordinates(31.7125, 76.932, 16)}
              className="px-2 py-0.5 bg-slate-800 hover:bg-slate-700 text-purple-300 rounded-lg text-[10px] font-bold border border-slate-600 transition-colors"
            >
              Victoria Bridge
            </button>
          </div>

          {/* Direct 1-Click Save Pin Location Button */}
          {onSave && (
            <div className="pointer-events-auto flex items-center space-x-2">
              {savedSuccess && (
                <div className="bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 px-3 py-1.5 rounded-xl text-xs font-bold flex items-center space-x-1.5 animate-in fade-in">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Pin Location Saved!</span>
                </div>
              )}

              <button
                type="button"
                onClick={handleDirectSave}
                disabled={savingLocation}
                className="bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-black px-4 py-2 rounded-xl text-xs shadow-2xl flex items-center space-x-1.5 hover:scale-105 active:scale-95 transition-all cursor-pointer"
              >
                {savingLocation ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin text-slate-950" />
                    <span>Saving Pin...</span>
                  </>
                ) : (
                  <>
                    <Save className="w-3.5 h-3.5 text-slate-950" />
                    <span>Save Marked Pin Location</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
