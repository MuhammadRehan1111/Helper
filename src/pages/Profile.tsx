import React, { useState, useRef } from 'react';
import { useAppContext } from '@/lib/AppContext';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon, Shield, CreditCard, HelpCircle, LogOut, ChevronRight, Share2, Star, Heart, MapPin, Calendar, Terminal, Camera } from 'lucide-react';
import { ref, update } from 'firebase/database';
import { db } from '@/lib/firebase';

export default function Profile() {
  const { currentUser, setCurrentUser, showToast } = useAppContext();
  const navigate = useNavigate();

  const [profilePic, setProfilePic] = useState(currentUser?.avatar || `https://i.pravatar.cc/150?u=${currentUser?.id}`);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = () => {
    setCurrentUser(null);
    navigate('/splash');
  };

  const handlePicClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64String = reader.result as string;
        setProfilePic(base64String);
        if (currentUser) {
          update(ref(db, `users/${currentUser.id}`), { avatar: base64String });
          if (currentUser.role === 'worker') {
            update(ref(db, `workers/${currentUser.id}`), { avatar: base64String });
          }
        }
        showToast("Profile picture updated!", "success");
      };
      reader.readAsDataURL(file);
    }
  };

  const userMenuItems = [
    { icon: Shield, label: 'Account Security', action: () => navigate('/security') },
    { icon: CreditCard, label: 'Payments & Billing', action: () => navigate('/payments') },
    { icon: MapPin, label: 'Saved Addresses', action: () => navigate('/addresses') },
    { icon: Heart, label: 'Favorite Helpers', action: () => navigate('/favorites') },
    { icon: SettingsIcon, label: 'Settings', action: () => navigate('/settings') },
    { icon: HelpCircle, label: 'Help & Support', action: () => navigate('/help') },
  ];

  const workerMenuItems = [
    { icon: Shield, label: 'Account Security', action: () => navigate('/security') },
    { icon: Calendar, label: 'Schedule & Availability', action: () => navigate('/schedule') },
    { icon: CreditCard, label: 'Earnings & Payouts', action: () => navigate('/payments') },
    { icon: SettingsIcon, label: 'Settings', action: () => navigate('/settings') },
    { icon: HelpCircle, label: 'Help & Support', action: () => navigate('/help') },
  ];

  const menuItems = currentUser?.role === 'worker' ? workerMenuItems : userMenuItems;

  return (
    <div className="flex flex-col min-h-full bg-background pb-8">
      <div className="px-4 py-8 bg-secondary/30 relative">
        <div className="flex items-center gap-4">
          <div className="relative group cursor-pointer" onClick={handlePicClick}>
            <input 
              type="file" 
              ref={fileInputRef} 
              onChange={handleFileChange} 
              className="hidden" 
              accept="image/*" 
            />
            <Avatar className="h-20 w-20 border-4 border-background shadow-sm transition-transform group-hover:scale-105 group-active:scale-95">
               <AvatarImage src={profilePic} />
               <AvatarFallback>U</AvatarFallback>
            </Avatar>
            <div className="absolute inset-0 flex items-center justify-center bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
               <Camera className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-2xl font-bold">{currentUser?.name}</h1>
            <p className="text-muted-foreground">{currentUser?.phone}</p>
            <div className="mt-2 text-xs font-semibold px-2 py-1 bg-primary/10 text-primary rounded-md inline-block uppercase tracking-wider">
              {currentUser?.role} Mode
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 mt-6">
        <div className="space-y-1">
          {menuItems.map((item, i) => (
            <div key={i} onClick={item.action} className="flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 mb-2 cursor-pointer hover:border-primary/30 transition-colors">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-secondary rounded-xl text-primary">
                  <item.icon className="w-5 h-5" />
                </div>
                <span className="font-medium">{item.label}</span>
              </div>
              <ChevronRight className="w-4 h-4 text-muted-foreground" />
            </div>
          ))}
          
          <div onClick={handleLogout} className="flex items-center justify-between p-4 bg-destructive/5 rounded-2xl border border-destructive/10 mt-6 cursor-pointer hover:bg-destructive/10 transition-colors">
            <div className="flex items-center gap-3 text-destructive">
              <div className="p-2">
                <LogOut className="w-5 h-5" />
              </div>
              <span className="font-medium">Logout</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
