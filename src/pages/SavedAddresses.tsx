import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, MapPin, Trash2, Home, Briefcase, Heart, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/AppContext';
import { Address } from '@/lib/types';

export default function SavedAddresses() {
  const navigate = useNavigate();
  const { currentUser, addAddress, removeAddress } = useAppContext();

  const getIcon = (type: string) => {
    switch (type) {
      case 'home': return Home;
      case 'office': return Briefcase;
      case 'heart': return Heart;
      default: return MapPin;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case 'home': return 'bg-blue-100 text-blue-600';
      case 'office': return 'bg-purple-100 text-purple-600';
      case 'heart': return 'bg-rose-100 text-rose-600';
      default: return 'bg-slate-100 text-slate-600';
    }
  };

  const [showMapModal, setShowMapModal] = useState(false);
  const [newAddress, setNewAddress] = useState({ label: '', address: '', type: 'home' });

  const handleAddNew = () => {
    setShowMapModal(true);
  };

  const handleSaveMapAddress = () => {
    if (!newAddress.label || !newAddress.address) {
      alert("Please fill both label and address");
      return;
    }
    const newAddr: Address = {
      id: Math.random().toString(36).substr(2, 9),
      label: newAddress.label,
      address: newAddress.address,
      iconType: newAddress.type as any
    };
    
    addAddress(newAddr);
    setShowMapModal(false);
    setNewAddress({ label: '', address: '', type: 'home' });
  };

  const addresses = currentUser?.savedAddresses || [
    { id: '1', label: 'Home', address: 'House 45, Sector F-7/2, Islamabad', iconType: 'home' },
    { id: '2', label: 'Office', address: 'Plot 12, Blue Area, Islamabad', iconType: 'office' },
  ];

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/profile');
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <header className="px-4 py-4 flex items-center gap-4 bg-card border-b sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Saved Addresses</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <div className="flex items-center justify-between px-2">
            <h2 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Your Saved Locations</h2>
            <Button variant="ghost" size="sm" className="text-primary font-bold h-8 px-2" onClick={handleAddNew}>
              <Plus className="w-4 h-4 mr-1" /> Add New
            </Button>
        </div>

        <div className="space-y-3">
          {addresses.map((addr) => {
            const Icon = getIcon(addr.iconType);
            const color = getColor(addr.iconType);
            return (
              <div key={addr.id} className="p-5 bg-card rounded-[2rem] border border-border/50 flex items-center justify-between shadow-sm hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className={`p-4 ${color} rounded-2xl group-hover:scale-110 transition-transform`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="flex flex-col">
                    <span className="font-black text-sm">{addr.label}</span>
                    <span className="text-xs text-muted-foreground font-medium leading-tight max-w-[200px] mt-1">{addr.address}</span>
                  </div>
                </div>
                <button 
                  onClick={(e) => {
                    e.stopPropagation();
                    if(confirm("Delete this address?")) removeAddress(addr.id);
                  }}
                  className="p-2 text-muted-foreground hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-5 h-5" />
                </button>
              </div>
            );
          })}
        </div>

        <div className="bg-secondary/30 p-6 rounded-[2.5rem] mt-8 text-center border border-border/50">
           <MapPin className="w-10 h-10 text-primary/40 mx-auto mb-4" />
           <p className="text-sm font-bold text-slate-600 italic">"Save time by adding your frequently used addresses."</p>
        </div>
      </main>

      {/* Map Selection Modal */}
      {showMapModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex flex-col justify-end">
          <div className="bg-card w-full h-[80vh] rounded-t-3xl overflow-hidden flex flex-col slide-in relative">
            <header className="p-4 border-b flex justify-between items-center bg-card z-10 shadow-sm relative">
              <h3 className="font-bold text-lg">Pin Location</h3>
              <button className="text-muted-foreground hover:text-foreground p-1" onClick={() => setShowMapModal(false)}>✕</button>
            </header>
            
            <div className="relative flex-1 bg-blue-50/50 flex items-center justify-center overflow-hidden">
               {/* Decorative Fake Map Background using CSS Patterns */}
               <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, rgba(59, 130, 246, 0.3) 1px, transparent 0)', backgroundSize: '24px 24px' }}></div>
               <div className="absolute inset-0 grid grid-cols-6 grid-rows-6 gap-1 pointer-events-none opacity-20">
                 {Array.from({length: 36}).map((_, i) => <div key={i} className="border border-blue-900/10 bg-blue-100/30 rounded-lg"></div>)}
               </div>
               
               {/* Center Pin */}
               <div className="relative z-10 flex flex-col items-center justify-center -mt-8">
                  <div className="bg-primary text-white text-[10px] font-bold px-3 py-1 rounded-full shadow-md mb-2 animate-bounce">Move map to pin</div>
                  <MapPin className="w-10 h-10 text-primary drop-shadow-xl" />
                  <div className="w-4 h-1 bg-black/20 rounded-[100%] mt-1 blur-[1px]"></div>
               </div>
            </div>

            <div className="p-6 bg-card border-t shadow-[0_-10px_40px_rgb(0,0,0,0.1)] z-10 relative">
               <div className="space-y-4 mb-6">
                 <div>
                   <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Label (e.g. Home, Work)</label>
                   <input 
                     type="text" 
                     className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm font-bold border border-border/50 outline-none focus:border-primary"
                     placeholder="Home"
                     value={newAddress.label}
                     onChange={e => setNewAddress({...newAddress, label: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-muted-foreground uppercase mb-1 block">Full Address (AI Validated)</label>
                   <input 
                     type="text" 
                     className="w-full bg-secondary/50 rounded-xl px-4 py-3 text-sm font-bold border border-border/50 outline-none focus:border-primary"
                     placeholder="Sector F-7/2, Islamabad"
                     value={newAddress.address}
                     onChange={e => setNewAddress({...newAddress, address: e.target.value})}
                   />
                 </div>
                 <div>
                   <label className="text-[10px] font-bold text-muted-foreground uppercase mb-2 block">Address Type</label>
                   <div className="flex gap-2">
                     {['home', 'office', 'heart', 'other'].map(t => (
                       <button 
                         key={t}
                         onClick={() => setNewAddress({...newAddress, type: t})}
                         className={`px-4 py-2 rounded-xl text-xs font-bold capitalize border-2 transition-all ${newAddress.type === t ? 'border-primary bg-primary/10 text-primary' : 'border-border/50 bg-secondary/30 text-muted-foreground'}`}
                       >
                         {t}
                       </button>
                     ))}
                   </div>
                 </div>
               </div>
               <Button className="w-full h-14 rounded-xl text-lg font-bold shadow-lg shadow-primary/20" onClick={handleSaveMapAddress}>
                 Confirm & Save Address
               </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
