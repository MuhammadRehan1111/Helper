import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Shield, Mail, Key, History, ChevronRight, X } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/AppContext';

export default function AccountSecurity() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  // Settings State (persisted in localStorage)
  const [twoFactor, setTwoFactor] = useState(() => localStorage.getItem('security_2fa') === 'true');
  
  // Modals state
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showSessionModal, setShowSessionModal] = useState(false);

  // Password fields state
  const [currPassword, setCurrPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Sessions state
  const [sessions, setSessions] = useState([
    { id: '1', device: 'Chrome on Windows 11', location: 'Islamabad, Pakistan', active: true, time: 'Current Session' },
    { id: '2', device: 'Safari on iPhone 15', location: 'Lahore, Pakistan', active: false, time: '2 hours ago' },
    { id: '3', device: 'Firefox on macOS', location: 'Karachi, Pakistan', active: false, time: '3 days ago' }
  ]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/profile');
    }
  };

  const handle2FAToggle = (checked: boolean) => {
    setTwoFactor(checked);
    localStorage.setItem('security_2fa', String(checked));
    showToast(checked ? "Two-Factor Authentication activated" : "Two-Factor Authentication deactivated", "success");
  };

  const handlePasswordChangeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currPassword || !newPassword || !confirmPassword) {
      showToast("Please fill in all password fields", "warning");
      return;
    }
    if (newPassword.length < 6) {
      showToast("New password must be at least 6 characters", "warning");
      return;
    }
    if (newPassword !== confirmPassword) {
      showToast("New passwords do not match", "warning");
      return;
    }

    showToast("Password updated successfully!", "success");
    setShowPasswordModal(false);
    setCurrPassword('');
    setNewPassword('');
    setConfirmPassword('');
  };

  const handleRevokeAllSessions = () => {
    setSessions(prev => prev.filter(s => s.active));
    showToast("Logged out of all other active sessions", "success");
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <header className="px-4 py-4 flex items-center gap-4 bg-card border-b sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Account Security</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="bg-primary/5 p-4 rounded-2xl flex items-center gap-3 border border-primary/10 slide-in">
           <div className="p-3 bg-primary/10 rounded-full text-primary">
              <Shield className="w-6 h-6" />
           </div>
           <div>
              <p className="text-sm font-bold">Security Score: Great</p>
              <div className="w-48 bg-secondary h-1.5 rounded-full mt-1">
                 <div className="w-[85%] bg-green-500 h-full rounded-full"></div>
              </div>
           </div>
        </div>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Access Control</h2>
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden shadow-sm">
             <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Mail className="w-5 h-5" /></div>
                   <div className="flex flex-col">
                      <span className="font-medium text-sm">Two-Factor Auth</span>
                      <span className="text-[10px] text-muted-foreground">Extra layer of protection</span>
                   </div>
                </div>
                <Switch checked={twoFactor} onCheckedChange={handle2FAToggle} />
             </div>
             <div onClick={() => setShowPasswordModal(true)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Key className="w-5 h-5" /></div>
                   <span className="font-medium text-sm">Change Password</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Activity</h2>
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden shadow-sm">
             <div onClick={() => setShowSessionModal(true)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><History className="w-5 h-5" /></div>
                   <div className="flex flex-col">
                      <span className="font-medium text-sm">Login Session History</span>
                      <span className="text-[10px] text-green-600 font-bold">{sessions.length} Active Sessions</span>
                   </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
             </div>
          </div>
        </section>
      </main>

      {/* Change Password Modal */}
      {showPasswordModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-xl slide-in relative">
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setShowPasswordModal(false)}>
               <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Change Password</h3>
            
            <form onSubmit={handlePasswordChangeSubmit} className="space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Current Password</label>
                <input 
                  type="password" 
                  placeholder="Enter current password" 
                  value={currPassword}
                  onChange={e => setCurrPassword(e.target.value)}
                  className="w-full bg-secondary/50 rounded-xl px-3 py-2.5 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">New Password</label>
                <input 
                  type="password" 
                  placeholder="At least 6 characters" 
                  value={newPassword}
                  onChange={e => setNewPassword(e.target.value)}
                  className="w-full bg-secondary/50 rounded-xl px-3 py-2.5 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Confirm New Password</label>
                <input 
                  type="password" 
                  placeholder="Confirm new password" 
                  value={confirmPassword}
                  onChange={e => setConfirmPassword(e.target.value)}
                  className="w-full bg-secondary/50 rounded-xl px-3 py-2.5 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
                />
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                Update Password
              </Button>
            </form>
          </div>
        </div>
      )}

      {/* Session History Modal */}
      {showSessionModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-xl slide-in relative">
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setShowSessionModal(false)}>
               <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-1">Login History</h3>
            <p className="text-xs text-muted-foreground mb-4">Devices currently logged into your account.</p>
            
            <div className="space-y-3 mb-6 max-h-60 overflow-y-auto pr-1">
              {sessions.map(s => (
                <div key={s.id} className="p-3 bg-secondary/40 rounded-xl flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-bold">{s.device}</h4>
                    <p className="text-[9px] text-muted-foreground">{s.location} • {s.time}</p>
                  </div>
                  {s.active ? (
                    <span className="text-[9px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded">Active Now</span>
                  ) : (
                    <button 
                      onClick={() => {
                        setSessions(prev => prev.filter(sess => sess.id !== s.id));
                        showToast("Session terminated", "success");
                      }}
                      className="text-[9px] font-bold text-destructive hover:underline"
                    >
                      Revoke
                    </button>
                  )}
                </div>
              ))}
            </div>

            {sessions.length > 1 && (
              <Button variant="outline" className="w-full h-11 rounded-xl text-xs font-bold text-destructive border-destructive/20 hover:bg-destructive/10" onClick={handleRevokeAllSessions}>
                Log Out of All Other Devices
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
