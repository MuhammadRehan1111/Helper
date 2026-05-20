import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { Bot, Search, BarChart3, CheckCircle2, Loader2, Sparkles, BrainCircuit } from 'lucide-react';
import { useAppContext } from '@/lib/AppContext';

export default function AIProcessing() {
  const navigate = useNavigate();
  const { currentAiRequest, workers, addAgentLog, clearAgentLogs, setCurrentAiRequest, showToast } = useAppContext();
  const [step, setStep] = useState(0);

  const steps = [
    { title: "Intent Understanding", icon: BrainCircuit, description: "Analyzing semantic intent...", color: "text-blue-400", bg: "bg-blue-500/10", border: "border-blue-500/20" },
    { title: "Provider Discovery", icon: Search, description: "Scanning nearby Helper pros...", color: "text-purple-400", bg: "bg-purple-500/10", border: "border-purple-500/20" },
    { title: "Helper IQ Ranking", icon: BarChart3, description: "Calculating weighted scores...", color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { title: "Decision Engine", icon: Sparkles, description: "Finalizing recommendations...", color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" }
  ];

  useEffect(() => {
    if (!currentAiRequest) {
      navigate('/');
      return;
    }

    const processRequest = async () => {
      clearAgentLogs();
      
      try {
        const response = await fetch('/api/ai/orchestrate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            prompt: currentAiRequest.text,
            workers: workers
          })
        });

        if (!response.ok) throw new Error("Processing failed");

        const data = await response.json();
        
        // Simulate progress for UI effect
        for (let i = 0; i < steps.length; i++) {
          setStep(i);
          await new Promise(r => setTimeout(r, 400));
        }

        // Save logs and partial data
        data.agentLogs.forEach((log: any) => {
          addAgentLog({
            id: Math.random().toString(36).substr(2, 9),
            ...log,
            timestamp: new Date().toLocaleTimeString()
          });
        });

        const matchedWorkers = workers.filter(w => 
          data.topMatches.map((m: any) => m.workerId).includes(w.id)
        ).map(w => {
          const matchData = data.topMatches.find((m: any) => m.workerId === w.id);
          return {
             ...w,
             score: matchData?.score,
             reasoning: matchData?.reasoning
          };
        });

        setCurrentAiRequest({
          ...currentAiRequest,
          intent: data.intent,
          matches: matchedWorkers,
          rankingLogic: data.rankingLogic
        });

        navigate('/recommendations');
      } catch (error) {
        console.error("AI Orchestration Error:", error);
        // Retry once before giving up
        try {
          await new Promise(r => setTimeout(r, 1500));
          // retry the fetch call once
          const retryResponse = await fetch('/api/ai/orchestrate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt: currentAiRequest.text, workers })
          });
          if (!retryResponse.ok) throw new Error("Retry failed");
          const retryData = await retryResponse.json();
          
          for (let i = 0; i < steps.length; i++) {
            setStep(i);
            await new Promise(r => setTimeout(r, 400));
          }

          retryData.agentLogs.forEach((log: any) => {
            addAgentLog({
              id: Math.random().toString(36).substr(2, 9),
              ...log,
              timestamp: new Date().toLocaleTimeString()
            });
          });

          const matchedWorkers = workers.filter(w => 
            retryData.topMatches.map((m: any) => m.workerId).includes(w.id)
          ).map(w => {
            const matchData = retryData.topMatches.find((m: any) => m.workerId === w.id);
            return {
               ...w,
               score: matchData?.score,
               reasoning: matchData?.reasoning
            };
          });

          setCurrentAiRequest({
            ...currentAiRequest,
            intent: retryData.intent,
            matches: matchedWorkers,
            rankingLogic: retryData.rankingLogic
          });

          navigate('/recommendations');
        } catch (retryError) {
          showToast("AI service unavailable. Showing top-rated providers.", "error");
          // Fallback: show top 3 workers by rating
          const fallbackWorkers = [...workers]
            .sort((a, b) => b.rating - a.rating)
            .slice(0, 3)
            .map(w => ({ ...w, score: w.rating * 20, reasoning: "Top rated provider in your area" }));
          setCurrentAiRequest({
            ...currentAiRequest,
            intent: { service: currentAiRequest.text, location: "Your area", time: "ASAP", urgency: "medium" },
            matches: fallbackWorkers,
            rankingLogic: "Showing top-rated providers as fallback"
          });
          navigate('/recommendations');
        }
      }
    };

    processRequest();
  }, [currentAiRequest, workers]);

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-white items-center justify-center p-8 overflow-hidden relative font-sans">
      {/* Background Ambience */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/20 blur-[120px] rounded-full -mr-64 -mt-64 opacity-50"></div>
      <div className="absolute bottom-0 left-0 w-[400px] h-[400px] bg-blue-500/10 blur-[100px] rounded-full -ml-48 -mb-48 opacity-30"></div>
      
      <div className="relative mb-12">
        <motion.div 
          animate={{ 
            scale: [1, 1.05, 1],
            rotate: [0, 90, 180, 270, 360],
          }}
          transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
          className="w-48 h-48 border-2 border-dashed border-primary/20 rounded-full flex items-center justify-center"
        >
          <div className="w-40 h-40 border border-primary/40 rounded-full flex items-center justify-center animate-pulse">
            <div className="w-32 h-32 bg-primary/10 rounded-full flex items-center justify-center">
               <Bot className="w-16 h-16 text-primary" />
            </div>
          </div>
        </motion.div>
        
        {/* Floating Particles */}
        {Array(6).fill(0).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              y: [0, -100, 0],
              x: [0, (i % 2 === 0 ? 50 : -50), 0],
              opacity: [0, 1, 0]
            }}
            transition={{ 
              repeat: Infinity, 
              duration: 3 + i, 
              delay: i * 0.5,
              ease: "easeInOut"
            }}
            className="absolute top-1/2 left-1/2 w-1.5 h-1.5 bg-primary rounded-full blur-[1px]"
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, scale: 0.9, filter: 'blur(10px)' }}
          animate={{ opacity: 1, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, scale: 1.1, filter: 'blur(10px)' }}
          className="space-y-6 max-w-sm mx-auto z-10 text-center"
        >
          <div className={`px-6 py-3 ${steps[step].bg} ${steps[step].border} rounded-full border inline-flex items-center gap-3 mb-2 shadow-2xl`}>
             {React.createElement(steps[step].icon, { className: `w-5 h-5 ${steps[step].color}` })}
             <h2 className={`text-[10px] font-black uppercase tracking-[0.2em] ${steps[step].color}`}>{steps[step].title}</h2>
          </div>
          
          <h2 className="text-3xl font-black leading-tight tracking-tight px-4">
             {steps[step].description}
          </h2>
          
          <div className="flex items-center justify-center gap-3 text-slate-500 text-[10px] font-black uppercase tracking-widest bg-slate-900/50 px-5 py-2 rounded-xl border border-white/5">
             <Loader2 className="w-3 h-3 animate-spin text-primary" />
             <span>Orchestration Logic v2.4</span>
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="mt-16 w-full max-w-[280px] space-y-4">
        {steps.map((s, i) => (
          <div key={i} className="flex items-center gap-4 text-left relative">
            <div className={`w-10 h-10 rounded-2xl flex items-center justify-center transition-all duration-500 border ${i < step ? 'bg-emerald-500 border-emerald-400 text-slate-950' : i === step ? 'bg-primary border-primary/50 text-white shadow-[0_0_20px_rgba(var(--primary),0.3)]' : 'bg-slate-900 border-slate-800 text-slate-600'}`}>
              {i < step ? <CheckCircle2 className="w-6 h-6" /> : <span className="text-xs font-black">{i + 1}</span>}
            </div>
            <div className="flex flex-col">
              <span className={`text-[10px] font-black uppercase tracking-widest ${i === step ? 'text-primary' : i < step ? 'text-emerald-500' : 'text-slate-600'}`}>{s.title}</span>
              {i === step && <span className="text-[10px] text-slate-400 animate-pulse font-medium">Executing agent core...</span>}
            </div>
            {i < steps.length - 1 && (
               <div className={`absolute left-5 top-10 w-[1px] h-4 ${i < step ? 'bg-emerald-500' : 'bg-slate-800'}`}></div>
            )}
          </div>
        ))}
      </div>

      <div className="absolute bottom-10 left-0 w-full px-8 text-center">
         <p className="text-[9px] text-slate-600 font-bold uppercase tracking-[0.3em]">Antigravity-7 Control Subsystem</p>
      </div>
    </div>
  );
}
