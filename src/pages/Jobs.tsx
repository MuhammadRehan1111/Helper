import React, { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Clock, Star, X, Navigation } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Link } from 'react-router-dom';
import { Job } from '@/lib/types';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';

export default function Jobs() {
  const { jobs, workers, users, currentUser, updateJobStatus, cancelJob, showToast } = useAppContext();
  const [reviewJobId, setReviewJobId] = useState<string | null>(null);
  const [cancelJobId, setCancelJobId] = useState<string | null>(null);
  const [cancelReason, setCancelReason] = useState('');
  const [rating, setRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const myJobs = jobs.filter(j => currentUser?.role === 'worker' ? j.workerId === currentUser.id : j.userId === currentUser?.id);
  const activeJobs = myJobs.filter(j => ['pending', 'accepted', 'in_progress', 'on_the_way', 'provider_assigned', 'confirmed'].includes(j.status));
  const pastJobs = myJobs.filter(j => ['completed', 'disputed', 'rejected', 'reviewed', 'cancelled'].includes(j.status));

  const handleReviewSubmit = () => {
    if (!reviewJobId) return;
    updateJobStatus(reviewJobId, 'reviewed' as any);
    setReviewJobId(null);
    setRating(5);
    setReviewText('');
    showToast("Review submitted successfully! Thank you.", "success");
  };

  const handleCancelSubmit = () => {
    if (!cancelJobId || !cancelReason.trim()) {
      showToast("Please provide a reason for cancellation", "error");
      return;
    }
    cancelJob(cancelJobId, cancelReason, currentUser?.role as any);
    setCancelJobId(null);
    setCancelReason('');
  };

  const JobCard: React.FC<{ job: Job }> = ({ job }) => {
    const worker = workers.find(w => w.id === job.workerId);
    if (!worker) return null;

    const statusColors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      accepted: 'bg-blue-100 text-blue-800',
      in_progress: 'bg-purple-100 text-purple-800',
      completed: 'bg-green-100 text-green-800',
      rejected: 'bg-red-100 text-red-800',
      cancelled: 'bg-slate-200 text-slate-600',
      on_the_way: 'bg-orange-100 text-orange-800',
      provider_assigned: 'bg-blue-100 text-blue-800',
      confirmed: 'bg-blue-100 text-blue-800',
    };

    const isWorker = currentUser?.role === 'worker';
    const client = !isWorker ? null : users.find(u => u.id === job.userId);

    const handleCancel = () => {
      setCancelJobId(job.id);
      setCancelReason('');
    };

    return (
      <div className="bg-card rounded-2xl p-4 shadow-sm border border-border/50 mb-3 relative overflow-hidden">
        {job.status === 'cancelled' && (
          <div className="absolute inset-0 bg-red-500/5 backdrop-blur-[1px] flex items-center justify-center -rotate-12 pointer-events-none z-10">
            <span className="text-red-500 font-black text-4xl opacity-50 uppercase tracking-widest border-4 border-red-500 px-4 py-1">CANCELLED</span>
          </div>
        )}
        <div className="flex justify-between items-start mb-3">
          <div>
            <h3 className="font-bold">{job.title}</h3>
            <div className="text-xs text-muted-foreground mt-1 flex items-center gap-3">
              <span className="flex items-center gap-1">
                <Clock className="w-3.5 h-3.5" />
                {job.date}
              </span>
              {job.price && (
                <span className="font-extrabold text-primary bg-primary/10 px-2 py-0.5 rounded text-[10px]">
                  Rs. {job.price}
                </span>
              )}
            </div>
          </div>
          <span className={`text-[10px] font-bold px-2 py-1 uppercase tracking-wider rounded-md ${statusColors[job.status] || 'bg-secondary'}`}>
            {job.status.replace('_', ' ')}
          </span>
        </div>
        
        {!isWorker && (
          <div className="flex items-center gap-3 bg-secondary/30 p-2 rounded-xl">
             <Avatar className="h-8 w-8">
               <AvatarImage src={worker.avatar} />
               <AvatarFallback>{worker.name[0]}</AvatarFallback>
             </Avatar>
             <div className="flex-1">
               <div className="text-sm font-medium">{worker.name}</div>
               <div className="text-xs text-muted-foreground">{worker.category}</div>
             </div>
          </div>
        )}

        {isWorker && client && (
           <div className="flex items-center gap-3 bg-blue-50 p-2 rounded-xl border border-blue-100">
             <Avatar className="h-8 w-8">
               <AvatarImage src={client.avatar} />
               <AvatarFallback>{client.name[0]}</AvatarFallback>
             </Avatar>
             <div className="flex-1">
               <div className="text-xs text-blue-400 font-bold uppercase">Customer</div>
               <div className="text-sm font-bold">{client.name}</div>
               <div className="text-[10px] text-blue-600 flex items-center gap-1">
                 <Navigation className="w-2.5 h-2.5" /> {job.address}
               </div>
             </div>
           </div>
        )}

        <div className="mt-4 flex gap-2">
           {['accepted', 'provider_assigned', 'confirmed'].includes(job.status) && isWorker && (
              <div className="flex flex-col gap-2 flex-1">
                <Button size="sm" className="w-full rounded-xl" onClick={() => updateJobStatus(job.id, 'in_progress')}>
                  Mark as Started
                </Button>
                <Button variant="secondary" size="sm" className="w-full rounded-xl flex items-center justify-center gap-2" onClick={() => {
                  updateJobStatus(job.id, 'on_the_way' as any);
                  showToast("Journey started! Client is notified.", 'info');
                }}>
                   <Navigation className="w-4 h-4" /> Start Journey
                </Button>
              </div>
           )}
           {job.status === 'in_progress' && isWorker && (
              <Button size="sm" className="flex-1 rounded-xl bg-green-600 hover:bg-green-700" onClick={() => updateJobStatus(job.id, 'completed')}>
                Mark as Completed
              </Button>
           )}
           {!isWorker && job.status === 'in_progress' && (
              <div className="flex-1 text-center py-2 text-xs font-semibold text-purple-600 bg-purple-50 rounded-xl">
                Worker is working
              </div>
           )}
           {!isWorker && job.status === 'completed' && (
             <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => setReviewJobId(job.id)}>
               Confirm & Pay (Review)
             </Button>
           )}
           {!isWorker && job.status === 'reviewed' && (
             <div className="flex-1 flex gap-2">
               <div className="flex-1 text-center py-2 text-xs font-semibold text-green-600 bg-green-50 rounded-xl">
                 Reviewed
               </div>
               <Button variant="outline" size="sm" className="flex-1 rounded-xl" onClick={() => alert("Re-booking worker...")}>
                 Re-book
               </Button>
             </div>
           )}
           {['pending', 'accepted', 'provider_assigned', 'confirmed'].includes(job.status) && (
              <Button size="sm" variant="destructive" className="flex-1 rounded-xl bg-red-100 hover:bg-red-200 text-red-700 border-none" onClick={handleCancel}>
                Cancel {['pending'].includes(job.status) ? 'Request' : 'Booking'}
              </Button>
           )}
           <Link to={`/chat/${isWorker ? job.userId : worker.id}`} className={(isWorker && ['accepted', 'in_progress', 'provider_assigned', 'confirmed'].includes(job.status)) || ['accepted', 'provider_assigned', 'confirmed'].includes(job.status) ? "w-auto" : "flex-1"}>
             <Button variant="secondary" size="sm" className="w-full rounded-xl">Message</Button>
           </Link>
        </div>
        
        {!isWorker && (['in_progress', 'on_the_way', 'provider_assigned', 'confirmed', 'accepted'].includes(job.status)) && (
           <div className="mt-3 flex gap-2">
             <Link to={`/tracking/${worker.id}`} className="flex-1">
                <Button variant="outline" size="sm" className="w-full rounded-xl flex items-center justify-center gap-2">
                  <Navigation className="w-4 h-4" /> Track Trip
                </Button>
             </Link>
             <Button variant="destructive" size="sm" className="flex-1 rounded-xl flex items-center justify-center gap-2" onClick={() => alert("SOS Alert sent to Emergency Contacts and Platform Admins with your live location!")}>
               <span>SOS Alert</span>
             </Button>
           </div>
        )}
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-full bg-background pb-8 pt-4">
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-bold">My Jobs</h1>
      </div>
      
      <div className="px-4">
        <Tabs defaultValue="active" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-4">
            <TabsTrigger value="active">Active ({activeJobs.length})</TabsTrigger>
            <TabsTrigger value="past">Past ({pastJobs.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="active" className="space-y-4">
            {activeJobs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No active jobs.</div>
            ) : (
              activeJobs.map(job => <JobCard key={job.id} job={job} />)
            )}
          </TabsContent>
          
          <TabsContent value="past" className="space-y-4">
            {pastJobs.length === 0 ? (
              <div className="text-center py-10 text-muted-foreground">No past jobs.</div>
            ) : (
              pastJobs.map(job => <JobCard key={job.id} job={job} />)
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Review Modal */}
      {reviewJobId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-xl slide-in relative font-sans">
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setReviewJobId(null)}>
               <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">Leave a Review</h2>
            <p className="text-sm text-muted-foreground mb-6">Payment released successfully! Please share your experience.</p>
            
            <div className="flex justify-center gap-2 mb-6">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setRating(star)}>
                  <Star className={`w-8 h-8 ${star <= rating ? 'fill-amber-500 text-amber-500' : 'text-muted-foreground/30'}`} />
                </button>
              ))}
            </div>

            <div className="space-y-4 mb-6">
              <Textarea 
                 placeholder="Write your review here (optional)..." 
                 value={reviewText}
                 onChange={e => setReviewText(e.target.value)}
                 className="resize-none h-24 rounded-xl border-border/50"
              />
            </div>

            <Button className="w-full h-12 rounded-xl font-bold" onClick={handleReviewSubmit}>
              Submit Review
            </Button>
          </div>
        </div>
      )}

      {/* Cancellation Modal */}
      {cancelJobId && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-xl slide-in relative font-sans">
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setCancelJobId(null)}>
               <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-bold mb-2">Cancel {currentUser?.role === 'worker' ? 'Job' : 'Request'}</h2>
            <p className="text-sm text-muted-foreground mb-4">
              {currentUser?.role === 'worker' 
                ? "Warning: Cancelling jobs will decrease your worker rank and may lead to fines." 
                : "Please tell us why you are cancelling this request."}
            </p>
            
            <div className="space-y-4 mb-6">
              <label className="text-[10px] font-bold uppercase text-muted-foreground tracking-wider">Reason for Cancellation</label>
              <Textarea 
                 placeholder="Enter reason..." 
                 value={cancelReason}
                 onChange={e => setCancelReason(e.target.value)}
                 className="resize-none h-32 rounded-xl border-border/50 focus:ring-primary/20"
              />
              {currentUser?.role === 'worker' && <p className="text-[10px] text-red-500 font-bold bg-red-50 p-2 rounded-lg border border-red-100">PLATFORM POLICY: Ranking -0.2 drop applied for cancellations.</p>}
            </div>

            <Button variant="destructive" className="w-full h-12 rounded-xl font-bold" onClick={handleCancelSubmit}>
              Confirm Cancellation
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}
