import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { User, Worker, Job, AgentLog, AiRequest, ToastMessage, Address, CartItem } from './types';
import { mockWorkers, mockJobs, mockUsers } from './mockData';
import { Language, getTranslation } from './translations';
import { ref, set, onValue, update, push, runTransaction, get } from 'firebase/database';
import { db } from './firebase';

export interface AppContextType {
  currentUser: User | null;
  setCurrentUser: (user: User | null) => void;
  workers: Worker[];
  users: User[];
  jobs: Job[];
  transactions: any[];
  agentLogs: AgentLog[];
  currentAiRequest: AiRequest | null;
  toasts: ToastMessage[];
  setCurrentAiRequest: (req: AiRequest | null) => void;
  addAgentLog: (log: AgentLog) => void;
  clearAgentLogs: () => void;
  addJob: (job: Job) => void;
  updateJobStatus: (id: string, status: Job['status']) => void;
  acceptJob: (jobId: string, workerId: string) => Promise<{ success: boolean; message: string }>;
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

  const [workers, setWorkers] = useState<Worker[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [jobs, setJobs] = useState<Job[]>([]);
  const [transactions, setTransactions] = useState<any[]>([]);

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

  useEffect(() => {
    document.documentElement.dir = language === 'ur' ? 'rtl' : 'ltr';
  }, [language]);

  const t = useCallback((key: string) => getTranslation(language, key), [language]);

  // Sync state with LocalStorage for quick load / offline fallback
  useEffect(() => {
    if (currentUser) localStorage.setItem('helper_user', JSON.stringify(currentUser));
    else localStorage.removeItem('helper_user');
  }, [currentUser]);

  useEffect(() => {
    if (jobs.length > 0) localStorage.setItem('helper_jobs', JSON.stringify(jobs));
  }, [jobs]);

  useEffect(() => {
    if (workers.length > 0) localStorage.setItem('helper_workers', JSON.stringify(workers));
  }, [workers]);

  useEffect(() => {
    if (users.length > 0) localStorage.setItem('helper_users', JSON.stringify(users));
  }, [users]);

  useEffect(() => {
    localStorage.setItem('helper_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    if (transactions.length > 0) localStorage.setItem('helper_transactions', JSON.stringify(transactions));
  }, [transactions]);

  // Load from LocalStorage initially for faster paint
  useEffect(() => {
    try {
      const localWorkers = localStorage.getItem('helper_workers');
      if (localWorkers) setWorkers(JSON.parse(localWorkers));
      const localUsers = localStorage.getItem('helper_users');
      if (localUsers) setUsers(JSON.parse(localUsers));
      const localJobs = localStorage.getItem('helper_jobs');
      if (localJobs) setJobs(JSON.parse(localJobs));
      const localTransactions = localStorage.getItem('helper_transactions');
      if (localTransactions) setTransactions(JSON.parse(localTransactions));
    } catch (e) {
      console.error("Local storage load error", e);
    }
  }, []);

  // Firebase Synchronization and Seeding
  useEffect(() => {
    // 1. Sync Workers
    const workersRef = ref(db, 'workers');
    get(workersRef).then((snapshot) => {
      const needsSeeding = !snapshot.exists() || Object.keys(snapshot.val()).length < 250;
      if (needsSeeding) {
        const initialWorkers: Record<string, Worker> = {};
        mockWorkers.forEach(w => {
          initialWorkers[w.id] = w;
        });
        set(workersRef, initialWorkers);
      }
    });

    const unsubscribeWorkers = onValue(workersRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list = Object.values(val) as Worker[];
        setWorkers(list);
      }
    });

    // 2. Sync Jobs
    const jobsRef = ref(db, 'jobs');
    get(jobsRef).then((snapshot) => {
      if (!snapshot.exists()) {
        const initialJobs: Record<string, Job> = {};
        mockJobs.forEach(j => {
          initialJobs[j.id] = j;
        });
        set(jobsRef, initialJobs);
      }
    });

    const unsubscribeJobs = onValue(jobsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list = Object.values(val) as Job[];
        setJobs(list.sort((a, b) => new Date(b.createdAt || '').getTime() - new Date(a.createdAt || '').getTime()));
      }
    });

    // 3. Sync Users
    const usersRef = ref(db, 'users');
    get(usersRef).then((snapshot) => {
      if (!snapshot.exists()) {
        const initialUsers: Record<string, User> = {};
        mockUsers.forEach(u => {
          initialUsers[u.id] = u;
        });
        set(usersRef, initialUsers);
      }
    });

    const unsubscribeUsers = onValue(usersRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list = Object.values(val) as User[];
        setUsers(list);
      }
    });

    // 4. Sync Transactions
    const transactionsRef = ref(db, 'transactions');
    const unsubscribeTransactions = onValue(transactionsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list = Object.values(val) as any[];
        setTransactions(list.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()));
      }
    });

    return () => {
      unsubscribeWorkers();
      unsubscribeJobs();
      unsubscribeUsers();
      unsubscribeTransactions();
    };
  }, []);

  // Listen for new jobs to notify relevant category workers
  useEffect(() => {
    if (!currentUser || currentUser.role !== 'worker') return;
    
    // Find worker info
    const workerInfo = workers.find(w => w.id === currentUser.id);
    if (!workerInfo) return;

    const jobsRef = ref(db, 'jobs');
    const appStartTime = Date.now();
    const notifiedJobIds = new Set<string>();

    const unsubscribe = onValue(jobsRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val();
        const list = Object.values(val) as Job[];
        
        list.forEach(job => {
          // If job is pending, matches worker's category, not created by current user,
          // created recently, and hasn't been notified:
          if (
            job.status === 'pending' &&
            job.category === workerInfo.category &&
            job.userId !== currentUser.id &&
            new Date(job.createdAt || '').getTime() > appStartTime - 15000 &&
            !notifiedJobIds.has(job.id)
          ) {
            notifiedJobIds.add(job.id);
            // Notify worker!
            showToast(`New ${job.category} job in ${job.address || 'your area'}! Accept now`, 'success');
            // Play notification sound
            playNotificationSound();
          }
        });
      }
    });

    return () => unsubscribe();
  }, [currentUser, workers]);

  // Keep currentUser synced if its details change in users node
  useEffect(() => {
    if (!currentUser?.id) return;
    const userRef = ref(db, `users/${currentUser.id}`);
    const unsubscribe = onValue(userRef, (snapshot) => {
      if (snapshot.exists()) {
        const val = snapshot.val() as User;
        // Compare to prevent loop
        if (JSON.stringify(val) !== JSON.stringify(currentUser)) {
          setCurrentUser(val);
        }
      }
    });
    return () => unsubscribe();
  }, [currentUser?.id]);

  const addAgentLog = (log: AgentLog) => setAgentLogs(prev => [log, ...prev]);
  const clearAgentLogs = () => setAgentLogs([]);

  const addJob = (job: any) => {
    const newJob = { 
      ...job, 
      createdAt: new Date().toISOString() 
    };
    set(ref(db, `jobs/${job.id}`), newJob);
    
    // Notification for specific worker if assigned
    const worker = workers.find(w => w.id === job.workerId);
    if (worker) {
      showToast(`New job assigned to worker: ${worker.name}`, 'success');
      showToast(`Your booking for ${job.title} is confirmed!`, 'success');
    }
  };

  const updateJobStatus = (id: string, status: Job['status']) => {
    update(ref(db, `jobs/${id}`), { status });
    
    // Generate transaction record on completed/reviewed
    if (status === 'completed' || status === 'reviewed') {
      const jobRef = ref(db, `jobs/${id}`);
      get(jobRef).then((snapshot) => {
        if (snapshot.exists()) {
          const job = snapshot.val() as Job;
          
          // Make sure we only create one transaction per job/status stage or check if already created
          const transId = 'TX-' + Math.random().toString(36).substr(2, 6).toUpperCase();
          const newTrans = {
            id: transId,
            jobId: job.id,
            workerId: job.workerId,
            userId: job.userId,
            amount: job.price || 0,
            paymentMethod: 'JazzCash/EasyPaisa/Card',
            timestamp: new Date().toISOString(),
            status: 'Completed',
            title: job.title
          };
          set(ref(db, `transactions/${transId}`), newTrans);

          // Update completedJobs count for the worker
          if (job.workerId) {
            const workerRef = ref(db, `workers/${job.workerId}`);
            get(workerRef).then((wSnap) => {
              if (wSnap.exists()) {
                const worker = wSnap.val();
                const completedJobs = (worker.completedJobs || 0) + 1;
                update(workerRef, { completedJobs });
              }
            });
          }
        }
      });
    }
  };

  // Safe Accept Job (First Accept Wins)
  const acceptJob = async (jobId: string, workerId: string): Promise<{ success: boolean; message: string }> => {
    const jobRef = ref(db, `jobs/${jobId}`);
    try {
      const result = await runTransaction(jobRef, (currentJob) => {
        if (currentJob) {
          if (currentJob.status !== 'pending' && currentJob.status !== 'provider_assigned') {
            // Already taken or cancelled
            return; 
          }
          currentJob.status = 'accepted';
          currentJob.workerId = workerId;
          return currentJob;
        }
        return currentJob;
      });

      if (result.committed) {
        return { success: true, message: 'Job accepted successfully!' };
      } else {
        return { success: false, message: 'Job already taken by another provider.' };
      }
    } catch (error) {
      console.error("Accept job transaction error: ", error);
      return { success: false, message: 'Error accepting job. Please try again.' };
    }
  };
  
  const addWorker = (worker: Worker) => {
    set(ref(db, `workers/${worker.id}`), worker);
  };

  const updateWorkerAvailability = (id: string, available: boolean) => {
    update(ref(db, `workers/${id}`), { available });
  };

  const updateWorkerProfile = (id: string, profile: Partial<Worker>) => {
    update(ref(db, `workers/${id}`), profile);
  };

  const addUser = (user: User) => {
    set(ref(db, `users/${user.id}`), user);
  };

  const addAddress = (address: Address) => {
    if (!currentUser) return;
    const updatedAddresses = [...(currentUser.savedAddresses || []), address];
    update(ref(db, `users/${currentUser.id}`), { savedAddresses: updatedAddresses });
  };

  const removeAddress = (id: string) => {
    if (!currentUser) return;
    const updatedAddresses = (currentUser.savedAddresses || []).filter(a => a.id !== id);
    update(ref(db, `users/${currentUser.id}`), { savedAddresses: updatedAddresses });
  };

  const cancelJob = (jobId: string, reason: string, cancelledBy: 'user' | 'worker') => {
    const jobRef = ref(db, `jobs/${jobId}`);
    get(jobRef).then((snapshot) => {
      if (snapshot.exists()) {
        const job = snapshot.val() as Job;
        update(jobRef, {
          status: 'cancelled',
          cancellationReason: reason,
          cancelledBy
        });

        if (cancelledBy === 'worker' && job.workerId) {
          const workerRef = ref(db, `workers/${job.workerId}`);
          get(workerRef).then((wSnap) => {
            if (wSnap.exists()) {
              const w = wSnap.val();
              const newRating = Math.max(1, w.rating - 0.2);
              showToast(`${w.name}'s ranking decreased due to cancellation.`, 'error');
              update(workerRef, { rating: parseFloat(newRating.toFixed(1)) });
            }
          });
        } else {
          showToast(`Job cancelled by user: ${reason}`, 'info');
        }
      }
    });
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
      workers, users, jobs, transactions,
      agentLogs, currentAiRequest, toasts,
      setCurrentAiRequest, addAgentLog, clearAgentLogs,
      addJob, updateJobStatus, acceptJob, addWorker, updateWorkerAvailability, updateWorkerProfile, addUser,
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
