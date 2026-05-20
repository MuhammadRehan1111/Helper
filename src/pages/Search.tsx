import { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useAppContext } from '@/lib/AppContext';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { ArrowLeft, Search as SearchIcon, Star, MapIcon, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function SearchPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCat = searchParams.get('category') || '';
  const { workers } = useAppContext();
  
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState(initialCat);
  const [sortMethod, setSortMethod] = useState('');

  let filteredWorkers = workers.filter(w => {
    if (category && (!w.category.toLowerCase().includes(category.toLowerCase()) && !(w.tags || []).some(t => t.toLowerCase().includes(category.toLowerCase())))) return false;
    if (query && !w.name.toLowerCase().includes(query.toLowerCase()) && !w.category.toLowerCase().includes(query.toLowerCase())) return false;
    return true;
  });

  if (sortMethod === 'price-low') {
     filteredWorkers = filteredWorkers.sort((a, b) => a.hourlyRate - b.hourlyRate);
  } else if (sortMethod === 'price-high') {
     filteredWorkers = filteredWorkers.sort((a, b) => b.hourlyRate - a.hourlyRate);
  } else if (sortMethod === 'rating-high') {
     filteredWorkers = filteredWorkers.sort((a, b) => b.rating - a.rating);
  }

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-col min-h-full bg-background pb-8 relative">
      <header className="px-4 py-4 pt-6 bg-card sticky top-0 z-10 border-b shadow-sm">
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="shrink-0" onClick={handleBack}>
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div className="relative flex-1">
            <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              autoFocus
              placeholder="Search by name or category..." 
              value={query}
              onChange={e => setQuery(e.target.value)}
              className="pl-9 bg-secondary/50 border-transparent rounded-full h-10"
            />
          </div>
        </div>
        
        {/* Quick horizontal filters */}
        <div className="flex justify-between items-center mt-4">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 flex-1">
             {['All', 'Electrician', 'Plumber', 'Carpenter', 'Painter', 'AC Technician'].map(cat => (
               <button 
                 key={cat} 
                 onClick={() => setCategory(cat === 'All' ? '' : cat)}
                 className={`px-4 py-1.5 rounded-full text-xs font-medium whitespace-nowrap transition-colors ${
                   (cat === 'All' && category === '') || cat === category 
                     ? 'bg-primary text-primary-foreground' 
                     : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                 }`}
               >
                 {cat}
               </button>
             ))}
          </div>
        </div>
        
        {/* Sorting Dropdown */}
        <div className="mt-2 text-sm flex items-center justify-between">
           <span className="text-muted-foreground font-semibold">{filteredWorkers.length} results</span>
           <select 
             className="bg-transparent border-none text-primary font-medium focus:outline-none"
             value={sortMethod}
             onChange={e => setSortMethod(e.target.value)}
           >
              <option value="">Sort By</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating-high">Rating: Highest to Lowest</option>
           </select>
        </div>
      </header>

      <div className="flex-1 p-4 flex flex-col gap-3">
        {filteredWorkers.length === 0 ? (
          <div className="text-center py-10 text-muted-foreground flex flex-col items-center">
            <SearchIcon className="w-10 h-10 mb-3 opacity-20" />
            <p>No workers found.</p>
            <p className="text-xs">Try a different search term or category.</p>
          </div>
        ) : (
          filteredWorkers.map(worker => (
            <div 
              key={worker.id} 
              onClick={() => navigate(`/worker/${worker.id}`)}
              className="flex items-center gap-4 bg-card p-4 rounded-2xl shadow-sm border border-border/50 cursor-pointer hover:border-primary/50 transition-colors"
            >
               <div className="relative">
                 <Avatar className="h-16 w-16 border">
                    <AvatarImage src={worker.avatar} />
                    <AvatarFallback>{worker.name[0]}</AvatarFallback>
                  </Avatar>
                  <span className={`absolute bottom-0 right-0 w-4 h-4 border-2 border-card rounded-full ${worker.available ? 'bg-green-500' : 'bg-red-500'}`}></span>
               </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-1">
                    <h3 className="font-bold truncate">{worker.name}</h3>
                    {worker.verified && <CheckCircle className="w-4 h-4 text-blue-500" />}
                  </div>
                  <p className="text-sm text-muted-foreground mb-1">{worker.category}</p>
                  <div className="flex gap-2">
                    <div className="flex items-center gap-1 text-amber-500 font-medium text-xs">
                      <Star className="fill-current w-3.5 h-3.5" />
                      <span>{worker.rating}</span>
                    </div>
                    <span className="text-xs text-muted-foreground">• {worker.distance} km</span>
                  </div>
                </div>
                <div className="text-right flex flex-col justify-between h-full">
                  <div className="text-sm font-bold text-primary">Rs. {worker.hourlyRate}</div>
                  <div className="text-[10px] text-muted-foreground">/ hr</div>
                </div>
            </div>
          ))
        )}
      </div>
      
      <Button className="fixed bottom-20 right-4 rounded-full shadow-lg gap-2 h-12 px-6">
        <MapIcon className="w-4 h-4" /> Map View
      </Button>
    </div>
  );
}
