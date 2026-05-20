import { useState } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Users, Briefcase, DollarSign, Activity, LogOut, CheckCircle, XCircle, Trash2, ChartBar } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from '@/components/ui/button';

export default function AdminDashboard() {
  const { workers, jobs, users, setCurrentUser } = useAppContext();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('overview');

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/login');
  };

  const getWorkerInsights = (workerId: string) => {
    const workerJobs = jobs.filter(j => j.workerId === workerId);
    const completed = workerJobs.filter(j => j.status === 'completed' || j.status === 'reviewed');
    const pending = workerJobs.filter(j => j.status === 'pending');
    const earnings = completed.reduce((sum, j) => sum + (j.price || 0), 0);
    return { completed: completed.length, pending: pending.length, earnings };
  };

  const getUserInsights = (userId: string) => {
    const userJobs = jobs.filter(j => j.userId === userId);
    const spent = userJobs.filter(j => j.status === 'completed' || j.status === 'reviewed').reduce((sum, j) => sum + (j.price || 0), 0);
    return { jobs: userJobs.length, spent };
  };

  return (
    <div className="min-h-screen bg-background text-foreground font-sans relative border-x">
      <header className="bg-card border-b border-border/50 px-6 py-4 flex items-center justify-between sticky top-0 z-10">
        <h1 className="text-xl font-bold text-primary flex items-center gap-2"><Activity /> Helper Admin Portal</h1>
        <div className="flex items-center gap-4">
           <span className="font-medium text-sm">Welcome, Admin</span>
           <button onClick={handleLogout} className="text-destructive p-2 hover:bg-destructive/10 rounded-full transition-colors">
              <LogOut className="w-5 h-5" />
           </button>
        </div>
      </header>
      
      <main className="p-6 max-w-7xl mx-auto">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="flex flex-wrap w-full mb-8 bg-card border border-border/50 p-1 rounded-2xl gap-1">
            <TabsTrigger value="overview" className="flex-1 min-w-[90px] py-2.5 text-xs font-bold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center gap-1.5 transition-all">
              <Activity className="w-3.5 h-3.5" /> Overview
            </TabsTrigger>
            <TabsTrigger value="workers" className="flex-1 min-w-[90px] py-2.5 text-xs font-bold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center gap-1.5 transition-all">
              <Briefcase className="w-3.5 h-3.5" /> Workers
            </TabsTrigger>
            <TabsTrigger value="users" className="flex-1 min-w-[90px] py-2.5 text-xs font-bold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center gap-1.5 transition-all">
              <Users className="w-3.5 h-3.5" /> Users
            </TabsTrigger>
            <TabsTrigger value="jobs" className="flex-1 min-w-[100px] py-2.5 text-xs font-bold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center gap-1.5 transition-all">
              <Briefcase className="w-3.5 h-3.5" /> Jobs/Orders
            </TabsTrigger>
            <TabsTrigger value="analytics" className="flex-1 min-w-[90px] py-2.5 text-xs font-bold rounded-xl data-[state=active]:bg-primary data-[state=active]:text-primary-foreground flex items-center justify-center gap-1.5 transition-all">
              <ChartBar className="w-3.5 h-3.5" /> Analytics
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
               <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-blue-100 text-blue-600 rounded-xl"><Users className="w-6 h-6" /></div>
                 </div>
                 <div className="text-3xl font-bold">{users.length}</div>
                 <p className="text-sm text-muted-foreground">Total Users</p>
               </div>
               
               <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-purple-100 text-purple-600 rounded-xl"><Briefcase className="w-6 h-6" /></div>
                 </div>
                 <div className="text-3xl font-bold">{workers.length}</div>
                 <p className="text-sm text-muted-foreground">Total Workers</p>
               </div>
               
               <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-amber-100 text-amber-600 rounded-xl"><Activity className="w-6 h-6" /></div>
                 </div>
                 <div className="text-3xl font-bold">{jobs.length}</div>
                 <p className="text-sm text-muted-foreground">Total Jobs</p>
               </div>
               
               <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                 <div className="flex justify-between items-start mb-4">
                    <div className="p-3 bg-green-100 text-green-600 rounded-xl"><DollarSign className="w-6 h-6" /></div>
                 </div>
                 <div className="text-3xl font-bold">Rs. {jobs.reduce((acc, j) => acc + ((j.price || 0) * 0.1), 0)}</div>
                 <p className="text-sm text-muted-foreground">Platform Revenue (10%)</p>
               </div>
            </div>

               <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm border-l-4 border-l-emerald-500">
                  <h2 className="text-sm font-black uppercase tracking-widest text-slate-400 mb-4 flex items-center gap-2">
                    <Activity className="w-4 h-4 text-emerald-500" />
                    Agent Orchestration Layer
                  </h2>
                  <div className="flex items-center justify-between">
                     <span className="text-xs font-bold">Status: <span className="text-emerald-500">OPTIMAL</span></span>
                     <span className="text-xs text-muted-foreground">Load: 12%</span>
                  </div>
                  <div className="w-full h-1.5 bg-secondary rounded-full mt-3 overflow-hidden">
                     <div className="w-1/4 h-full bg-emerald-500 animate-pulse"></div>
                  </div>
               </div>

               <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                  <h2 className="text-lg font-bold mb-4">Worker Fleet Control</h2>
                  {workers.filter(w => !w.verified).length === 0 ? (
                    <p className="text-sm text-muted-foreground">All systems clear.</p>
                  ) : (
                    <div className="space-y-4">
                      {workers.filter(w => !w.verified).map(worker => (
                        <div key={worker.id} className="flex items-center gap-3 border-b border-border/50 pb-4 last:border-0 last:pb-0">
                           <div className="relative group cursor-pointer" onClick={() => {
                             const newPic = prompt("Change worker photo URL:", worker.avatar);
                             if (newPic) alert(`Updated ${worker.name}'s photo.`);
                           }}>
                             <img src={worker.avatar} alt="worker" className="w-10 h-10 rounded-xl" />
                             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center rounded-xl transition-opacity">
                                <Trash2 className="w-4 h-4 text-white" />
                             </div>
                           </div>
                           <div className="flex-1 min-w-0">
                             <div className="font-semibold text-sm truncate">{worker.name}</div>
                             <div className="text-xs text-muted-foreground">{worker.category}</div>
                           </div>
                           <div className="flex gap-2">
                              <Button size="sm" className="bg-primary hover:bg-primary/90" onClick={() => alert("Approved identity verification!")}>
                                <CheckCircle className="w-4 h-4 mr-2" /> Verify
                              </Button>
                           </div>
                        </div>
                      ))}
                    </div>
                  )}
               </div>
          </TabsContent>

          <TabsContent value="workers" className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-bold">Workers Management</h2>
                 <Button onClick={() => alert("Add Worker flow...")}>Add New Worker</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl border-b">Worker</th>
                      <th className="px-4 py-3 border-b">Category / verified</th>
                      <th className="px-4 py-3 border-b">Orders (Comp/Pend)</th>
                      <th className="px-4 py-3 border-b">Total Earnings</th>
                      <th className="px-4 py-3 border-b">Rating</th>
                      <th className="px-4 py-3 rounded-tr-xl border-b text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {workers.map(w => {
                      const insights = getWorkerInsights(w.id);
                      return (
                      <tr key={w.id} className="border-b last:border-0 hover:bg-secondary/20">
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          <img src={w.avatar} className="w-8 h-8 rounded-full" /> {w.name}
                        </td>
                        <td className="px-4 py-3">
                          {w.category} <br/>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded ${w.verified ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{w.verified ? 'Verified' : 'Unverified'}</span>
                        </td>
                        <td className="px-4 py-3">
                          <span className="text-green-600 font-bold">{insights.completed}</span> / <span className="text-yellow-600 font-bold">{insights.pending}</span>
                        </td>
                        <td className="px-4 py-3 font-bold">Rs. {insights.earnings}</td>
                        <td className="px-4 py-3">{w.rating} ⭐ ({w.reviewsCount})</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => alert("Worker removed!")}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-bold">Users Management</h2>
                 <Button onClick={() => alert("Add User flow...")}>Add New User</Button>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl border-b">User</th>
                      <th className="px-4 py-3 border-b">Phone</th>
                      <th className="px-4 py-3 border-b">Job History</th>
                      <th className="px-4 py-3 border-b">Total Spent</th>
                      <th className="px-4 py-3 rounded-tr-xl border-b text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => {
                      const insights = getUserInsights(u.id);
                      return (
                      <tr key={u.id} className="border-b last:border-0 hover:bg-secondary/20">
                        <td className="px-4 py-3 font-medium flex items-center gap-2">
                          <img src={u.avatar} className="w-8 h-8 rounded-full" /> {u.name}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs">{u.phone}</td>
                        <td className="px-4 py-3">{insights.jobs} jobs</td>
                        <td className="px-4 py-3 font-bold">Rs. {insights.spent}</td>
                        <td className="px-4 py-3 text-right">
                          <Button variant="ghost" size="icon" className="text-destructive hover:bg-destructive/10" onClick={() => alert("User removed!")}>
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </td>
                      </tr>
                    )})}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
             <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
                <h2 className="text-lg font-bold mb-4">Worker Comparison</h2>
                <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl border-b">Worker</th>
                      <th className="px-4 py-3 border-b">Rating</th>
                      <th className="px-4 py-3 border-b">Performance (Jobs)</th>
                      <th className="px-4 py-3 rounded-tr-xl border-b text-right">Total Earnings</th>
                    </tr>
                  </thead>
                  <tbody>
                    {[...workers].sort((a,b) => b.rating - a.rating).map(w => {
                      const insights = getWorkerInsights(w.id);
                      return (
                      <tr key={w.id} className="border-b last:border-0 hover:bg-secondary/20">
                        <td className="px-4 py-3 font-medium">{w.name}</td>
                        <td className="px-4 py-3 font-bold text-amber-500">{w.rating}</td>
                        <td className="px-4 py-3">{insights.completed} completed</td>
                        <td className="px-4 py-3 text-right font-bold text-green-600">Rs. {insights.earnings}</td>
                      </tr>
                    )})}
                  </tbody>
                </table>
                </div>
             </div>
          </TabsContent>

          <TabsContent value="jobs" className="space-y-6">
            <div className="bg-card p-6 rounded-2xl border border-border/50 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                 <h2 className="text-lg font-bold">Jobs & Orders History</h2>
                 <p className="text-xs text-muted-foreground">Audit log of all booking actions</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="text-xs text-muted-foreground uppercase bg-secondary/30">
                    <tr>
                      <th className="px-4 py-3 rounded-tl-xl border-b">Job ID</th>
                      <th className="px-4 py-3 border-b">Date / Time</th>
                      <th className="px-4 py-3 border-b">Customer ("kis ka")</th>
                      <th className="px-4 py-3 border-b">Worker ("kisna")</th>
                      <th className="px-4 py-3 border-b">Amount ("kitna ma")</th>
                      <th className="px-4 py-3 border-b">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {jobs.map(j => {
                      const userObj = users.find(u => u.id === j.userId);
                      const workerObj = workers.find(w => w.id === j.workerId);
                      return (
                        <tr key={j.id} className="border-b last:border-0 hover:bg-secondary/20">
                          <td className="px-4 py-3 font-mono text-xs">{j.id}</td>
                          <td className="px-4 py-3 text-xs">{j.date}</td>
                          <td className="px-4 py-3 font-medium">{userObj?.name || `User ID: ${j.userId}`}</td>
                          <td className="px-4 py-3 font-medium">{workerObj?.name || `Worker ID: ${j.workerId}`}</td>
                          <td className="px-4 py-3 font-bold text-primary">Rs. {j.price || 0}</td>
                          <td className="px-4 py-3">
                            <span className={`text-[10px] font-bold px-2 py-0.5 rounded uppercase ${
                              j.status === 'completed' || j.status === 'reviewed' ? 'bg-green-100 text-green-700' :
                              j.status === 'pending' ? 'bg-yellow-100 text-yellow-700' :
                              j.status === 'cancelled' || j.status === 'rejected' ? 'bg-red-100 text-red-700' :
                              'bg-blue-100 text-blue-700'
                            }`}>
                              {j.status}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          </TabsContent>

        </Tabs>
      </main>
    </div>
  );
}
