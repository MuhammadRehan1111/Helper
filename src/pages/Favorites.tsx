import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Heart, Star, MapPin, ChevronRight, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { useAppContext } from '@/lib/AppContext';

export default function Favorites() {
  const navigate = useNavigate();
  const { workers } = useAppContext();
  
  // Just show some high rated workers as "favorites" for this demo
  const favorites = workers.slice(0, 3);

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
        <h1 className="text-xl font-bold">Favorite Helpers</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-4 pt-6">
        {favorites.length === 0 ? (
          <div className="p-12 text-center flex flex-col items-center">
             <Heart className="w-16 h-16 text-muted-foreground/20 mb-4" />
             <p className="text-muted-foreground font-medium">You haven't saved any heroes yet.</p>
          </div>
        ) : (
          <div className="space-y-4">
             {favorites.map((worker) => (
               <div key={worker.id} onClick={() => navigate(`/worker/${worker.id}`)} className="bg-card p-4 rounded-[2rem] border border-border/50 shadow-sm flex items-center justify-between cursor-pointer hover:border-primary/40 transition-all group">
                  <div className="flex items-center gap-4">
                     <Avatar className="h-14 w-14 ring-2 ring-primary/10">
                        <AvatarImage src={worker.avatar} />
                        <AvatarFallback>{worker.name[0]}</AvatarFallback>
                     </Avatar>
                     <div className="flex flex-col">
                        <div className="flex items-center gap-1">
                           <span className="font-bold text-slate-900">{worker.name}</span>
                           <div className="flex items-center bg-amber-50 px-1.5 py-0.5 rounded-lg ml-1">
                              <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                              <span className="text-[10px] font-black ml-0.5">{worker.rating}</span>
                           </div>
                        </div>
                        <span className="text-xs text-muted-foreground font-bold tracking-tight">{worker.category}</span>
                     </div>
                  </div>
                  <div className="flex items-center gap-2">
                     <Button size="icon" variant="secondary" className="h-10 w-10 rounded-xl">
                        <MessageCircle className="w-4 h-4 text-primary" />
                     </Button>
                     <ChevronRight className="w-4 h-4 text-muted-foreground" />
                  </div>
               </div>
             ))}
          </div>
        )}

        <div className="bg-slate-900 text-white p-8 rounded-[2.5rem] mt-8 relative overflow-hidden">
           <Heart className="absolute -right-4 -bottom-4 w-32 h-32 text-white/5" />
           <h3 className="text-xl font-black mb-2">Build your dream team</h3>
           <p className="text-slate-400 text-sm font-medium leading-relaxed">Save the helpers you loved working with to hire them again instantly next time!</p>
        </div>
      </main>
    </div>
  );
}
