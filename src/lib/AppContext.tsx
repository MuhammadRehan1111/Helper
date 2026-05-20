import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Worker, Job, AgentLog, AiRequest, ToastMessage, Address } from './types';
import { mockWorkers, mockJobs, mockUsers } from './mockData';

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
}

const AppContext = createContext<AppContextType | undefined>(undefined);

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
      return saved ? JSON.parse(saved) : mockWorkers;
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

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const savedUser = localStorage.getItem('helper_user');
      const savedJobs = localStorage.getItem('helper_jobs');
      const savedWorkers = localStorage.getItem('helper_workers');
      const savedUsers = localStorage.getItem('helper_users');
      if (savedUser) setCurrentUser(JSON.parse(savedUser));
      if (savedJobs) setJobs(JSON.parse(savedJobs));
      if (savedWorkers) setWorkers(JSON.parse(savedWorkers));
      if (savedUsers) setUsers(JSON.parse(savedUsers));
    } catch (e) {
      console.error('Failed to load saved data:', e);
    }
  }, []);

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

  const addAgentLog = (log: AgentLog) => setAgentLogs(prev => [log, ...prev]);
  const clearAgentLogs = () => setAgentLogs([]);

  const addJob = (job) => {
    const newJob = { ...job, createdAt: new Date().toISOString() };
    setJobs(prev => [newJob, ...prev]);
    
    // Notification for worker
    const worker = workers.find(w => w.id === job.workerId);
    if (worker) {
      showToast(`New job assigned to worker: ${worker.name}`, 'success');
      // Mock notification for user as well
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
        // If worker cancels, decrease rating
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
        return { ...j, status: 'cancelled', cancellationReason: reason, cancelledBy };
      }
      return j;
    }));
  };

  const showToast = (message: string, type: ToastMessage['type'] = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 3000);
  };

  return (
    <AppContext.Provider value={{ 
      currentUser, setCurrentUser, 
      workers, users, jobs, 
      agentLogs, currentAiRequest, toasts,
      setCurrentAiRequest, addAgentLog, clearAgentLogs,
      addJob, updateJobStatus, addWorker, updateWorkerAvailability, updateWorkerProfile, addUser,
      addAddress, removeAddress, cancelJob,
      showToast
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
