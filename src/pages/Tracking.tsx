declare global { interface Window { google: any } }

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  ArrowLeft, MapPin, Phone, MessageSquare,
  Clock, ShieldCheck, Star, Navigation,
  User, Car, CheckCircle2, ChevronRight
} from 'lucide-react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion, AnimatePresence } from 'motion/react';

// ─── Types ────────────────────────────────────────────────────────────────────
interface LatLng { lat: number; lng: number }

// ─── Dark map style ───────────────────────────────────────────────────────────
const DARK_STYLE = [
  { elementType: 'geometry',           stylers: [{ color: '#1a1a2e' }] },
  { elementType: 'labels.text.fill',   stylers: [{ color: '#ffffff' }] },
  { featureType: 'road', elementType: 'geometry', stylers: [{ color: '#16213e' }] },
  { featureType: 'water', elementType: 'geometry', stylers: [{ color: '#0f3460' }] },
  { featureType: 'poi',                stylers: [{ visibility: 'off' }] },
];

// ─── Load Google Maps script once ────────────────────────────────────────────
function loadGoogleMaps(apiKey: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.google?.maps) { resolve(); return; }
    const existing = document.getElementById('gmap-script');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id   = 'gmap-script';
    script.src  = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places,geometry`;
    script.async = true;
    script.defer = true;
    script.onload  = () => resolve();
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Tracking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workers, jobs, currentUser, cancelJob, showToast } = useAppContext();

  const worker     = workers.find(w => w.id === id);
  const currentJob = jobs.find(j => j.workerId === id && j.status === 'on_the_way');

  // ── State ──────────────────────────────────────────────────────────────────
  const [eta, setEta]       = useState(12);
  const [distance, setDistance] = useState(1.4);
  const [status, setStatus] = useState<'approaching' | 'arrived' | 'job_started'>('approaching');
  const [address, setAddress] = useState('Sector F-7/2, Islamabad');
  const [mapsReady, setMapsReady] = useState(false);
  const [mapsFailed, setMapsFailed] = useState(false);

  // ── Refs ───────────────────────────────────────────────────────────────────
  const mapRef         = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const userMarkerRef  = useRef<any>(null);
  const workerMarkerRef = useRef<any>(null);
  const directionsRendererRef = useRef<any>(null);
  const userLatLngRef   = useRef<LatLng>({ lat: 33.6844, lng: 73.0479 }); // Islamabad fallback
  const workerLatLngRef = useRef<LatLng>({ lat: 33.6844 + 0.013, lng: 73.0479 + 0.008 });
  const intervalRef     = useRef<ReturnType<typeof setInterval> | null>(null);
  const notifiedApproachingRef = useRef(false);
  const arrivedRef      = useRef(false);

  // ── Load Maps SDK ──────────────────────────────────────────────────────────
  useEffect(() => {
    const key = (import.meta as any).env.VITE_GOOGLE_MAPS_API_KEY as string;
    loadGoogleMaps(key)
      .then(() => setMapsReady(true))
      .catch(err => {
        console.error('Google Maps load error', err);
        setMapsFailed(true);
        showToast('Map load nahi hua, simulation mode', 'error');
      });
  }, []);

  // Loading overlay condition updated to account for failure
  const loadingOverlay = (!mapsReady && !mapsFailed) && (
    <div className="absolute inset-0 flex items-center justify-center bg-slate-800 z-10">
      <div className="text-white text-sm font-bold opacity-60 animate-pulse">Loading Map…</div>
    </div>
  );

  // Fallback simulation UI when maps fail to load
  const simulationOverlay = mapsFailed && (
    <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-r from-indigo-900 via-purple-900 to-pink-900">
      <div className="text-white text-2xl font-bold animate-bounce">Simulation Map (offline)</div>
    </div>
  );

  // ── Get real user geolocation ──────────────────────────────────────────────
  useEffect(() => {
    if (!mapsReady) return;
    navigator.geolocation.getCurrentPosition(
      pos => {
        userLatLngRef.current = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        workerLatLngRef.current = {
          lat: userLatLngRef.current.lat + 0.013,
          lng: userLatLngRef.current.lng + 0.008,
        };
        initMap();
      },
      _err => {
        // fallback: Islamabad
        initMap();
      },
      { timeout: 8000 }
    );
  }, [mapsReady]);

  // ── Build user marker (blue circle) ───────────────────────────────────────
  const buildUserMarker = useCallback((map: any) => {
    const svgBlue = `<svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 36 36">
      <circle cx="18" cy="18" r="14" fill="#3b82f6" stroke="#fff" stroke-width="3"/>
      <circle cx="18" cy="18" r="22" fill="#3b82f6" fill-opacity="0.2"/>
    </svg>`;
    return new window.google.maps.Marker({
      position: userLatLngRef.current,
      map,
      title: 'You',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(svgBlue),
        scaledSize: new window.google.maps.Size(44, 44),
        anchor: new window.google.maps.Point(22, 22),
      },
      zIndex: 10,
    });
  }, []);

  // ── Build worker marker (avatar image) ────────────────────────────────────
  const buildWorkerMarker = useCallback((map: any) => {
    const avatarUrl = worker?.avatar || '';
    // Fallback SVG if no avatar
    const fallbackSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="48" height="56" viewBox="0 0 48 56">
      <rect x="0" y="0" width="48" height="48" rx="12" fill="#6c63ff" stroke="#fff" stroke-width="2"/>
      <text x="24" y="32" font-size="22" font-family="Arial" fill="#fff" text-anchor="middle">${worker?.name?.[0] ?? 'W'}</text>
      <polygon points="20,48 28,48 24,56" fill="#6c63ff"/>
    </svg>`;

    if (avatarUrl) {
      return new window.google.maps.Marker({
        position: workerLatLngRef.current,
        map,
        title: worker?.name ?? 'Worker',
        icon: {
          url: avatarUrl,
          scaledSize: new window.google.maps.Size(48, 48),
          anchor: new window.google.maps.Point(24, 48),
        },
        zIndex: 20,
      });
    }
    return new window.google.maps.Marker({
      position: workerLatLngRef.current,
      map,
      title: worker?.name ?? 'Worker',
      icon: {
        url: 'data:image/svg+xml;charset=UTF-8,' + encodeURIComponent(fallbackSvg),
        scaledSize: new window.google.maps.Size(48, 56),
        anchor: new window.google.maps.Point(24, 56),
      },
      zIndex: 20,
    });
  }, [worker]);

  // ── Draw / update route line ───────────────────────────────────────────────
  const updateRoute = useCallback((map: any) => {
    const directionsService = new window.google.maps.DirectionsService();
    if (!directionsRendererRef.current) {
      directionsRendererRef.current = new window.google.maps.DirectionsRenderer({
        suppressMarkers: true,
        polylineOptions: {
          strokeColor: '#6c63ff',
          strokeWeight: 5,
          strokeOpacity: 0.85,
        },
      });
      directionsRendererRef.current.setMap(map);
    }

    directionsService.route(
      {
        origin:      workerLatLngRef.current,
        destination: userLatLngRef.current,
        travelMode:  window.google.maps.TravelMode.DRIVING,
      },
      (result: any, routeStatus: any) => {
        if (routeStatus === window.google.maps.DirectionsStatus.OK) {
          directionsRendererRef.current.setDirections(result);
        }
      }
    );
  }, []);

  // ── Init Map ───────────────────────────────────────────────────────────────
  const initMap = useCallback(() => {
    if (!mapRef.current || !window.google?.maps) return;

    const map = new window.google.maps.Map(mapRef.current, {
      center: {
        lat: (userLatLngRef.current.lat + workerLatLngRef.current.lat) / 2,
        lng: (userLatLngRef.current.lng + workerLatLngRef.current.lng) / 2,
      },
      zoom: 14,
      styles: DARK_STYLE,
      disableDefaultUI: true,
      gestureHandling: 'greedy',
    });

    mapInstanceRef.current   = map;
    userMarkerRef.current    = buildUserMarker(map);
    workerMarkerRef.current  = buildWorkerMarker(map);

    updateRoute(map);
    startWorkerMovement(map);
  }, [buildUserMarker, buildWorkerMarker, updateRoute]);

  // ── Worker movement interval ───────────────────────────────────────────────
  const startWorkerMovement = useCallback((map: any) => {
    if (intervalRef.current) clearInterval(intervalRef.current);

    intervalRef.current = setInterval(() => {
      if (arrivedRef.current) { clearInterval(intervalRef.current!); return; }

      const uLat = userLatLngRef.current.lat;
      const uLng = userLatLngRef.current.lng;
      const wLat = workerLatLngRef.current.lat;
      const wLng = workerLatLngRef.current.lng;

      const newLat = wLat + (uLat - wLat) * 0.05;
      const newLng = wLng + (uLng - wLng) * 0.05;

      workerLatLngRef.current = { lat: newLat, lng: newLng };

      // Update marker position
      if (workerMarkerRef.current) {
        workerMarkerRef.current.setPosition({ lat: newLat, lng: newLng });
      }
      
      // Simple Haversine distance calculation fallback when Google Maps not available
      const computeDistance = (lat1: number, lng1: number, lat2: number, lng2: number) => {
        const R = 6371; // km
        const toRad = (deg: number) => (deg * Math.PI) / 180;
        const dLat = toRad(lat2 - lat1);
        const dLng = toRad(lng2 - lng1);
        const a =
          Math.sin(dLat / 2) * Math.sin(dLat / 2) +
          Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLng / 2) * Math.sin(dLng / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        return R * c; // km
      };

      const distKm = mapsReady ? (
        // Use Google Maps geometry when available
        (function () {
          const workerPoint = new window.google.maps.LatLng(newLat, newLng);
          const userPoint = new window.google.maps.LatLng(uLat, uLng);
          const distMeters = window.google.maps.geometry.spherical.computeDistanceBetween(workerPoint, userPoint);
          return distMeters / 1000;
        })()
      ) : computeDistance(uLat, uLng, newLat, newLng);
      
      const etaMin      = Math.ceil(distKm / 0.5);

      setDistance(parseFloat(distKm.toFixed(2)));
      setEta(etaMin);

      // Update route
      updateRoute(map);

      // Pan map to midpoint
      map.panTo({ lat: (newLat + uLat) / 2, lng: (newLng + uLng) / 2 });

      // Notifications
      if (distKm < 0.3 && !notifiedApproachingRef.current) {
        showToast('Helper sirf 300 meter dur hai!', 'success');
        notifiedApproachingRef.current = true;
      }

      if (distKm < 0.05 && !arrivedRef.current) {
        arrivedRef.current = true;
        setStatus('arrived');
        showToast('Helper pahunch gaya!', 'success');
        clearInterval(intervalRef.current!);
      }
    }, 3000);
  }, [updateRoute, showToast]);

  // ── Cleanup on unmount ─────────────────────────────────────────────────────
  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, []);

  // ─────────────────────────────────────────────────────────────────────────
  if (!worker) return <div>Worker not found</div>;

  return (
    <div className="flex flex-col min-h-screen bg-slate-900 font-sans overflow-hidden relative">

      {/* ── MAP SECTION ─────────────────────────────────────────────────── */}
      <div ref={mapRef} style={{ minHeight: '55vh' }} className="flex-1 relative">

        {loadingOverlay}
        {simulationOverlay}

        {/* ── Overlay: Back button (top-left) + LIVE badge (top-right) ── */}
        <div className="absolute top-12 left-6 right-6 flex items-center justify-between pointer-events-auto z-20">
          <button
            onClick={() => navigate('/')}
            className="p-4 bg-white/10 backdrop-blur-md rounded-2xl text-white border border-white/10"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>

          {/* RED LIVE badge with ping animation */}
          <div className="relative flex items-center gap-2 px-4 py-2 bg-red-600/90 backdrop-blur-md rounded-full border border-red-500/50 shadow-lg">
            <span className="relative flex h-2.5 w-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-75" />
              <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-white" />
            </span>
            <span className="text-[11px] font-black text-white uppercase tracking-widest">LIVE</span>
          </div>
        </div>

        {/* ── Overlay: ETA / Distance / Status card ─────────────────────── */}
        <div className="absolute bottom-16 left-6 right-6 z-20 pointer-events-none">
          <div className="bg-white/10 backdrop-blur-md border border-white/15 p-5 rounded-[2rem] flex items-center justify-around shadow-2xl">
            {/* ETA */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Time to Arrival</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{eta}</span>
                <span className="text-xs font-bold text-slate-400 uppercase">min</span>
              </div>
            </div>

            <div className="w-[1px] h-10 bg-white/20" />

            {/* Distance */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Distance</span>
              <div className="flex items-baseline gap-1">
                <span className="text-3xl font-black text-white">{distance.toFixed(1)}</span>
                <span className="text-xs font-bold text-slate-400 uppercase">km</span>
              </div>
            </div>

            <div className="w-[1px] h-10 bg-white/20" />

            {/* Status */}
            <div className="flex flex-col items-center">
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest mb-1">Status</span>
              <span className={`text-sm font-black uppercase tracking-wide ${status === 'arrived' ? 'text-emerald-400' : 'text-primary'}`}>
                {status === 'arrived' ? 'Arrived' : 'En Route'}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM SHEET ────────────────────────────────────────────────── */}
      <div className="bg-white rounded-t-[3rem] p-8 -mt-12 relative z-20 shadow-[0_-20px_50px_rgba(0,0,0,0.3)]">
        <div className="w-12 h-1.5 bg-slate-100 rounded-full mx-auto mb-8" />

        <div className="space-y-8">
          {/* Worker info */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-5">
              <Avatar className="h-16 w-16 border ring-4 ring-slate-50">
                <AvatarImage src={worker.avatar} />
                <AvatarFallback>{worker.name[0]}</AvatarFallback>
              </Avatar>
              <div className="flex flex-col">
                <div className="flex items-center gap-1.5">
                  <h2 className="text-xl font-black text-slate-900 leading-none">{worker.name}</h2>
                  <CheckCircle2 className="w-5 h-5 text-blue-500 fill-blue-50" />
                </div>
                <p className="text-xs font-black text-primary uppercase tracking-widest mt-1.5">{worker.category} Specialist</p>
              </div>
            </div>
            <div className="flex bg-slate-50 border border-slate-100 p-2 rounded-2xl items-center gap-1">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-black text-slate-900">{worker.rating}</span>
            </div>
          </div>

          {/* Call / Message */}
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-16 rounded-3xl border-2 font-black text-slate-600 gap-2 text-xs uppercase tracking-widest hover:bg-slate-50"
              onClick={() => window.location.href = 'tel:+923331234567'}
            >
              <Phone className="w-4 h-4" />
              Call Now
            </Button>
            <Button
              className="h-16 rounded-3xl font-black gap-2 text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
              onClick={() => navigate(`/chat/${worker.id}`)}
            >
              <MessageSquare className="w-4 h-4" />
              Message
            </Button>
          </div>

          {/* Cancel */}
          <div className="flex gap-4">
            <Button
              variant="ghost"
              className="flex-1 h-12 rounded-2xl font-bold text-red-500 hover:bg-red-50 hover:text-red-600"
              onClick={() => {
                if (confirm('Are you sure you want to cancel this booking?')) {
                  const reason = prompt('Please provide a reason for cancellation:');
                  if (reason && currentJob) {
                    cancelJob(currentJob.id, reason, currentUser?.role as any);
                    navigate('/jobs');
                  } else if (reason) {
                    showToast('Cancellation submitted.', 'info');
                    navigate('/jobs');
                  }
                }
              }}
            >
              Cancel Booking
            </Button>
          </div>

          {/* Destination + Safety */}
          <div className="bg-slate-50 border border-slate-100 p-6 rounded-[2.5rem] space-y-4">
            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white border border-slate-200 flex items-center justify-center text-slate-500">
                  <Navigation className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900">Destination</span>
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">{address}</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>

            <div className="h-px bg-slate-200" />

            <div className="flex items-center justify-between group cursor-pointer">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-500">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-black text-slate-900">Safety Features</span>
                  <span className="text-[10px] font-black text-blue-400 uppercase tracking-widest leading-none mt-1">24/7 Support Active</span>
                </div>
              </div>
              <ChevronRight className="w-5 h-5 text-slate-300" />
            </div>
          </div>

          {/* Enroute Update card */}
          <div className="bg-slate-950 text-white p-6 rounded-[2.5rem] relative overflow-hidden flex items-center justify-between">
            <div className="absolute top-0 right-0 w-24 h-24 bg-primary/20 blur-3xl" />
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center">
                <Clock className="w-6 h-6 text-primary" />
              </div>
              <div>
                <p className="text-[10px] font-black text-primary uppercase tracking-widest">Enroute Update</p>
                <p className="text-sm font-medium">Helper is in Sector F-6</p>
              </div>
            </div>
            <div className="h-8 px-4 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center text-[9px] font-black uppercase tracking-widest text-emerald-400 animate-pulse">
              On Time
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
