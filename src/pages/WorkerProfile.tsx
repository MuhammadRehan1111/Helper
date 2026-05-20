import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/AppContext';
import { ArrowLeft, Star, CheckCircle, ShieldCheck, MessageSquare, Heart, Zap, BadgeCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function WorkerProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workers } = useAppContext();
  
  const worker = workers.find(w => w.id === id);
  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!worker) return <div className="p-8 text-center font-black">Worker not found</div>;

  return (
    <div className="flex flex-col min-h-full bg-slate-50 pb-24 relative font-sans overflow-hidden">
      {/* Header Image Area */}
      <div className="h-64 bg-slate-900 relative">
        <img 
          src={worker.gallery?.[0] || "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&q=80&w=1000"} 
          alt="Cover" 
          className="w-full h-full object-cover opacity-60"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 to-transparent"></div>
        
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-6 left-6 h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 text-white hover:bg-white/30"
          onClick={handleBack}
        >
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <Button 
          variant="secondary" 
          size="icon" 
          className="absolute top-6 right-6 h-10 w-10 rounded-2xl bg-white/20 backdrop-blur-md border border-white/20 text-rose-400 hover:bg-white/30"
          onClick={() => alert("Helper saved to favorites!")}
        >
          <Heart className="w-5 h-5" />
        </Button>
      </div>

      {/* Profile Info Details */}
      <div className="max-w-md w-full mx-auto -mt-20 relative z-10 px-6">
        <div className="bg-white rounded-[2.5rem] p-8 shadow-[0_20px_50px_rgb(0,0,0,0.08)] border border-slate-100 flex flex-col items-center text-center">
          <div className="relative">
            <div className="absolute inset-0 bg-primary/20 blur-2xl scale-125 rounded-full"></div>
            <Avatar className="h-28 w-28 mx-auto -mt-14 border-8 border-white bg-slate-50 relative shadow-xl">
              <AvatarImage src={worker.avatar} className="object-cover" />
              <AvatarFallback className="bg-primary/10 text-primary font-black text-2xl">{worker.name[0]}</AvatarFallback>
            </Avatar>
            {worker.isPro && (
              <div className="absolute bottom-0 right-0 bg-primary text-white p-2 rounded-2xl border-4 border-white shadow-lg">
                 <Zap className="w-4 h-4 fill-current" />
              </div>
            )}
          </div>
          
          <div className="mt-6 flex items-center justify-center gap-2">
            <h1 className="text-2xl font-black tracking-tight text-slate-900">{worker.name}</h1>
            {worker.verified && <CheckCircle className="w-5 h-5 text-blue-500 fill-blue-50" />}
          </div>
          
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-primary/5 text-primary rounded-full mt-2">
             <div className="w-1.5 h-1.5 bg-primary rounded-full animate-pulse"></div>
             <span className="text-[10px] font-black uppercase tracking-widest">{worker.category} Specialist</span>
          </div>

          <div className="flex items-center gap-2 mt-4 px-4 py-2 bg-slate-900 rounded-2xl shadow-lg">
             <Zap className="w-3.5 h-3.5 text-emerald-400" />
             <div className="flex flex-col items-start leading-none">
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-widest">Helper IQ Rank</span>
                <span className="text-[11px] font-black text-white italic">TOP 0.1% WORLDWIDE</span>
             </div>
          </div>
          
          <div className="grid grid-cols-3 w-full gap-2 mt-8">
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 transition-transform hover:scale-105">
               <div className="flex justify-center items-baseline gap-0.5">
                  <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                  <span className="text-lg font-black text-slate-900">{worker.rating}</span>
               </div>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Rating</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 transition-transform hover:scale-105">
               <span className="text-lg font-black text-slate-900">Rs {worker.hourlyRate}</span>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">Per Hour</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-3xl p-4 transition-transform hover:scale-105">
               <span className="text-lg font-black text-slate-900">{worker.distance}k</span>
               <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mt-1">KM Away</p>
            </div>
          </div>
        </div>
      </div>

      <div className="px-6 mt-8 space-y-8">
        <section className="space-y-3">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">Professional Bio</h3>
           <div className="bg-white rounded-3xl p-6 border border-slate-100 shadow-sm leading-relaxed text-slate-600 font-medium text-sm">
              {worker.bio}
           </div>
        </section>

        <section className="space-y-3">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">Helper Expertise</h3>
           <div className="flex flex-wrap gap-2">
              {(worker.tags || []).map(tag => (
                <div key={tag} className="px-5 py-2.5 bg-white border border-slate-100 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 shadow-sm transition-all hover:border-primary/30 hover:text-primary">
                   {tag}
                </div>
              ))}
           </div>
        </section>

        <section className="space-y-3">
           <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 px-2">Work Gallery</h3>
           <div className="grid grid-cols-3 gap-2 overflow-hidden px-2">
              {[1, 2, 3].map(i => (
                 <div key={i} className="aspect-square bg-slate-200 rounded-2xl overflow-hidden hover:scale-105 transition-transform cursor-zoom-in">
                    <img 
                       src={`https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=200&q=80&sig=${i+worker.id}`} 
                       alt="Work project" 
                       className="w-full h-full object-cover"
                    />
                 </div>
              ))}
           </div>
           <p className="text-[10px] text-muted-foreground font-medium px-2 italic">Real photos of past services completed by {worker.name.split(' ')[0]}.</p>
        </section>

        <section className="bg-white rounded-[2.5rem] p-6 border border-slate-100 shadow-sm space-y-4">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-blue-50 flex items-center justify-center">
                    <ShieldCheck className="w-6 h-6 text-blue-500" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">Identity Security</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">CNIC & Biometric Verified</span>
                 </div>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-500" />
           </div>
           
           <div className="h-px bg-slate-100"></div>

           <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                 <div className="w-12 h-12 rounded-2xl bg-indigo-50 flex items-center justify-center">
                    <BadgeCheck className="w-6 h-6 text-indigo-500" />
                 </div>
                 <div className="flex flex-col">
                    <span className="text-sm font-black text-slate-900">Background Checked</span>
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mt-1">Police verification: Clear</span>
                 </div>
              </div>
              <CheckCircle className="w-6 h-6 text-emerald-500" />
           </div>
        </section>

        <section className="bg-slate-900 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
           <div className="flex items-center gap-4 mb-6">
              <div className="w-12 h-12 rounded-2xl bg-white/10 flex items-center justify-center backdrop-blur-md">
                 <Star className="w-6 h-6 text-amber-400 fill-amber-400" />
              </div>
              <div className="flex flex-col">
                 <span className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Service Reviews</span>
                 <span className="text-lg font-black">{worker.reviewsCount} Satisfied Clients</span>
              </div>
           </div>
           
           <div className="space-y-6">
              {[1, 2].map(i => (
                 <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-5 space-y-2 backdrop-blur-sm">
                    <div className="flex items-center justify-between">
                       <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">Verified Customer</span>
                       <div className="flex gap-0.5">
                          {[1,2,3,4,5].map(s => <Star key={s} className="w-2.5 h-2.5 text-amber-500 fill-amber-500" />)}
                       </div>
                    </div>
                    <p className="text-xs font-medium text-slate-200 leading-relaxed italic">
                       "Extraordinary service level. Arrived in 15 minutes as promised and fixed the complex wiring issue efficiently. 100% recommended."
                    </p>
                 </div>
              ))}
           </div>
        </section>
      </div>

      <div className="fixed bottom-0 left-0 right-0 max-w-md mx-auto p-6 bg-white/80 backdrop-blur-xl border-t shadow-[0_-20px_50px_rgba(0,0,0,0.06)] pb-safe z-50 rounded-t-[3rem]">
        <div className="flex gap-4">
          <Button variant="outline" size="icon" className="h-16 w-16 shrink-0 rounded-3xl border-2 hover:bg-slate-50 transition-all active:scale-90" onClick={() => navigate(`/chat/${worker.id}`)}>
            <MessageSquare className="w-6 h-6 text-primary" />
          </Button>
          <Button 
            className="flex-1 h-16 rounded-3xl font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all" 
            onClick={() => navigate(`/book/${worker.id}`)}
          >
            Hire Helper
          </Button>
        </div>
      </div>
    </div>
  );
}
