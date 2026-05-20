import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Worker, Job, AgentLog, AiRequest, ToastMessage, Address, CartItem } from './types';
import { mockWorkers, mockJobs, mockUsers } from './mockData';
import { Language, getTranslation } from './translations';

export interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  workers: Worker[];
  users: User[];
  jobs: Job[];
  agentLogs: AgentLog[];
  currentAiRequest: AiRequest | null;
  toasts: ToastMessage[];
  setCurrentAiRequest: (req: AiRequest | null) => void;
  addAgentLog: (log: AgentLog) => void;
  clearAgentLogs: () => void;
  addJob: (job: Job) => void;
  updateJobStatus: (id: string, status: Job['status']) => void;
  addWorker: (worker: Worker) => void;
  updateWorkerAvailability: (id: string, available: boolean) => void;
  updateWorkerProfile: (id: string, profile: Partial<Worker>) => void;
  addUser: (user: User) => void;
  addAddress: (address: Address) => void;
  removeAddress: (id: string) => void;
  cancelJob: (jobId: string, reason: string, cancelledBy: 'user' | 'worker') => void;
  showToast: (message: string, type?: ToastMessage['type']) => void;
  // Cart
  cart: CartItem[];
  addToCart: (item: CartItem) => void;
  removeFromCart: (workerId: string) => void;
  clearCart: () => void;
  // Translation
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  // Workers updater for geolocation
  setWorkers: React.Dispatch<React.SetStateAction<Worker[]>>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Notification sound helper
function playNotificationSound() {
  try {
    const ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.frequency.value = 880;
    osc.type = 'sine';
    gain.gain.setValueAtTime(0.12, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
    osc.start(ctx.currentTime);
    osc.stop(ctx.currentTime + 0.3);
  } catch {
    // Audio not available
  }
}

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem('helper_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });
  const [workers, setWorkers] = useState<Worker[]>(() => {
    try {
      const saved = localStorage.getItem('helper_workers');
      if (saved) {
        const parsed = JSON.parse(saved);
        // If old data has fewer than 100 workers, reset to new mock data
        return parsed.length >= 100 ? parsed : mockWorkers;
      }
      return mockWorkers;
    } catch {
      return mockWorkers;
    }
  });
  const [users, setUsers] = useState<User[]>(() => {
    try {
      const saved = localStorage.getItem('helper_users');
      return saved ? JSON.parse(saved) : mockUsers;
    } catch {
      return mockUsers;
    }
  });
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem('helper_jobs');
      return saved ? JSON.parse(saved) : mockJobs;
    } catch {
      return mockJobs;
    }
  });
  const [agentLogs, setAgentLogs] = useState<AgentLog[]>([]);
  const [currentAiRequest, setCurrentAiRequest] = useState<AiRequest | null>(null);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Cart state
  const [cart, setCart] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem('helper_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Language state
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('app_language_code');
    return (saved === 'ur' ? 'ur' : 'en') as Language;
  });

  const setLanguage = useCallback((lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('app_language_code', lang);
  }, []);

  const t = useCallback((key: string) => getTranslation(language, key), [language]);

  // Save to localStorage on change
  useEffect(() => {
    if (currentUser) localStorage.setItem('helper_user', JSON.stringify(currentUser));
    else localStorage.removeItem('helper_user');
  }, [currentUser]);

  useEffect(() => {
    localStorage.setItem('helper_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    localStorage.setItem('helper_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    localStorage.setItem('helper_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('helper_cart', JSON.stringify(cart));
  }, [cart]);

  const addAgentLog = (log: AgentLog) => setAgentLogs(prev => [log, ...prev]);
  const clearAgentLogs = () => setAgentLogs([]);

  const addJob = (job: any) => {
    const newJob = { ...job, createdAt: new Date().toISOString() };
    setJobs(prev => [newJob, ...prev]);
    
    // Notification for worker
    const worker = workers.find(w => w.id === job.workerId);
    if (worker) {
      showToast(`New job assigned to worker: ${worker.name}`, 'success');
      showToast(`Your booking for ${job.title} is confirmed!`, 'success');
    }
  };

  const updateJobStatus = (id: string, status: Job['status']) => 
    setJobs(prev => prev.map(j => j.id === id ? { ...j, status } : j));
  
  const addWorker = (worker: Worker) => setWorkers(prev => [...prev, worker]);
  const updateWorkerAvailability = (id: string, available: boolean) => 
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, available } : w));
  const updateWorkerProfile = (id: string, profile: Partial<Worker>) =>
    setWorkers(prev => prev.map(w => w.id === id ? { ...w, ...profile } : w));
  const addUser = (user: User) => setUsers(prev => [...prev, user]);

  const addAddress = (address: Address) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      savedAddresses: [...(currentUser.savedAddresses || []), address]
    };
    setCurrentUser(updatedUser);
  };

  const removeAddress = (id: string) => {
    if (!currentUser) return;
    const updatedUser = {
      ...currentUser,
      savedAddresses: (currentUser.savedAddresses || []).filter(a => a.id !== id)
    };
    setCurrentUser(updatedUser);
  };

  const cancelJob = (jobId: string, reason: string, cancelledBy: 'user' | 'worker') => {
    setJobs(prev => prev.map(j => {
      if (j.id === jobId) {
        if (cancelledBy === 'worker') {
          setWorkers(ws => ws.map(w => {
            if (w.id === j.workerId) {
              const newRating = Math.max(1, w.rating - 0.2);
              showToast(`${w.name}'s ranking decreased due to cancellation.`, 'error');
              return { ...w, rating: parseFloat(newRating.toFixed(1)) };
            }
            return w;
          }));
        } else {
          showToast(`Job cancelled by user: ${reason}`, 'info');
        }
        return { ...j, status: 'cancelled' as const, cancellationReason: reason, cancelledBy };
      }
      return j;
    }));
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    playNotificationSound();
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  // Cart helpers
  const addToCart = (item: CartItem) => {
    setCart(prev => {
      const exists = prev.find(c => c.workerId === item.workerId);
      if (exists) return prev;
      return [...prev, item];
    });
    showToast('Added to cart!', 'success');
  };

  const removeFromCart = (workerId: string) => {
    setCart(prev => prev.filter(c => c.workerId !== workerId));
  };

  const clearCart = () => setCart([]);

  return (
    <AppContext.Provider value={{ 
      currentUser, setCurrentUser, 
      workers, users, jobs, 
      agentLogs, currentAiRequest, toasts,
      setCurrentAiRequest, addAgentLog, clearAgentLogs,
      addJob, updateJobStatus, addWorker, updateWorkerAvailability, updateWorkerProfile, addUser,
      addAddress, removeAddress, cancelJob,
      showToast,
      cart, addToCart, removeFromCart, clearCart,
      language, setLanguage, t,
      setWorkers,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useAppContext() {
  const context = useContext(AppContext);
  if (!context) throw new Error('useAppContext must be used within AppProvider');
  return context;
}
