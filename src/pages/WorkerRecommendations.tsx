import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Star, MapPin, CheckCircle2, History, MessageSquare, ShieldCheck, Zap, Info, Bot } from 'lucide-react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { motion } from 'motion/react';

export default function WorkerRecommendations() {
  const navigate = useNavigate();
  const { currentAiRequest } = useAppContext();

  const matches = currentAiRequest?.matches ?? [];
  const rankingLogic = currentAiRequest?.rankingLogic ?? "";

  if (!currentAiRequest) {
    return (
      <div className="p-12 flex flex-col items-center justify-center min-h-screen text-center space-y-6">
        <div className="w-24 h-24 bg-primary/10 rounded-[2rem] flex items-center justify-center animate-pulse">
           <Info className="w-10 h-10 text-primary" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl font-black tracking-tight">Data Sync Required</h2>
          <p className="text-muted-foreground text-sm font-medium">Our Orchestrator couldn't find enough details to recommend a pro.</p>
        </div>
        <Button onClick={() => navigate('/')} className="h-14 rounded-3xl px-8 font-black uppercase text-xs tracking-widest">
           Refine Request
        </Button>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div className="flex flex-col min-h-screen bg-slate-50 p-6 font-sans">
        <header className="py-6 flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2.5 bg-white shadow-sm border rounded-2xl">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <h1 className="text-xl font-black">AI Feedback</h1>
        </header>

        <main className="flex-1 space-y-8 py-10">
           <div className="bg-slate-950 rounded-[2.5rem] p-8 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
              <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
                   <Bot className="w-6 h-6 text-primary" />
                </div>
                <div className="flex flex-col">
                   <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Orchestrator feedback</p>
                   <h3 className="text-xl font-black">Refinement Needed</h3>
                </div>
              </div>
              
              <div className="bg-white/5 border border-white/5 p-6 rounded-3xl font-medium text-sm leading-relaxed text-slate-300 italic">
                 "{rankingLogic || "I need a bit more information to find the perfect helper. Please specify your location or a more detailed service description."}"
              </div>
           </div>

           <div className="space-y-4">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground px-2">Example Requests</h4>
              <div className="grid gap-3">
                 <div className="bg-white border p-4 rounded-2xl shadow-sm text-xs font-bold text-slate-600">
                    "Need a <span className="text-primary">plumber</span> for leak fix in <span className="text-primary">DHA Phase 6</span> tonight"
                 </div>
                 <div className="bg-white border p-4 rounded-2xl shadow-sm text-xs font-bold text-slate-600">
                    "Mujhe kal <span className="text-primary">AC technician</span> chahiye <span className="text-primary">Gulshan</span> me"
                 </div>
              </div>
           </div>

           <Button onClick={() => navigate('/')} className="w-full h-16 rounded-3xl font-black uppercase text-xs tracking-widest shadow-xl shadow-primary/20 mt-8">
              Update Request
           </Button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans pb-20 max-w-md mx-auto shadow-2xl relative overflow-x-hidden">
      <header className="px-6 py-6 flex items-center justify-between bg-card/80 backdrop-blur-md border-b sticky top-0 z-20">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/')} className="p-2.5 bg-secondary hover:bg-secondary/80 rounded-2xl transition-colors">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black tracking-tight leading-none">Best Matches</h1>
            <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">Helper IQ Ranking</span>
          </div>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8">
        {/* Intent Summary */}
        <section className="bg-slate-950 rounded-[2rem] p-6 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
           <div className="flex items-center gap-3 mb-4">
             <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
               <Bot className="w-5 h-5 text-primary" />
             </div>
             <div className="flex flex-col">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">Intent Detected</p>
               <h3 className="text-lg font-black text-white">{currentAiRequest.intent?.service}</h3>
             </div>
           </div>
           
           <div className="grid grid-cols-2 gap-3">
             <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Location</p>
                <p className="text-sm font-bold truncate">{currentAiRequest.intent?.location}</p>
             </div>
             <div className="bg-white/5 border border-white/10 p-3 rounded-2xl">
                <p className="text-[9px] text-slate-400 uppercase font-black tracking-widest mb-1">Time Preference</p>
                <p className="text-sm font-bold truncate">{currentAiRequest.intent?.time}</p>
             </div>
           </div>
        </section>

        {/* Worker Cards */}
        <div className="space-y-6">
           <div className="flex items-center justify-between px-2">
              <h2 className="text-sm font-black uppercase tracking-widest text-muted-foreground">Top Recommendations</h2>
              <div className="flex items-center gap-1.5 text-[10px] font-bold text-primary">
                 <ShieldCheck className="w-3 h-3" />
                 Verified Only
              </div>
           </div>

            {matches.map((worker, idx) => (
             <motion.div 
               initial={{ opacity: 0, y: 30 }}
               animate={{ opacity: 1, y: 0 }}
               transition={{ delay: idx * 0.1, type: "spring", stiffness: 100 }}
               key={worker.id} 
               className="bg-card rounded-[2.5rem] border border-border/50 shadow-[0_10px_40px_rgb(0,0,0,0.03)] overflow-hidden relative group"
             >
               <div className="p-6">
                  <div className="flex gap-5">
                    <div className="relative shrink-0">
                      <div className="absolute inset-0 bg-primary/20 blur-xl scale-75 group-hover:scale-100 transition-transform rounded-full"></div>
                      <Avatar className="h-20 w-20 ring-4 ring-background shadow-xl relative z-10">
                        <AvatarImage src={worker.avatar} />
                        <AvatarFallback>{worker.name[0]}</AvatarFallback>
                      </Avatar>
                      <div className="absolute -top-1 -left-1 bg-slate-900 text-white w-8 h-8 rounded-2xl flex items-center justify-center text-xs font-black border-4 border-background z-20">
                         #{idx + 1}
                      </div>
                    </div>
                    
                    <div className="flex-1">
                       <div className="flex items-start justify-between">
                         <div className="flex flex-col">
                           <div className="flex items-center gap-1.5">
                             <h3 className="font-black text-xl tracking-tight">{worker.name}</h3>
                             {worker.verified && <CheckCircle2 className="w-4 h-4 text-primary fill-primary/10" />}
                           </div>
                           <p className="text-xs font-bold text-muted-foreground">{worker.category}</p>
                         </div>
                         <div className="h-10 w-10 flex items-center justify-center rounded-2xl bg-secondary transition-colors group-hover:bg-primary/10">
                            <Star className="w-5 h-5 text-amber-500 fill-amber-500" />
                         </div>
                       </div>
                       
                       <div className="flex items-center gap-4 mt-3">
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">IQ Score</span>
                            <span className="text-lg font-black text-primary">{worker.score || 90}<span className="text-[10px] ml-0.5">%</span></span>
                          </div>
                          <div className="w-[1px] h-6 bg-border/50"></div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Distance</span>
                            <span className="text-lg font-black text-foreground">{worker.distance}<span className="text-[10px] ml-0.5">km</span></span>
                          </div>
                          <div className="w-[1px] h-6 bg-border/50"></div>
                          <div className="flex flex-col">
                            <span className="text-[9px] font-black text-muted-foreground uppercase tracking-widest leading-none">Jobs</span>
                            <span className="text-lg font-black text-foreground">{worker.reviewsCount}</span>
                          </div>
                       </div>
                    </div>
                  </div>

                  <div className="mt-6 p-4 bg-secondary/30 rounded-2xl border border-border/20">
                     <div className="flex items-start gap-2">
                        <Info className="w-3.5 h-3.5 text-primary mt-0.5 shrink-0" />
                        <p className="text-[11px] font-medium leading-relaxed italic text-muted-foreground">
                          "{worker.reasoning || `Highly recommended due to ${worker.rating} rating and close proximity.`}"
                        </p>
                     </div>
                  </div>
               </div>

               <div className="bg-slate-50 px-6 py-4 flex items-center justify-between border-t border-border/30">
                  <div className="text-left">
                    <p className="text-lg font-bold text-slate-950 leading-none">Rs.{worker.hourlyRate}</p>
                    <p className="text-[9px] font-black text-slate-500 uppercase tracking-widest mt-1">Est. per hour</p>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="ghost" size="icon" className="h-12 w-12 rounded-2xl bg-white shadow-sm hover:scale-110 active:scale-95 transition-all text-primary hover:text-primary">
                       <MessageSquare className="w-5 h-5" />
                    </Button>
                    <Button 
                      className="rounded-2xl font-black text-xs uppercase tracking-widest px-8 h-12 shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all" 
                      onClick={() => navigate(`/worker/${worker.id}`)}
                    >
                       Hire Helper
                    </Button>
                  </div>
               </div>
             </motion.div>
           ))}
        </div>

        <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex items-start gap-4 shadow-sm">
           <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
             <ShieldCheck className="w-6 h-6 text-blue-600" />
           </div>
           <div className="flex flex-col">
              <h4 className="text-sm font-black text-blue-900 uppercase tracking-widest mb-1">Ranking Logic</h4>
              <p className="text-xs text-blue-700 leading-relaxed font-medium">
                 {rankingLogic || "Workers are ranked using a multi-factor score including distance, verification status, and historical completion rates."}
              </p>
           </div>
        </div>
      </main>
    </div>
  );
}
