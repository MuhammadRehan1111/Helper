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

  const handleAddNew = () => {
    const label = prompt("Enter address label (e.g. Home, Bakery):");
    if (!label) return;
    const addrText = prompt("Enter full address:");
    if (!addrText) return;
    
    const type = prompt("Icon type (home, office, heart, other):") as any;
    
    const newAddr: Address = {
      id: Math.random().toString(36).substr(2, 9),
      label,
      address: addrText,
      iconType: type || 'other'
    };
    
    addAddress(newAddr);
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
    </div>
  );
}
