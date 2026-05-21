import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Bell, Lock, Eye, Languages, Trash2, ChevronRight, Moon, ShieldCheck, Briefcase, X, Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/lib/AppContext';

const CATEGORIES = [
  'Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Technician', 
  'Mechanic', 'Cleaning', 'Moving', 'Beautician', 'Tutor'
];

export default function Settings() {
  const navigate = useNavigate();
  const { currentUser, setCurrentUser, workers, updateWorkerProfile, showToast, setLanguage: setAppLanguage } = useAppContext();
  
  const workerInfo = currentUser?.role === 'worker' ? workers.find(w => w.id === currentUser.id) : null;

  // Worker settings state
  const [category, setCategory] = useState('');
  const [hourlyRate, setHourlyRate] = useState('');
  const [bio, setBio] = useState('');

  // General settings state (persisted in localStorage)
  const [isDark, setIsDark] = useState(() => localStorage.getItem('theme') === 'dark');
  const [notifications, setNotifications] = useState(() => localStorage.getItem('notifications_enabled') !== 'false');
  const [language, setLanguage] = useState(() => localStorage.getItem('app_language') || 'English (United Kingdom)');
  const [discovery, setDiscovery] = useState(() => localStorage.getItem('privacy_discovery') !== 'false');
  const [shareLocation, setShareLocation] = useState(() => localStorage.getItem('privacy_location') !== 'false');

  // Modals state
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showPrivacyModal, setShowPrivacyModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    if (workerInfo) {
      setCategory(workerInfo.category || '');
      setHourlyRate(workerInfo.hourlyRate ? String(workerInfo.hourlyRate) : '');
      setBio(workerInfo.bio || '');
    }
  }, [workerInfo]);

  // Sync dark mode class with state
  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/profile');
    }
  };

  const handleSaveWorkerProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!category) {
      showToast("Please choose a service category", "warning");
      return;
    }
    const rateNum = parseInt(hourlyRate);
    if (isNaN(rateNum) || rateNum <= 0) {
      showToast("Please enter a valid hourly rate", "warning");
      return;
    }

    if (currentUser?.id) {
      updateWorkerProfile(currentUser.id, {
        category,
        hourlyRate: rateNum,
        rate: `Rs. ${rateNum}`,
        bio
      });
      showToast("Service settings updated successfully!", "success");
    }
  };

  const handleNotificationsToggle = (checked: boolean) => {
    setNotifications(checked);
    localStorage.setItem('notifications_enabled', String(checked));
    showToast(checked ? "Push notifications enabled" : "Push notifications muted", "success");
  };

  const handleSelectLanguage = (lang: string) => {
    if (lang === 'Urdu (اردو)') {
      setAppLanguage('ur');
      setLanguage('Urdu (اردو)');
      localStorage.setItem('app_language', 'Urdu (اردو)');
    } else {
      setAppLanguage('en');
      setLanguage('English (United Kingdom)');
      localStorage.setItem('app_language', 'English (United Kingdom)');
    }
    setShowLanguageModal(false);
    showToast(`Language changed`, "success");
  };

  const handleSavePrivacy = () => {
    localStorage.setItem('privacy_discovery', String(discovery));
    localStorage.setItem('privacy_location', String(shareLocation));
    setShowPrivacyModal(false);
    showToast("Privacy preferences saved", "success");
  };

  const handleDeleteAccount = () => {
    setShowDeleteModal(false);
    showToast("Account deletion process initiated. Session terminated.", "info");
    setCurrentUser(null);
    navigate('/splash');
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <header className="px-4 py-4 flex items-center gap-4 bg-card border-b sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Settings</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        {/* Worker-Specific Service Settings */}
        {currentUser?.role === 'worker' && (
          <section className="slide-in">
            <div className="flex items-center gap-2 mb-3 px-2">
              <Briefcase className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Service Settings</h2>
            </div>
            <form onSubmit={handleSaveWorkerProfile} className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Service Category</label>
                <select 
                  value={category} 
                  onChange={e => setCategory(e.target.value)}
                  className="w-full bg-secondary/50 rounded-xl px-3 py-2 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
                >
                  <option value="">Select Category</option>
                  {CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Hourly Rate (PKR / hr)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-muted-foreground">Rs.</span>
                  <input 
                    type="number" 
                    placeholder="Rate per hour" 
                    value={hourlyRate}
                    onChange={e => setHourlyRate(e.target.value)}
                    className="w-full bg-secondary/50 rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Biography / Professional Pitch</label>
                <textarea 
                  placeholder="Tell clients about your experience, certifications, and expertise..." 
                  value={bio}
                  onChange={e => setBio(e.target.value)}
                  rows={4}
                  className="w-full bg-secondary/50 rounded-xl px-3 py-2.5 text-sm font-semibold border border-border/50 outline-none focus:border-primary resize-none"
                />
              </div>

              <Button type="submit" className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                Save Service Settings
              </Button>
            </form>
          </section>
        )}

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Account & Security</h2>
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden shadow-sm">
             <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-blue-100 text-blue-600 rounded-lg"><Bell className="w-5 h-5" /></div>
                   <span className="font-medium">Notifications</span>
                </div>
                <Switch checked={notifications} onCheckedChange={handleNotificationsToggle} />
             </div>
             <div onClick={() => navigate('/security')} className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Lock className="w-5 h-5" /></div>
                   <span className="font-medium">Password & Security</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
             </div>
             <div onClick={() => setShowPrivacyModal(true)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-green-100 text-green-600 rounded-lg"><Eye className="w-5 h-5" /></div>
                   <span className="font-medium">Privacy Settings</span>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Preferences</h2>
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden shadow-sm">
             <div onClick={() => setShowLanguageModal(true)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Languages className="w-5 h-5" /></div>
                   <div className="flex flex-col">
                      <span className="font-medium">App Language</span>
                      <span className="text-xs text-muted-foreground">{language}</span>
                   </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
             </div>
             <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Moon className="w-5 h-5" /></div>
                   <span className="font-medium">Dark Mode</span>
                </div>
                <Switch checked={isDark} onCheckedChange={setIsDark} />
             </div>
          </div>
        </section>

        <section>
          <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-3 px-2">Danger Zone</h2>
          <div className="bg-card rounded-2xl border border-border/50 overflow-hidden shadow-sm">
             <div onClick={() => setShowDeleteModal(true)} className="flex items-center justify-between p-4 cursor-pointer hover:bg-destructive/10 group transition-colors">
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-destructive/10 text-destructive rounded-lg group-hover:bg-destructive group-hover:text-white transition-colors"><Trash2 className="w-5 h-5" /></div>
                   <span className="font-medium text-destructive">Delete My Account</span>
                </div>
             </div>
          </div>
        </section>

        <div className="text-center pt-4">
           <div className="flex items-center justify-center gap-2 mb-2">
              <ShieldCheck className="w-4 h-4 text-green-600" />
              <span className="text-xs font-bold text-muted-foreground">100% Encrypted & Secure</span>
           </div>
           <p className="text-[10px] text-muted-foreground">Helper App v2.4.0 (Pakistan Build)</p>
        </div>
      </main>

      {/* Language Selection Modal */}
      {showLanguageModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-xl slide-in relative">
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setShowLanguageModal(false)}>
               <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-4">Select App Language</h3>
            <div className="space-y-2">
              {[
                'English (United Kingdom)',
                'Urdu (اردو)',
                'Punjabi (پنجابی)',
                'Sindhi (سنڌي)'
              ].map(lang => (
                <div 
                  key={lang} 
                  onClick={() => handleSelectLanguage(lang)}
                  className="flex items-center justify-between p-3 rounded-xl hover:bg-secondary cursor-pointer transition-colors"
                >
                  <span className="font-semibold text-sm">{lang}</span>
                  {language === lang && <Check className="w-4 h-4 text-primary" />}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Privacy Settings Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-xl slide-in relative">
            <button className="absolute top-4 right-4 text-muted-foreground hover:text-foreground" onClick={() => setShowPrivacyModal(false)}>
               <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold mb-2">Privacy Settings</h3>
            <p className="text-xs text-muted-foreground mb-4">Configure your data and profile preferences.</p>
            
            <div className="space-y-4 mb-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">Profile Discovery</h4>
                  <p className="text-[10px] text-muted-foreground">Allow others to find your profile via search.</p>
                </div>
                <Switch checked={discovery} onCheckedChange={setDiscovery} />
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <h4 className="text-sm font-bold">Share Location</h4>
                  <p className="text-[10px] text-muted-foreground">Share real-time tracking during jobs.</p>
                </div>
                <Switch checked={shareLocation} onCheckedChange={setShareLocation} />
              </div>
            </div>

            <Button className="w-full h-12 rounded-xl font-bold" onClick={handleSavePrivacy}>
              Save Preferences
            </Button>
          </div>
        </div>
      )}

      {/* Delete Account Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-card w-full max-w-sm rounded-3xl p-6 shadow-xl slide-in relative text-center">
            <div className="w-12 h-12 bg-destructive/10 text-destructive rounded-full flex items-center justify-center mx-auto mb-3">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold mb-2 text-destructive">Delete Your Account?</h3>
            <p className="text-xs text-muted-foreground mb-6">
              This action is permanent and cannot be undone. All active requests and balance data will be wiped out.
            </p>
            
            <div className="flex gap-2">
              <Button variant="outline" className="flex-1 rounded-xl" onClick={() => setShowDeleteModal(false)}>
                Cancel
              </Button>
              <Button variant="destructive" className="flex-1 rounded-xl bg-destructive" onClick={handleDeleteAccount}>
                Yes, Delete
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
