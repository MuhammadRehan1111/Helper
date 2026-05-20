import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { ArrowLeft, Cpu, Terminal, History, Activity, MessageSquare } from 'lucide-react';
import { useAppContext } from '@/lib/AppContext';

export default function AgentTrace() {
  const navigate = useNavigate();
  const { agentLogs } = useAppContext();

  return (
    <div className="flex flex-col min-h-screen bg-slate-950 text-slate-300 font-mono text-xs overflow-hidden relative max-w-md mx-auto shadow-2xl">
      {/* HUD Scanlines */}
      <div className="absolute inset-0 pointer-events-none z-50 opacity-[0.03]" style={{ backgroundImage: 'linear-gradient(rgba(18, 16, 16, 0) 50%, rgba(0, 0, 0, 0.25) 50%), linear-gradient(90deg, rgba(255, 0, 0, 0.06), rgba(0, 255, 0, 0.02), rgba(0, 0, 255, 0.06))', backgroundSize: '100% 2px, 3px 100%' }}></div>
      
      <header className="px-6 py-6 border-b border-white/10 bg-slate-900/50 backdrop-blur-xl flex items-center justify-between shrink-0">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-2.5 bg-slate-800 hover:bg-slate-700 rounded-xl transition-colors text-white group">
            <ArrowLeft className="w-5 h-5 group-active:scale-90 transition-transform" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-white font-black text-sm uppercase tracking-[0.2em]">Agent Controller</h1>
            <span className="text-[9px] text-primary font-black uppercase tracking-widest mt-1 animate-pulse">Live Orchestration Trace</span>
          </div>
        </div>
        <div className="flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg">
           <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping"></div>
           <span className="text-[9px] font-black text-emerald-500 uppercase tracking-widest">Active</span>
        </div>
      </header>

      <main className="flex-1 overflow-y-auto p-6 space-y-6 scrollbar-hide pb-20 no-scrollbar">
        {agentLogs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-4 opacity-60 py-20">
            <Terminal className="w-12 h-12 text-slate-500" />
            <p className="text-slate-500 text-xs uppercase tracking-widest font-bold text-center whitespace-pre-line">
              No agent activity yet.{"\n"}Run an AI search from home screen to see live trace.
            </p>
            <button
              onClick={() => navigate('/')}
              className="mt-4 px-6 py-2 bg-primary/20 text-primary rounded-xl text-xs font-bold uppercase tracking-widest border border-primary/30 cursor-pointer"
            >
              Go to Home
            </button>
          </div>
        ) : (
          agentLogs.map((log, idx) => (
            <motion.div 
              initial={{ opacity: 0, x: -20, filter: 'blur(10px)' }}
              animate={{ opacity: 1, x: 0, filter: 'blur(0px)' }}
              transition={{ delay: idx * 0.05 }}
              key={log.id} 
              className="relative pl-8 pt-2"
            >
              {/* Timeline Connector */}
              <div className="absolute left-[11px] top-0 bottom-0 w-[1px] bg-white/10"></div>
              <div className={`absolute left-0 top-3 w-6 h-6 rounded-lg flex items-center justify-center border ${
                log.type === 'success' ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-400' :
                log.type === 'warning' ? 'bg-amber-500/20 border-amber-500/50 text-amber-400' :
                log.type === 'error' ? 'bg-rose-500/20 border-rose-500/50 text-rose-400' :
                'bg-blue-500/20 border-blue-500/50 text-blue-400'
              } z-10 shadow-2xl`}>
                <Cpu className="w-3 h-3" />
              </div>

              <div className="bg-slate-900/50 border border-white/5 rounded-2xl p-5 shadow-inner backdrop-blur-sm group hover:border-primary/30 transition-colors">
                <div className="flex items-center justify-between mb-3">
                   <div className="flex items-center gap-3">
                     <span className="text-[10px] font-black uppercase tracking-widest text-white px-2 py-0.5 bg-white/5 rounded">
                       [{log.agentName}]
                     </span>
                     <span className="text-[9px] text-slate-500 font-bold">{log.timestamp}</span>
                   </div>
                   <Activity className="w-3 h-3 text-slate-700" />
                </div>
                
                <h4 className="text-white font-black uppercase tracking-tight mb-2 flex items-center gap-2">
                   <div className="w-1 h-1 bg-primary rounded-full"></div>
                   {log.action}
                </h4>
                
                <div className="bg-black/40 p-4 rounded-xl border border-white/5 font-mono text-[10px] leading-relaxed text-slate-400 group-hover:text-slate-300 transition-colors">
                   <span className="text-primary mr-1">&gt;</span> {log.reasoning}
                </div>
                
                <div className="mt-4 flex items-center gap-3">
                   <div className="flex -space-x-1">
                      <div className="w-4 h-4 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center overflow-hidden">
                         <div className="w-1 h-1 bg-emerald-500 rounded-full animate-pulse"></div>
                      </div>
                      <div className="w-4 h-4 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center">
                         <div className="w-1 h-1 bg-blue-500 rounded-full"></div>
                      </div>
                   </div>
                   <span className="text-[8px] text-slate-500 font-bold uppercase tracking-widest">Process Authenticated</span>
                </div>
              </div>
            </motion.div>
          ))
        )}
      </main>

      <footer className="p-6 border-t border-white/10 bg-slate-900 shrink-0 z-10 pb-safe">
         <div className="flex items-center justify-between px-4 py-3 bg-black/40 rounded-xl border border-white/5">
            <div className="flex flex-col">
               <span className="text-[8px] text-slate-500 font-black uppercase tracking-[0.2em] mb-1">Controller Status</span>
               <div className="flex items-center gap-2">
                  <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></div>
                  <span className="text-[10px] font-black text-white uppercase tracking-widest">Autonomous Sync: OK</span>
               </div>
            </div>
            <div className="flex items-center gap-2">
               <div className="h-6 w-[1px] bg-white/10 mx-2"></div>
               <div className="text-right">
                  <span className="text-[8px] text-slate-500 font-black uppercase tracking-widest block">System Load</span>
                  <span className="text-[10px] text-primary font-black uppercase tracking-widest">0.42ms</span>
               </div>
            </div>
         </div>
      </footer>
    </div>
  );
}
