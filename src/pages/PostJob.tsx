import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Send, Sparkles, MapPin, Calendar, 
  Clock, Hammer, Info, ShieldCheck, CheckCircle2, 
  Image as ImageIcon, Camera, Mic
} from 'lucide-react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { mockCategories } from '@/lib/mockData';

export default function PostJob() {
  const navigate = useNavigate();
  const { showToast, addJob, currentUser } = useAppContext();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: 'Sector F-7, Islamabad',
    budget: '',
    date: 'As soon as possible',
    category: 'Electrician'
  });

  const [isPosting, setIsPosting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [mediaUrl, setMediaUrl] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  const recognitionRef = React.useRef<any>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.description) return;
    
    setIsPosting(true);
    
    // Create actual job record
    const newJob: any = {
      id: Math.random().toString(36).substr(2, 9),
      workerId: 'system-agent', // Placeholder for broadcasted jobs
      userId: currentUser?.id || 'guest',
      title: formData.title,
      description: formData.description,
      status: 'pending',
      date: formData.date,
      price: parseInt(formData.budget) || 0,
      address: formData.location,
      category: formData.category,
      mediaUrl // Attach media if present
    };

    // Simulate AI Job Analysis & Broadcast
    setTimeout(() => {
      addJob(newJob);
      setIsPosting(false);
      setIsSuccess(true);
      showToast('Custom job broadcasted to nearby pros!', 'success');
    }, 2500);
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setMediaUrl(reader.result as string);
        showToast('Photo attached successfully!', 'success');
      };
      reader.readAsDataURL(file);
    }
  };

  const handleVoiceNote = () => {
    if (isRecording && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsRecording(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      showToast("Voice recognition not supported in this browser.", "error");
      return;
    }

    const recognition = new SpeechRecognition();
    recognitionRef.current = recognition;
    recognition.lang = 'en-US';
    recognition.continuous = false;
    
    recognition.onstart = () => {
      setIsRecording(true);
      showToast('Recording voice note...', 'info');
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setFormData(prev => ({
        ...prev,
        description: prev.description ? `${prev.description}\n[Voice Note]: ${transcript}` : `[Voice Note]: ${transcript}`
      }));
      showToast('Voice note transcribed!', 'success');
    };

    recognition.onend = () => setIsRecording(false);
    recognition.onerror = () => setIsRecording(false);
    recognition.start();
  };

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col min-h-screen bg-background items-center justify-center p-8 text-center font-sans relative">
        <motion.div 
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-32 h-32 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center mb-8 shadow-2xl shadow-emerald-500/30"
        >
           <CheckCircle2 className="w-16 h-16 text-white" />
        </motion.div>
        <h2 className="text-3xl font-black mb-2 tracking-tight">Job Broadcasted!</h2>
        <p className="text-muted-foreground font-medium mb-12 max-w-[240px]">Nearby professionals have been notified. You'll receive quotes shortly.</p>
        
        <div className="w-full space-y-4">
           <Button 
            onClick={() => navigate('/jobs')}
            className="w-full h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
           >
              View My Jobs
           </Button>
           <Button 
            variant="outline"
            onClick={() => navigate('/')}
            className="w-full h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest border-2"
           >
              Back to Home
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-slate-50 font-sans pb-24">
      <header className="px-6 py-8 flex items-center gap-4 bg-white border-b sticky top-0 z-20">
        <button onClick={handleBack} className="p-3 bg-slate-50 hover:bg-slate-100 rounded-2xl transition-colors">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-xl font-black tracking-tight leading-none">Post Custom Job</h1>
          <span className="text-[10px] font-black uppercase tracking-widest text-primary mt-1">Get quotes from pros</span>
        </div>
      </header>

      <main className="flex-1 p-6 space-y-8 overflow-y-auto">
        <div className="bg-slate-950 rounded-[2rem] p-8 text-white relative overflow-hidden shadow-2xl">
           <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 blur-[60px] rounded-full -mr-16 -mt-16"></div>
           <div className="flex items-center gap-4 mb-4">
             <div className="w-12 h-12 rounded-2xl bg-primary/20 flex items-center justify-center">
               <Sparkles className="w-6 h-6 text-primary" />
             </div>
             <div className="flex flex-col">
               <p className="text-[10px] font-black uppercase tracking-[0.2em] text-primary">AI Optimizer</p>
               <h3 className="text-xl font-black text-white">Describe Your Need</h3>
             </div>
           </div>
           <p className="text-slate-400 text-sm font-medium leading-relaxed">
             Our Decision Agent will match this request with the best qualified workers in your area.
           </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Service Category</label>
              <select 
                value={formData.category} 
                onChange={e => setFormData({...formData, category: e.target.value})}
                className="w-full bg-white rounded-2xl px-6 h-16 text-lg font-bold border border-slate-100 shadow-sm outline-none focus:border-primary"
              >
                {mockCategories.map(cat => (
                  <option key={cat.id} value={cat.name}>{cat.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">What do you need?</label>
              <Input 
                value={formData.title}
                onChange={e => setFormData({...formData, title: e.target.value})}
                placeholder="e.g. Repair garden gate, Deep clean kitchen..."
                className="h-16 rounded-2xl bg-white border-slate-100 shadow-sm font-bold text-lg px-6 focus-visible:ring-primary/20"
                required
              />
           </div>

           <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Description & Details</label>
              <Textarea 
                value={formData.description}
                onChange={e => setFormData({...formData, description: e.target.value})}
                placeholder="Details like size, materials, or specific problems..."
                className="min-h-[120px] rounded-2xl bg-white border-slate-100 shadow-sm font-medium px-6 py-4 focus-visible:ring-primary/20"
                required
              />
           </div>

           <div className="grid grid-cols-2 gap-4">
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Budget (Est)</label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold">Rs.</span>
                  <Input 
                    type="number"
                    value={formData.budget}
                    onChange={e => setFormData({...formData, budget: e.target.value})}
                    placeholder="2000"
                    className="h-14 pl-12 rounded-2xl bg-white border-slate-100 shadow-sm font-bold"
                  />
                </div>
              </div>
              <div className="space-y-3">
                <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Timeline</label>
                <div className="relative">
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary" />
                  <Input 
                    value={formData.date}
                    onChange={e => setFormData({...formData, date: e.target.value})}
                    className="h-14 pl-12 rounded-2xl bg-white border-slate-100 shadow-sm font-bold"
                  />
                </div>
              </div>
           </div>

           <div className="space-y-3">
              <label className="text-xs font-black uppercase tracking-widest text-slate-400 px-2">Attach Proof (Optional)</label>
              <div className="flex gap-3">
                 <input type="file" accept="image/*" className="hidden" ref={fileInputRef} onChange={handlePhotoUpload} />
                 <button type="button" onClick={() => fileInputRef.current?.click()} className={`flex-1 h-20 bg-white border-2 border-dashed ${mediaUrl ? 'border-green-500 text-green-600' : 'border-slate-200 text-slate-400'} rounded-3xl flex flex-col items-center justify-center hover:border-primary/50 hover:text-primary transition-all`}>
                    <Camera className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{mediaUrl ? 'Photo Added' : 'Take Photo'}</span>
                 </button>
                 <button type="button" onClick={handleVoiceNote} className={`flex-1 h-20 bg-white border-2 border-dashed ${isRecording ? 'border-red-500 text-red-500 animate-pulse' : 'border-slate-200 text-slate-400'} rounded-3xl flex flex-col items-center justify-center hover:border-primary/50 hover:text-primary transition-all`}>
                    <Mic className="w-6 h-6 mb-1" />
                    <span className="text-[10px] font-black uppercase tracking-widest">{isRecording ? 'Recording...' : 'Voice Note'}</span>
                 </button>
              </div>
           </div>

           <div className="bg-blue-50 border border-blue-100 p-6 rounded-[2rem] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6 text-blue-600" />
              </div>
              <div className="flex flex-col">
                 <h4 className="text-[10px] font-black text-blue-900 uppercase tracking-widest mb-1">Safety First</h4>
                 <p className="text-[11px] text-blue-700 leading-relaxed font-medium">
                   Your phone number is hidden until you accept a quote. We encrypt all initial communications.
                 </p>
              </div>
           </div>
        </form>
      </main>

      <footer className="p-6 bg-white border-t sticky bottom-0 z-20 shadow-[0_-10px_40px_rgb(0,0,0,0.03)]">
         <Button 
          disabled={isPosting}
          onClick={handleSubmit}
          className="w-full h-16 rounded-[2rem] font-black text-xs uppercase tracking-[0.2em] shadow-xl shadow-primary/30"
         >
           {isPosting ? <Loader2 className="w-5 h-5 animate-spin mr-2" /> : <Send className="w-4 h-4 mr-2" />}
           {isPosting ? 'Broadcasting...' : 'Broadcast Job'}
         </Button>
      </footer>
    </div>
  );
}

function Loader2({ className }: { className?: string }) {
  return (
    <svg 
      className={className} 
      xmlns="http://www.w3.org/2000/svg" 
      width="24" 
      height="24" 
      viewBox="0 0 24 24" 
      fill="none" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round"
    >
      <path d="M12 2v4"/><path d="m16.2 7.8 2.9-2.9"/><path d="M18 12h4"/><path d="m16.2 16.2 2.9 2.9"/><path d="M12 18v4"/><path d="m4.9 19.1 2.9-2.9"/><path d="M2 12h4"/><path d="m4.9 4.9 2.9 2.9"/>
    </svg>
  );
}
