import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import { 
  ArrowLeft, Calendar, Clock, MapPin, CreditCard, 
  CheckCircle2, Loader2, ShieldCheck, Star, 
  Phone, MessageSquare, ChevronRight, Truck,
  Navigation, AlertCircle, ShoppingBag, Plus
} from 'lucide-react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function BookWorker() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workers, addJob, showToast, currentUser } = useAppContext();
  const worker = workers.find(w => w.id === id);

  const [step, setStep] = useState<'details' | 'processing' | 'confirmed' | 'tracking'>('details');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('10:00');
  const [address, setAddress] = useState(currentUser?.savedAddresses?.[0]?.address || 'House 45, Sector F-7/2, Islamabad');
  const [paymentMethod, setPaymentMethod] = useState('Cash After Service');
  const [bookingId, setBookingId] = useState('');
  const [showAddressPicker, setShowAddressPicker] = useState(false);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!worker) return <div className="p-8 text-center">Worker not found</div>;

  const handleBook = async () => {
    setStep('processing');
    try {
      const response = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          workerId: worker.id,
          userId: currentUser?.id || 'u1',
          title: `${worker.category} Service`,
          date: selectedDate,
          time: selectedTime,
          address: address,
          category: worker.category,
          price: worker.hourlyRate,
          paymentMethod: paymentMethod
        })
      });

      const data = response.ok ? await response.json() : null;
      const bookingId = data?.booking_id || ('H-' + Math.random().toString(36).substr(2,6).toUpperCase());
      
      setBookingId(bookingId);
      addJob({
        id: bookingId,
        workerId: worker.id,
        userId: currentUser?.id || 'u1',
        title: `${worker.category} Service`,
        status: 'provider_assigned',
        date: selectedDate,
        address: address,
        price: worker.hourlyRate,
        category: worker.category,
        estimatedArrival: data?.followups?.[0]?.time || '30 minutes'
      });
      
      setStep('confirmed');
      showToast(data?.confirmation_message || 'Booking confirmed!', 'success');
    } catch (error) {
      console.error('Booking error:', error);
      // Fallback to local booking if backend unavailable
      const fallbackId = 'H-' + Math.random().toString(36).substr(2,6).toUpperCase();
      setBookingId(fallbackId);
      addJob({
        id: fallbackId,
        workerId: worker.id,
        userId: currentUser?.id || 'u1',
        title: `${worker.category} Service`,
        status: 'provider_assigned',
        date: selectedDate,
        address,
        price: worker.hourlyRate,
        category: worker.category
      });
      setStep('confirmed');
      showToast('Booking confirmed (offline mode)!', 'success');
    }
  };

  const getDisplayDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const getDisplayTime = (timeStr: string) => {
     // Expected format HH:mm
     try {
       const [hours, minutes] = timeStr.split(':');
       const h = parseInt(hours);
       const ampm = h >= 12 ? 'PM' : 'AM';
       const displayH = h % 12 || 12;
       return `${displayH}:${minutes} ${ampm}`;
     } catch {
       return timeStr;
     }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans pb-safe relative overflow-x-hidden">
      <AnimatePresence mode="wait">
        {step === 'details' && (
          <motion.div 
            key="details"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="flex flex-col h-full"
          >
            <header className="px-6 py-6 flex items-center gap-4 bg-card border-b sticky top-0 z-10">
              <button onClick={handleBack} className="p-2.5 bg-secondary rounded-2xl">
                <ArrowLeft className="w-5 h-5" />
              </button>
              <h1 className="text-xl font-black tracking-tight">Checkout</h1>
            </header>

            <main className="flex-1 p-6 space-y-8 overflow-y-auto">
               {/* Worker Mini Card */}
               <div className="bg-card rounded-[2rem] border p-5 flex items-center gap-4 shadow-sm">
                  <Avatar className="h-16 w-16 border-2 border-primary/20">
                    <AvatarImage src={worker.avatar} />
                    <AvatarFallback>{worker.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <h3 className="font-black text-lg leading-tight">{worker.name}</h3>
                    <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{worker.category}</p>
                    <div className="flex items-center gap-1 mt-1">
                      <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                      <span className="text-xs font-black">{worker.rating}</span>
                    </div>
                  </div>
               </div>

               {/* Configuration */}
               <section className="space-y-6">
                   <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground flex items-center justify-between">
                       Service Location
                       <button onClick={() => setShowAddressPicker(true)} className="text-primary normal-case font-bold">Change</button>
                    </h4>
                    <div className="bg-secondary/40 p-4 rounded-2xl flex items-start gap-3 border border-border/50">
                       <MapPin className="w-5 h-5 text-primary mt-0.5" />
                       <p className="text-sm font-bold text-foreground leading-tight">{address}</p>
                    </div>
                  </div>

                   <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Schedule Selection</h4>
                    <div className="grid grid-cols-2 gap-3">
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-muted-foreground ml-2 uppercase tracking-widest">Date</label>
                          <div className="relative group">
                             <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none z-10" />
                             <input 
                               type="date" 
                               value={selectedDate}
                               onChange={(e) => setSelectedDate(e.target.value)}
                               className="w-full h-14 bg-card border rounded-2xl pl-12 pr-4 font-bold text-sm focus:border-primary transition-all appearance-none"
                             />
                          </div>
                       </div>
                       
                       <div className="flex flex-col gap-2">
                          <label className="text-[10px] font-black text-muted-foreground ml-2 uppercase tracking-widest">Time</label>
                          <div className="relative group">
                             <Clock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none z-10" />
                             <input 
                               type="time" 
                               value={selectedTime}
                               onChange={(e) => setSelectedTime(e.target.value)}
                               className="w-full h-14 bg-card border rounded-2xl pl-12 pr-4 font-bold text-sm focus:border-primary transition-all appearance-none"
                             />
                          </div>
                       </div>
                    </div>
                    <p className="text-[10px] text-muted-foreground font-semibold px-2 italic">
                       Scheduled for: <span className="text-foreground">{getDisplayDate(selectedDate)}</span> at <span className="text-foreground">{getDisplayTime(selectedTime)}</span>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Payment Method</h4>
                    <div className="bg-card border p-4 rounded-2xl flex items-center justify-between group cursor-pointer hover:border-primary/50 transition-colors" onClick={() => {
                      const methods = ['Cash After Service', 'Card ending in 4242', 'HelperWallet'];
                      const currentIdx = methods.indexOf(paymentMethod);
                      const nextIdx = (currentIdx + 1) % methods.length;
                      setPaymentMethod(methods[nextIdx]);
                      showToast(`Switched to ${methods[nextIdx]}`, 'info');
                    }}>
                       <div className="flex items-center gap-3">
                         <CreditCard className="w-5 h-5 text-primary" />
                         <span className="text-sm font-bold">{paymentMethod}</span>
                       </div>
                       <ChevronRight className="w-4 h-4 text-muted-foreground" />
                    </div>
                  </div>
               </section>

               {/* Price Summary */}
               <section className="space-y-4 pt-4 border-t">
                  <div className="flex justify-between items-center opacity-60">
                     <span className="text-sm font-medium">Service Fee</span>
                     <span className="text-sm font-black">Rs. {worker.hourlyRate}</span>
                  </div>
                  <div className="flex justify-between items-center opacity-60">
                     <span className="text-sm font-medium">Platform Fee</span>
                     <span className="text-sm font-black">Rs. 49</span>
                  </div>
                  <div className="flex justify-between items-center pt-2">
                     <span className="text-lg font-black italic">Total Amount</span>
                     <span className="text-2xl font-black text-primary">Rs. {worker.hourlyRate + 49}</span>
                  </div>
               </section>
            </main>

            <footer className="p-6 bg-card border-t mt-auto shadow-[0_-10px_40px_rgb(0,0,0,0.02)]">
               <Button 
                onClick={handleBook}
                className="w-full h-16 rounded-3xl font-black text-lg shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
               >
                 Confirm Booking
               </Button>
               <div className="flex items-center justify-center gap-2 mt-4 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
                  <ShieldCheck className="w-3 h-3 text-emerald-500" />
                  Helper Trust Guarantee Included
               </div>
            </footer>
          </motion.div>
        )}

        {step === 'processing' && (
          <motion.div 
            key="processing"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col min-h-screen items-center justify-center p-8 text-center bg-slate-950 text-white"
          >
             <div className="relative mb-12">
                <div className="w-32 h-32 border-4 border-primary/20 rounded-full flex items-center justify-center">
                   <div className="w-24 h-24 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                </div>
                <ShoppingBag className="w-10 h-10 text-primary absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
             </div>
             <h2 className="text-2xl font-black mb-2">Automating Booking</h2>
             <p className="text-slate-400 text-sm font-medium leading-relaxed max-w-[200px]">Decision Agent is reserving your slot and notifying {worker.name}...</p>
             
             <div className="mt-12 flex flex-col gap-3 w-full max-w-[240px]">
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                   <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-500">Inventory Verified</span>
                </div>
                <div className="flex items-center gap-3 px-4 py-2 bg-white/5 rounded-xl border border-white/5">
                   <Loader2 className="w-4 h-4 animate-spin text-primary" />
                   <span className="text-[10px] font-black uppercase tracking-widest text-slate-300">Reserving Slot...</span>
                </div>
             </div>
          </motion.div>
        )}

        {step === 'confirmed' && (
          <motion.div 
            key="confirmed"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col min-h-screen p-8 text-center items-center justify-center bg-background"
          >
             <div className="relative mb-10 w-24 h-24 bg-emerald-500 rounded-[2.5rem] flex items-center justify-center shadow-2xl shadow-emerald-500/30">
                <CheckCircle2 className="w-12 h-12 text-white" />
                <motion.div 
                  initial={{ scale: 0 }}
                  animate={{ scale: 1.5, opacity: 0 }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                  className="absolute inset-0 bg-emerald-500 rounded-[2.5rem]"
                ></motion.div>
             </div>

             <h2 className="text-3xl font-black mb-2 tracking-tight">Booking Confirmed!</h2>
             <p className="text-muted-foreground font-medium mb-12">Your helper is being dispatched.</p>
             
             <div className="w-full bg-card border rounded-[2rem] p-6 text-left space-y-4 mb-12">
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Booking ID</span>
                   <span className="text-sm font-black text-primary">{bookingId}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Service Date</span>
                   <span className="text-sm font-black">{selectedDate}</span>
                </div>
                <div className="flex justify-between items-center">
                   <span className="text-[10px] font-black uppercase tracking-widest text-muted-foreground">Helper</span>
                   <span className="text-sm font-black">{worker.name}</span>
                </div>
             </div>

             <div className="flex flex-col w-full gap-4">
                <Button 
                   onClick={() => navigate(`/tracking/${worker.id}`)}
                   className="h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20"
                >
                   Live Track Helper
                </Button>
                <Button 
                   variant="outline"
                   onClick={() => navigate('/')}
                   className="h-16 rounded-[2rem] font-black text-xs uppercase tracking-widest border-2"
                >
                   Back to Home
                </Button>
             </div>
          </motion.div>
        )}

        {step === 'tracking' && (
          <motion.div 
            key="tracking"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col min-h-screen bg-slate-900 overflow-hidden relative"
          >
             {/* Simple Map Visualization */}
             <div className="flex-1 bg-slate-800 relative overflow-hidden">
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(circle at 2px 2px, white 1px, transparent 0)', backgroundSize: '40px 40px' }}></div>
                
                {/* Route visualization */}
                <svg className="absolute inset-0 w-full h-full">
                   <motion.path 
                    d="M 50 100 Q 150 200 300 400"
                    fill="none"
                    stroke="rgba(var(--primary),0.3)"
                    strokeWidth="4"
                    strokeDasharray="10 5"
                    initial={{ pathLength: 0 }}
                    animate={{ pathLength: 1 }}
                    transition={{ duration: 10, repeat: Infinity }}
                   />
                </svg>

                {/* Tracking Markers */}
                <motion.div 
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute top-1/4 left-1/4 bg-white p-2 rounded-full shadow-2xl z-10"
                >
                  <Navigation className="w-6 h-6 text-primary fill-primary/20" />
                  <div className="absolute top-0 right-0 w-3 h-3 bg-red-500 rounded-full border-2 border-white"></div>
                </motion.div>

                <div className="absolute bottom-1/4 right-1/4 bg-primary p-3 rounded-2xl shadow-xl z-20">
                  <MapPin className="w-6 h-6 text-white" />
                </div>

                <div className="absolute top-8 left-6 right-6">
                   <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/5 flex items-center justify-between">
                     <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-primary/20 rounded-xl flex items-center justify-center">
                           <Truck className="w-5 h-5 text-primary" />
                        </div>
                        <div className="flex flex-col">
                           <span className="text-[10px] font-black text-white uppercase tracking-widest leading-none">Arriving In</span>
                           <span className="text-lg font-black text-white">12 Mins</span>
                        </div>
                     </div>
                     <div className="px-3 py-1 bg-emerald-500 text-white rounded-lg text-[10px] font-black uppercase tracking-widest animate-pulse">
                        On the way
                     </div>
                   </div>
                </div>
             </div>

             {/* Dynamic Tracker Panel */}
             <div className="bg-white rounded-t-[3rem] p-8 -mt-12 relative z-30 shadow-[0_-20px_60px_rgb(0,0,0,0.4)]">
                <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-8"></div>
                
                <div className="flex items-center gap-5 mb-8">
                   <Avatar className="h-16 w-16 border-2 border-primary/20">
                     <AvatarImage src={worker.avatar} />
                     <AvatarFallback>{worker.name[0]}</AvatarFallback>
                   </Avatar>
                   <div className="flex-1">
                      <div className="flex items-center justify-between">
                         <h3 className="text-xl font-black text-slate-900">{worker.name}</h3>
                         <div className="flex items-center gap-1 bg-amber-50 px-2 py-1 rounded-lg">
                            <Star className="w-3 h-3 text-amber-500 fill-amber-500" />
                            <span className="text-xs font-black">{worker.rating}</span>
                         </div>
                      </div>
                      <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{worker.category} Specialist</p>
                   </div>
                </div>

                <div className="grid grid-cols-2 gap-3 mb-8">
                   <Button variant="outline" className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest border-2 gap-2">
                      <Phone className="w-4 h-4" />
                      Contact
                   </Button>
                   <Button className="h-14 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-primary/20 gap-2">
                      <MessageSquare className="w-4 h-4" />
                      Add Note
                   </Button>
                </div>

                <div className="space-y-6">
                   <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                         <div className="w-4 h-4 rounded-full bg-emerald-500 border-4 border-emerald-100 flex items-center justify-center shrink-0"></div>
                         <div className="w-[2px] h-10 bg-emerald-100"></div>
                      </div>
                      <div className="flex flex-col -mt-1">
                         <span className="text-[10px] font-black text-emerald-500 uppercase tracking-widest">Completed</span>
                         <span className="text-sm font-bold text-slate-900">Task confirmed via Decision Agent</span>
                      </div>
                   </div>
                   <div className="flex gap-4">
                      <div className="flex flex-col items-center">
                         <div className="w-4 h-4 rounded-full bg-primary border-4 border-primary/20 flex items-center justify-center shrink-0 animate-pulse"></div>
                         <div className="w-[2px] h-10 bg-slate-100 border-dashed border-l"></div>
                      </div>
                      <div className="flex flex-col -mt-1">
                         <span className="text-[10px] font-black text-primary uppercase tracking-widest">In Progress</span>
                         <span className="text-sm font-bold text-slate-900">Helper is picking up supplies</span>
                      </div>
                   </div>
                   <div className="flex gap-4 opacity-40">
                      <div className="flex flex-col items-center">
                         <div className="w-4 h-4 rounded-full bg-slate-200 border-4 border-slate-50 flex items-center justify-center shrink-0"></div>
                      </div>
                      <div className="flex flex-col -mt-1">
                         <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Upcoming</span>
                         <span className="text-sm font-bold text-slate-900">Arrival at Sector F-7/2</span>
                      </div>
                   </div>
                </div>

                <div className="mt-10 p-4 bg-rose-50 rounded-2xl border border-rose-100 flex items-start gap-3">
                   <AlertCircle className="w-5 h-5 text-rose-500 shrink-0" />
                   <p className="text-[11px] font-medium text-rose-700 leading-relaxed">
                     Need to cancel? You have 5 minutes before {worker.name} begins travel to your location.
                   </p>
                </div>
             </div>
          </motion.div>
        )}
        {showAddressPicker && (
          <div className="fixed inset-0 bg-black/60 z-[60] flex items-end justify-center">
            <motion.div 
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              className="bg-card w-full max-w-sm rounded-t-[3rem] p-6 pb-12 shadow-2xl space-y-6"
            >
              <div className="w-12 h-1.5 bg-slate-200 rounded-full mx-auto mb-2"></div>
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-black">Saved Addresses</h3>
                <button onClick={() => setShowAddressPicker(false)} className="p-2 hover:bg-secondary rounded-full"><AlertCircle className="w-5 h-5" /></button>
              </div>
              <div className="space-y-3 max-h-[40vh] overflow-y-auto pr-2">
                 {(currentUser?.savedAddresses || []).length === 0 ? (
                    <div className="text-center py-8">
                       <p className="text-sm font-medium text-muted-foreground">No saved addresses found.</p>
                       <Button variant="link" onClick={() => navigate('/addresses')} className="text-primary mt-2">Add New Address</Button>
                    </div>
                 ) : (
                   currentUser?.savedAddresses?.map(addr => (
                     <div 
                        key={addr.id} 
                        onClick={() => {
                          setAddress(addr.address);
                          setShowAddressPicker(false);
                        }}
                        className={`p-4 rounded-2xl border transition-all cursor-pointer ${address === addr.address ? 'border-primary bg-primary/5' : 'border-border/50 bg-secondary/20 hover:border-primary/30'}`}
                      >
                         <div className="flex items-center gap-3">
                            <MapPin className="w-5 h-5 text-primary" />
                            <div className="flex flex-col">
                               <span className="text-sm font-bold">{addr.label}</span>
                               <span className="text-[10px] text-muted-foreground line-clamp-1">{addr.address}</span>
                            </div>
                         </div>
                      </div>
                   ))
                 )}
                 <div 
                    onClick={() => {
                      const manual = prompt("Enter full address manually:");
                      if (manual) {
                        setAddress(manual);
                        setShowAddressPicker(false);
                      }
                    }}
                    className="p-4 rounded-2xl border border-dashed border-border flex items-center justify-center gap-2 cursor-pointer hover:bg-secondary/10 transition-all font-bold text-sm text-slate-500"
                  >
                    <Plus className="w-4 h-4" /> Add Manual Address
                 </div>
              </div>
              <Button onClick={() => setShowAddressPicker(false)} className="w-full h-14 rounded-2xl font-bold">Cancel</Button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
