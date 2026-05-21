import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Clock, MapPin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function WorkerRequests() {
  const { jobs, users, currentUser, workers, acceptJob, showToast, updateJobStatus } = useAppContext();
  const navigate = useNavigate();

  const workerInfo = workers.find(w => w.id === currentUser?.id);
  const requests = jobs.filter(j => 
    j.status === 'pending' && 
    (j.workerId === currentUser?.id || (workerInfo && j.category === workerInfo.category && (j.workerId === 'system-agent' || !j.workerId || j.workerId === '')))
  );

  return (
    <div className="flex flex-col min-h-full bg-background pb-8 pt-4">
      <div className="px-4 mb-6">
        <h1 className="text-2xl font-bold">New Requests</h1>
        <p className="text-muted-foreground text-sm">Review and accept job offers</p>
      </div>

      <div className="px-4 space-y-4">
        {requests.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground bg-card rounded-2xl border border-border/50">
            No pending requests right now.
          </div>
        ) : (
          requests.map(job => {
            const user = users.find(u => u.id === job.userId);
            return (
            <div key={job.id} className="bg-card rounded-2xl p-4 shadow-sm border border-border/50">
              <div className="mb-3">
                <div className="flex justify-between items-start">
                  <h3 className="font-bold text-lg">{job.title}</h3>
                  <span className="font-bold px-3 py-1 bg-primary/10 text-primary rounded-lg">Rs. {job.price || 'Ask Quote'}</span>
                </div>
                <div className="text-sm font-semibold mt-2 text-foreground/80">From: {user?.name || 'Local User'}</div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <Clock className="w-4 h-4" />
                  {job.date}
                </div>
                <div className="text-sm text-muted-foreground flex items-center gap-2 mt-1">
                  <MapPin className="w-4 h-4" />
                  Client Location (2.5 km away)
                </div>
              </div>
              
              <div className="bg-secondary/30 p-3 rounded-xl mb-4 text-sm">
                 <p className="text-muted-foreground line-clamp-2">User requested this work to be done. Status: Pending acceptance.</p>
              </div>

              <div className="flex gap-3">
                <Button variant="outline" className="flex-1 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 border-red-200" onClick={() => updateJobStatus(job.id, 'rejected')}>
                  Decline
                </Button>
                <Button className="flex-1 rounded-xl bg-primary" onClick={async () => {
                  if (currentUser) {
                    const res = await acceptJob(job.id, currentUser.id);
                    if (res.success) {
                      showToast(res.message, 'success');
                      navigate('/jobs');
                    } else {
                      showToast(res.message, 'error');
                    }
                  }
                }}>
                  Accept Job
                </Button>
              </div>
            </div>
            );
          })
        )}
      </div>
    </div>
  );
}
