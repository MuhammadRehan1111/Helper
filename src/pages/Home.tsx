import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { MapPin, Search as SearchIcon, Star, CheckCircle, Zap, Wrench, Hammer, Paintbrush, Wind, Car, Sparkles, Truck, WifiOff, Mic, Flower2, GraduationCap } from 'lucide-react';



const categoryIcons: Record<string, any> = {
  Zap, Wrench, Hammer, Paintbrush, Wind, Car, Sparkles, Truck, Flower2, GraduationCap
};

import { useAppContext } from '@/lib/AppContext';
import { mockCategories } from '@/lib/mockData';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

function haversineDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
    Math.sin(dLon/2) * Math.sin(dLon/2); 
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  return parseFloat((R * c).toFixed(1));
}

export default function Home() {
  const navigate = useNavigate();
  const { workers, setWorkers, currentUser, setCurrentAiRequest, showToast, t } = useAppContext();
  const [loading, setLoading] = useState(true);
  const [offline, setOffline] = useState(!navigator.onLine);
  const [aiPrompt, setAiPrompt] = useState('');
  const [isListening, setIsListening] = useState(false);
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);
  const recognitionRef = React.useRef<any>(null);
  
  const [location, setLocation] = useState(() => {
    return localStorage.getItem('user_city_address') || currentUser?.savedAddresses?.[0]?.address || 'Islamabad, Pakistan';
  });
  const [locationLabel, setLocationLabel] = useState('Current Location');
  const [showCitySelector, setShowCitySelector] = useState(false);
  const [selectedCity, setSelectedCity] = useState<'Karachi' | 'Lahore' | 'Islamabad'>(() => {
    return (localStorage.getItem('user_selected_city') as any) || 'Islamabad';
  });
  const [voiceResponse, setVoiceResponse] = useState<string | null>(null);


  const handleLocationChange = () => {
    navigate('/addresses');
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice recognition not supported in this browser. Please try Chrome or Safari.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      // Try Urdu first, fallback to English
      const urduLangs = ['ur-PK', 'ur', 'en-US'];
      let langIndex = 0;
      
      recognition.lang = urduLangs[langIndex];
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
        showToast('Listening...', 'info');
      };
      
      recognition.onerror = (event: any) => {
        if (event.error === 'language-not-supported' && langIndex < urduLangs.length - 1) {
          langIndex++;
          recognition.lang = urduLangs[langIndex];
          try {
            recognition.start();
          } catch (e) {
            console.error('Error restarting recognition:', e);
          }
          return;
        }
        setIsListening(false);
        if (event.error === 'not-allowed') {
          alert("Please enable microphone permissions in your browser settings to use voice search.");
        } else if (event.error !== 'aborted') {
          showToast(`Voice error: ${event.error}`, 'error');
        }
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onresult = async (event: any) => {
        const transcript = event.results[0][0].transcript;
        setAiPrompt(transcript);
        showToast('Processing voice...', 'info');
        
        try {
          const res = await fetch('/api/ai/voice-agent', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: transcript })
          });
          
          if (res.ok) {
            const data = await res.json();
            const reply = data.response;
            setVoiceResponse(reply);
            
            if ('speechSynthesis' in window) {
              const utterance = new SpeechSynthesisUtterance(reply);
              const isUrdu = /[\u0600-\u06FF]/.test(reply);
              utterance.lang = isUrdu ? 'ur-PK' : 'en-US';
              utterance.rate = 1.0;
              window.speechSynthesis.cancel();
              window.speechSynthesis.speak(utterance);
            }
            
            setTimeout(() => {
              setVoiceResponse(null);
              setCurrentAiRequest({
                id: Math.random().toString(36).substr(2, 9),
                text: transcript
              });
              navigate('/ai-processing');
            }, 3500);
          } else {
            setCurrentAiRequest({
              id: Math.random().toString(36).substr(2, 9),
              text: transcript
            });
            navigate('/ai-processing');
          }
        } catch (err) {
          console.error('Voice agent fetch error:', err);
          setCurrentAiRequest({
            id: Math.random().toString(36).substr(2, 9),
            text: transcript
          });
          navigate('/ai-processing');
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Speech start error:', err);
      setIsListening(false);
    }
  };

  const handleAiSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!aiPrompt.trim()) return;
    
    setCurrentAiRequest({
      id: Math.random().toString(36).substr(2, 9),
      text: aiPrompt
    });
    navigate('/ai-processing');
  };

  const updateWorkerDistances = useCallback((lat: number, lng: number) => {
    setWorkers(prev => {
      const updated = prev.map(w => {
        if (w.lat && w.lng) {
          const dist = haversineDistance(lat, lng, w.lat, w.lng);
          return { ...w, distance: dist };
        }
        return w;
      });
      return updated;
    });
  }, [setWorkers]);

  const selectCityManually = useCallback((city: 'Karachi' | 'Lahore' | 'Islamabad') => {
    const centers = {
      Karachi: { lat: 24.8607, lng: 67.0011 },
      Lahore: { lat: 31.5204, lng: 74.3587 },
      Islamabad: { lat: 33.6844, lng: 73.0479 }
    };
    const center = centers[city];
    setSelectedCity(city);
    localStorage.setItem('user_selected_city', city);
    setLocationLabel('City Center');
    setLocation(`${city}, Pakistan`);
    localStorage.setItem('user_city_address', `${city}, Pakistan`);
    updateWorkerDistances(center.lat, center.lng);
    setShowCitySelector(false);
  }, [updateWorkerDistances]);

  useEffect(() => {
    const handleOnline = () => setOffline(false);
    const handleOffline = () => setOffline(true);

    const beforeInstallPrompt = (e: any) => {
      e.preventDefault();
      setInstallPrompt(e);
      setShowInstallBanner(true);
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    window.addEventListener('beforeinstallprompt', beforeInstallPrompt);

    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent) && !(window as any).MSStream;
    const isInStandalone = ('standalone' in navigator && (navigator as any).standalone) || window.matchMedia('(display-mode: standalone)').matches;
    if (isIOS && !isInStandalone) {
      showToast('Share button dabao → Add to Home Screen', 'info');
    }

    // Geolocation detection
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocationLabel('Live Location');
          setLocation(`${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          localStorage.setItem('user_city_address', `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
          
          // Determine which city center is closest to automatically set selectedCity
          const centers = {
            Karachi: { lat: 24.8607, lng: 67.0011 },
            Lahore: { lat: 31.5204, lng: 74.3587 },
            Islamabad: { lat: 33.6844, lng: 73.0479 }
          };
          let nearestCity: 'Karachi' | 'Lahore' | 'Islamabad' = 'Islamabad';
          let minDist = Infinity;
          Object.entries(centers).forEach(([cityName, coords]) => {
            const dist = haversineDistance(latitude, longitude, coords.lat, coords.lng);
            if (dist < minDist) {
              minDist = dist;
              nearestCity = cityName as any;
            }
          });
          setSelectedCity(nearestCity);
          localStorage.setItem('user_selected_city', nearestCity);
          
          updateWorkerDistances(latitude, longitude);
          setLoading(false);
        },
        (error) => {
          console.log('Geolocation error, opening city selector:', error);
          setShowCitySelector(true);
          setLoading(false);
        }
      );
    } else {
      setShowCitySelector(true);
      setLoading(false);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('beforeinstallprompt', beforeInstallPrompt);
    };
  }, [updateWorkerDistances]);
  
  const cityFilteredWorkers = workers.filter(w => w.city === selectedCity);
  const sortedCityWorkers = [...cityFilteredWorkers].sort((a, b) => {
    if (a.distance !== b.distance) {
      return a.distance - b.distance;
    }
    return b.rating - a.rating;
  });

  const topRated = sortedCityWorkers.filter(w => w.rating >= 4.5);
  const availableNow = sortedCityWorkers.filter(w => w.available);

  if (offline) {
    return (
      <div className="flex flex-col min-h-screen items-center justify-center p-8 text-center bg-background font-sans">
        <div className="relative mb-8">
          <div className="absolute inset-0 bg-primary/10 blur-3xl rounded-full"></div>
          <WifiOff className="w-20 h-20 text-primary relative z-10 animate-pulse" />
        </div>
        <h2 className="text-2xl font-black mb-3">No Connection</h2>
        <p className="text-muted-foreground mb-8 text-sm leading-relaxed max-w-[240px]">We couldn't connect to the orchestration layer. Check your network or use offline mode.</p>
        <div className="flex flex-col w-full gap-3">
          <button onClick={() => window.location.reload()} className="bg-primary text-primary-foreground w-full py-4 rounded-[2rem] font-bold shadow-xl shadow-primary/20 transition-all active:scale-95">
            Retry Connection
          </button>
          <button onClick={() => setOffline(false)} className="text-primary font-bold text-sm">
            Continue Anyway (Mock Mode)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans overflow-x-hidden pb-24">
      {/* Premium Header */}
      <header className="px-6 pt-12 pb-8 bg-gradient-to-b from-primary/15 via-primary/5 to-transparent relative">
        <div className="absolute top-0 right-0 w-64 h-64 bg-primary/20 blur-[100px] rounded-full -mr-32 -mt-32"></div>
        <div className="absolute top-20 left-0 w-32 h-32 bg-purple-500/10 blur-[80px] rounded-full -ml-16"></div>
        
        <div className="flex items-center justify-between mb-10 relative z-10">
          <div className="flex flex-col">
            <h1 className="text-2xl font-black tracking-tight text-foreground leading-none">
              Hello, <span className="text-primary">{currentUser?.name?.split(' ')[0] || 'Helper'}</span>
            </h1>
            <p 
              className="text-[11px] text-muted-foreground font-black uppercase tracking-widest flex items-center gap-1.5 mt-2 cursor-pointer hover:text-primary transition-colors"
              onClick={handleLocationChange}
            >
              <MapPin className="w-3 h-3 text-primary" />
              {locationLabel}: {location}
            </p>
          </div>
          <Link to="/profile">
            <div className="relative">
              <Avatar className="h-14 w-14 ring-4 ring-background shadow-2xl transition-all hover:scale-105 active:scale-95">
                <AvatarImage src={currentUser?.avatar || `https://i.pravatar.cc/150?u=${currentUser?.id}`} />
                <AvatarFallback>{currentUser?.name?.[0] || 'U'}</AvatarFallback>
              </Avatar>
              <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-emerald-500 border-2 border-background rounded-full"></div>
            </div>
          </Link>
        </div>
        
        <form onSubmit={handleAiSubmit} className="relative group">
          <div className="absolute inset-0 bg-primary/20 blur-2xl opacity-0 group-focus-within:opacity-100 transition-opacity rounded-[2rem]"></div>
          <SearchIcon className="absolute left-6 top-1/2 -translate-y-1/2 w-5 h-5 text-primary transition-colors" />
          <Input 
            type="text" 
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            placeholder="Apni zaroorat batayein... (e.g. Mujhe electrician chahiye)" 
            className="w-full pl-14 pr-14 bg-background/60 backdrop-blur-md text-foreground border-border/50 rounded-[2rem] h-16 shadow-[0_8px_30px_rgb(0,0,0,0.08)] focus-visible:ring-2 focus-visible:ring-primary/20 text-lg font-bold transition-all relative z-10 placeholder:text-muted-foreground/40 border-2 focus-visible:border-primary/30"
          />
          <button 
            type="button" 
            onClick={startListening}
            className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-2xl transition-all z-20 ${isListening ? 'bg-rose-500 text-white shadow-xl animate-pulse scale-110' : 'bg-secondary text-muted-foreground hover:text-primary hover:bg-primary/10'}`}
          >
            <Mic className="w-5 h-5" />
          </button>
        </form>

        <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-hide pb-2 no-scrollbar">
           <div className="shrink-0 px-5 py-2.5 bg-background shadow-sm rounded-2xl text-[11px] font-bold border border-border/10 flex items-center gap-2">
              <Sparkles className="w-3 h-3 text-amber-500" />
              <span>Roman Urdu: "AC technician chahiye"</span>
           </div>
           <div className="shrink-0 px-5 py-2.5 bg-background shadow-sm rounded-2xl text-[11px] font-bold border border-border/10 flex items-center gap-2">
              <Zap className="w-3 h-3 text-primary" />
              <span>"Urgent plumber in DHA"</span>
           </div>
        </div>
      </header>

      {/* Categories */}
      <section className="px-6 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black tracking-tight">Services</h2>
          <Link to="/search" className="text-xs font-bold text-primary uppercase tracking-widest">Explore All</Link>
        </div>
        <div className="grid grid-cols-5 gap-y-8 gap-x-4">
          {mockCategories.slice(0, 10).map((cat, idx) => {
            const IconComponent = categoryIcons[cat.icon] || Star;
            return (
            <Link key={cat.id} to={`/search?category=${cat.name}`} className="flex flex-col items-center gap-3 group">
              <div className="w-14 items-center justify-center p-[2px] rounded-2xl bg-gradient-to-br from-primary/20 to-primary/5 transition-all group-hover:scale-110 active:scale-95 group-hover:shadow-lg group-hover:shadow-primary/10">
                <div className="w-full h-13 rounded-2xl bg-card flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                  <IconComponent className="w-6 h-6 stroke-[2.5px]" />
                </div>
              </div>
              <span className="text-[10px] font-black uppercase tracking-tight text-center text-muted-foreground group-hover:text-foreground transition-colors">{cat.name}</span>
            </Link>
          )})}
        </div>
      </section>

      {/* Dynamic Promo Banner */}
      <section className="px-6 pb-10">
        <div className="bg-slate-900 rounded-[2rem] p-8 text-left border border-white/5 shadow-2xl relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-64 h-64 bg-primary/30 blur-[80px] rounded-full -mr-32 -mt-32 transition-transform group-hover:scale-110 duration-700"></div>
           <div className="absolute bottom-0 left-0 w-32 h-32 bg-blue-500/20 blur-[60px] rounded-full -ml-16 -mb-16"></div>
           
           <div className="relative z-10">
             <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-widest mb-4 border border-primary/20">
                <Sparkles className="w-3 h-3" />
                Featured Offer
             </div>
             <h2 className="text-3xl font-black text-white leading-[1.1] mb-2">Can't explain <br />it properly?</h2>
             <p className="text-sm text-slate-400 mb-6 font-medium max-w-[200px]">Just send a voice note or post a custom request for bidders.</p>
             <button className="bg-white text-slate-950 px-8 py-4 rounded-2xl font-black text-sm shadow-xl hover:scale-105 active:scale-95 transition-all" onClick={() => navigate('/post-job')}>
               Post Custom Job
             </button>
           </div>
        </div>
      </section>

      {/* Available Now */}
      <section className="py-2">
        <div className="px-4 mb-4">
          <h2 className="text-lg font-bold">Available Near You</h2>
        </div>
        <div className="flex overflow-x-auto gap-4 px-4 pb-4 snap-x hide-scrollbar">
          {loading ? (
             Array(3).fill(0).map((_, i) => (
                <div key={i} className="snap-start shrink-0 w-64 bg-card rounded-2xl p-4 shadow-sm border border-border/50 animate-pulse">
                  <div className="flex items-start gap-3">
                    <div className="h-12 w-12 rounded-full bg-secondary"></div>
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-secondary rounded w-3/4"></div>
                      <div className="h-3 bg-secondary rounded w-1/2"></div>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between">
                    <div className="h-4 bg-secondary rounded w-1/4"></div>
                    <div className="h-4 bg-secondary rounded w-1/3"></div>
                  </div>
                </div>
             ))
          ) : availableNow.map(worker => (
            <Link key={worker.id} to={`/worker/${worker.id}`} className="snap-start shrink-0 w-64 bg-card rounded-2xl p-4 shadow-sm border border-border/50">
              <div className="flex items-start gap-3">
                <div className="relative">
                  <Avatar className="h-12 w-12 border">
                    <AvatarImage src={worker.avatar} />
                    <AvatarFallback>{worker.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-green-500 border-2 border-card rounded-full"></span>
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-semibold truncate">{worker.name}</h3>
                    {worker.verified && <CheckCircle className="w-3.5 h-3.5 text-blue-500" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{worker.category}</p>
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between text-sm">
                <div className="flex items-center gap-1 text-amber-500 font-medium">
                  <Star className="fill-current w-4 h-4" />
                  <span>{worker.rating}</span>
                  <span className="text-muted-foreground font-normal text-xs">({worker.reviewsCount})</span>
                </div>
                <div className="font-semibold text-primary">Rs. {worker.hourlyRate}/hr</div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Top Rated */}
      <section className="px-4 py-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-bold">Top Rated</h2>
        </div>
        <div className="flex flex-col gap-3">
          {topRated.map(worker => (
            <Link key={worker.id} to={`/worker/${worker.id}`} className="flex items-center gap-4 bg-card p-3 rounded-2xl shadow-sm border border-border/50">
               <Avatar className="h-16 w-16 border">
                  <AvatarImage src={worker.avatar} />
                  <AvatarFallback>{worker.name[0]}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold truncate">{worker.name}</h3>
                    {worker.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{worker.category}</p>
                  <div className="flex gap-2">
                    {(worker.tags || []).slice(0, 2).map((tag, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-sm bg-secondary text-[10px] font-medium text-secondary-foreground">{tag}</span>
                    ))}
                  </div>
                </div>
                <div className="text-right">
                  <div className="flex items-center justify-end gap-1 text-amber-500 font-medium mb-1">
                    <Star className="fill-current w-3.5 h-3.5" />
                    <span className="text-sm">{worker.rating}</span>
                  </div>
                  <div className="text-xs font-semibold text-primary">Rs. {worker.hourlyRate}</div>
                </div>
            </Link>
          ))}
        </div>
      </section>
    {voiceResponse && (
        <div className="fixed inset-x-6 bottom-24 bg-primary text-primary-foreground p-5 rounded-3xl shadow-2xl z-50 flex items-center gap-4 animate-bounce">
          <Mic className="w-8 h-8 shrink-0 text-white animate-pulse" />
          <div className="flex-1">
            <span className="text-[10px] font-bold uppercase tracking-widest opacity-70">Voice Assistant</span>
            <p className="text-base font-bold leading-snug">{voiceResponse}</p>
          </div>
        </div>
      )}

      {showCitySelector && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[100] flex items-center justify-center p-6">
          <div className="bg-card w-full max-w-sm rounded-[2.5rem] p-6 shadow-2xl space-y-6 border text-center">
            <div className="space-y-2">
              <span className="text-3xl">📍</span>
              <h3 className="text-xl font-black">Select Your City</h3>
              <p className="text-xs text-muted-foreground">Location permission is required or you can manually select your city to search nearby helpers:</p>
            </div>
            
            <div className="flex flex-col gap-3">
              {(['Karachi', 'Lahore', 'Islamabad'] as const).map(city => (
                <button
                  key={city}
                  onClick={() => selectCityManually(city)}
                  className={`w-full py-4 rounded-2xl font-bold text-sm border transition-all active:scale-[0.98] ${selectedCity === city ? 'bg-primary text-primary-foreground border-primary' : 'bg-secondary/40 hover:bg-secondary border-border/50'}`}
                >
                  {city}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
