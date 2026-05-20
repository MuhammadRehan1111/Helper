import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/AppContext';
import { DollarSign, Star, Briefcase, Bell } from 'lucide-react';
import { Switch } from '@/components/ui/switch';

export default function WorkerDashboard() {
  const navigate = useNavigate();
  const { currentUser, workers, jobs, updateWorkerAvailability } = useAppContext();
  const workerInfo = workers.find(w => w.id === currentUser?.id);
  
  const [gallery, setGallery] = useState([
    'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=200&q=80&sig=1',
    'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=200&q=80&sig=2',
    'https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=200&q=80&sig=3'
  ]);
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  if (!workerInfo) return <div>Worker info not found</div>;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Simulation of upload: use a placeholder with some randomness
      const newImageUrl = `https://images.unsplash.com/photo-1581141849291-1125c7b692b5?w=200&q=80&sig=${Math.random()}`;
      setGallery(prev => [newImageUrl, ...prev]);
      alert("Work photo uploaded successfully! It is now visible to customers.");
    }
  };

  const myJobs = jobs.filter(j => j.workerId === currentUser?.id);
  const pendingRequests = myJobs.filter(j => j.status === 'pending').length;
  const completedJobs = myJobs.filter(j => j.status === 'completed').length;
  const earnings = myJobs.filter(j => j.status === 'completed').reduce((acc, job) => acc + (job.price || 0), 0);

  return (
    <div className="flex flex-col min-h-full bg-background pb-8 pt-4">
      <div className="px-4 mb-6 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm">Welcome back, {currentUser?.name}</p>
        </div>
        <div className="w-10 h-10 bg-secondary rounded-full flex items-center justify-center relative">
          <Bell className="w-5 h-5 text-foreground" />
          {pendingRequests > 0 && (
            <span className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-background"></span>
          )}
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-primary text-primary-foreground p-6 rounded-2xl shadow-lg relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-20">
            <DollarSign className="w-24 h-24" />
          </div>
          <div className="relative z-10">
            <p className="text-primary-foreground/80 font-medium mb-1">Total Earnings</p>
            <h2 className="text-4xl font-bold mb-4">Rs. {earnings}</h2>
            <div className="flex gap-4 mb-4">
              <div>
                <p className="text-xs text-primary-foreground/70">Completed</p>
                <p className="font-semibold text-lg">{completedJobs} Jobs</p>
              </div>
              <div className="w-px bg-primary-foreground/20"></div>
              <div>
                <p className="text-xs text-primary-foreground/70">Rating</p>
                <div className="flex items-center gap-1 font-semibold text-lg">
                  <Star className="w-4 h-4 fill-current" /> {workerInfo.rating}
                </div>
              </div>
            </div>
            {earnings > 500 && (
              <button className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-bold shadow-sm" onClick={() => alert('Withdrawal request submitted! Minimum PKR 500 requirement met.')}>Withdraw Funds (JazzCash/Bank)</button>
            )}
            {earnings <= 500 && (
              <div className="text-xs text-primary-foreground/80 bg-primary-foreground/10 inline-block px-3 py-1.5 rounded-lg">Min withdrawal: PKR 500</div>
            )}
          </div>
        </div>
      </div>

      <div className="px-4 mb-4">
        <div className="flex items-center justify-between bg-card p-4 rounded-xl border border-border/50 shadow-sm">
          <div>
            <h3 className="font-bold">Accepting Jobs</h3>
            <p className="text-xs text-muted-foreground">Turn off to stop receiving new jobs</p>
          </div>
          <Switch checked={workerInfo.available} onCheckedChange={(val) => {
            if (currentUser?.id) updateWorkerAvailability(currentUser.id, val);
          }} />
        </div>
      </div>
      
      <div className="px-4 mb-6">
        <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm flex items-center justify-between cursor-pointer" onClick={() => navigate('/schedule')}>
          <div>
            <h3 className="font-bold">Availability Calendar</h3>
            <p className="text-xs text-muted-foreground">Manage your working hours and off days</p>
          </div>
          <button className="bg-secondary text-secondary-foreground font-semibold px-3 py-1.5 rounded-lg text-sm">Edit</button>
        </div>
      </div>

      <div className="px-4 mb-6">
        <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold">Work Gallery</h3>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*"
              onChange={handleFileUpload}
            />
            <button 
              className="text-xs font-black text-primary uppercase tracking-widest bg-primary/10 px-3 py-1.5 rounded-lg"
              onClick={() => fileInputRef.current?.click()}
            >
              Upload New
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2">
            {gallery.map((img, i) => (
              <div key={i} className="aspect-square bg-secondary rounded-xl overflow-hidden relative group">
                <img 
                  src={img} 
                  alt={`Work ${i}`} 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button 
                    onClick={() => setGallery(prev => prev.filter((_, idx) => idx !== i))}
                    className="text-[8px] text-white font-bold uppercase tracking-widest"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
          <p className="text-[10px] text-muted-foreground mt-3 font-medium">Showcase your best projects to attract more clients.</p>
        </div>
      </div>

      <div className="px-4">
        <h2 className="text-lg font-bold mb-4">Quick Stats</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center mb-2">
              <Briefcase className="w-5 h-5" />
            </div>
            <p className="font-bold text-xl">{pendingRequests}</p>
            <p className="text-xs text-muted-foreground">Pending Requests</p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm">
            <div className="w-10 h-10 rounded-full bg-purple-100 text-purple-600 flex items-center justify-center mb-2">
              <Star className="w-5 h-5" />
            </div>
            <p className="font-bold text-xl">{workerInfo.reviewsCount}</p>
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </div>
          <div className="bg-card p-4 rounded-xl border border-border/50 shadow-sm col-span-2">
            <h3 className="font-bold mb-3">Earnings Breakdown</h3>
            <div className="space-y-2 text-sm">
               <div className="flex justify-between">
                 <span className="text-muted-foreground">Total Revenue</span>
                 <span className="font-medium">Rs. {earnings}</span>
               </div>
               <div className="flex justify-between text-red-500">
                 <span>Platform Fee (10%)</span>
                 <span>- Rs. {Math.floor(earnings * 0.1)}</span>
               </div>
               <div className="flex justify-between font-bold border-t pt-2 mt-2">
                 <span>Net Income</span>
                 <span>Rs. {earnings - Math.floor(earnings * 0.1)}</span>
               </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
