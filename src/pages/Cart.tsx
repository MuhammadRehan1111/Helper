import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'motion/react';
import { 
  ArrowLeft, Trash2, ShoppingCart, Calendar, Clock, 
  MapPin, CreditCard, Tag, ShieldCheck, CheckCircle2 
} from 'lucide-react';
import { useAppContext } from '@/lib/AppContext';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Cart() {
  const navigate = useNavigate();
  const { cart, removeFromCart, clearCart, workers, addJob, showToast, currentUser } = useAppContext();
  
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState('');
  const [discount, setDiscount] = useState(0);

  const handleBack = () => {
    navigate(-1);
  };

  const handleApplyPromo = () => {
    const code = promoInput.trim().toUpperCase();
    if (code === 'WELCOME50') {
      setDiscount(50);
      setAppliedPromo('WELCOME50');
      showToast('Promo WELCOME50 applied! Rs. 50 off', 'success');
    } else if (code === 'HELPER100') {
      setDiscount(100);
      setAppliedPromo('HELPER100');
      showToast('Promo HELPER100 applied! Rs. 100 off', 'success');
    } else {
      showToast('Invalid promo code', 'error');
    }
  };

  // Helper function to resolve worker details
  const getWorkerDetails = (workerId: string) => {
    return workers.find(w => w.id === workerId);
  };

  // Calculate pricing
  const subtotal = cart.reduce((sum, item) => {
    const w = getWorkerDetails(item.workerId);
    return sum + (w ? w.hourlyRate : 0);
  }, 0);

  const platformFee = cart.length * 49;
  const grandTotal = Math.max(0, subtotal + platformFee - discount);

  const handleConfirmAll = async () => {
    if (cart.length === 0) return;

    try {
      // Create a booking job for each item in the cart
      for (const item of cart) {
        const worker = getWorkerDetails(item.workerId);
        if (!worker) continue;

        const bookingId = 'H-' + Math.random().toString(36).substr(2, 6).toUpperCase();
        
        addJob({
          id: bookingId,
          workerId: worker.id,
          userId: currentUser?.id || 'u1',
          title: `${worker.category} Service`,
          status: 'provider_assigned',
          date: item.date,
          address: item.address,
          price: worker.hourlyRate + 49,
          category: worker.category
        });
      }

      clearCart();
      showToast('All bookings confirmed successfully!', 'success');
      navigate('/jobs');
    } catch (err) {
      console.error(err);
      showToast('Error confirming bookings', 'error');
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

  return (
    <div className="flex flex-col min-h-screen bg-background font-sans overflow-x-hidden">
      {/* Header */}
      <header className="px-6 pt-12 pb-6 border-b bg-card flex items-center justify-between">
        <button 
          onClick={handleBack}
          className="p-2 bg-secondary/50 rounded-2xl hover:bg-secondary transition-all"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-xl font-black italic tracking-tight">My Cart</h1>
        <div className="w-9 h-9"></div> {/* spacer */}
      </header>

      {/* Main Content */}
      <main className="flex-1 p-6 space-y-6 overflow-y-auto pb-32">
        {cart.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center space-y-6">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <ShoppingCart className="w-12 h-12 stroke-[1.5]" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-bold">Your cart is empty</h2>
              <p className="text-sm text-muted-foreground max-w-[250px] mx-auto leading-relaxed">
                Add services from top local helpers to request them all at once.
              </p>
            </div>
            <Button 
              onClick={() => navigate('/')}
              className="px-8 h-14 rounded-2xl font-black text-sm uppercase tracking-wider"
            >
              Browse Helpers
            </Button>
          </div>
        ) : (
          <>
            {/* Cart Items List */}
            <div className="space-y-4">
              {cart.map((item, idx) => {
                const worker = getWorkerDetails(item.workerId);
                if (!worker) return null;

                return (
                  <motion.div 
                    key={`${item.workerId}-${idx}`}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="bg-card rounded-3xl border p-4 flex gap-4 shadow-sm relative overflow-hidden"
                  >
                    <Avatar className="h-16 w-16 shrink-0 border">
                      <AvatarImage src={worker.avatar} />
                      <AvatarFallback>{worker.name[0]}</AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0 space-y-2">
                      <div>
                        <h3 className="font-bold text-base truncate">{worker.name}</h3>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-widest">{worker.category}</p>
                      </div>

                      <div className="space-y-1 text-xs text-muted-foreground font-medium">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{getDisplayDate(item.date)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span>{item.time}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-primary shrink-0" />
                          <span className="truncate">{item.address || 'Standard Location'}</span>
                        </div>
                      </div>

                      <div className="pt-1 flex items-center justify-between">
                        <span className="text-sm font-black text-primary">Rs. {worker.hourlyRate}/hr</span>
                      </div>
                    </div>

                    <button 
                      onClick={() => {
                        removeFromCart(item.workerId);
                        showToast('Removed from cart', 'info');
                      }}
                      className="absolute top-4 right-4 p-2 text-muted-foreground hover:text-destructive hover:bg-destructive/10 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </motion.div>
                );
              })}
            </div>

            {/* Promo Code Entry */}
            <div className="bg-card rounded-3xl border p-5 space-y-3 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground">Promo Code</h4>
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-primary pointer-events-none" />
                  <input
                    type="text"
                    placeholder="e.g. WELCOME50"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value)}
                    className="w-full h-12 bg-secondary/50 border rounded-xl pl-11 pr-4 font-bold text-xs uppercase focus:border-primary outline-none transition-all"
                  />
                </div>
                <button
                  type="button"
                  onClick={handleApplyPromo}
                  className="bg-primary text-primary-foreground font-black text-xs uppercase tracking-wider px-6 rounded-xl transition-all active:scale-95"
                >
                  Apply
                </button>
              </div>
              {appliedPromo && (
                <p className="text-[10px] text-emerald-500 font-bold px-1">
                  Promo code {appliedPromo} applied successfully!
                </p>
              )}
            </div>

            {/* Price Summary */}
            <div className="bg-card rounded-3xl border p-5 space-y-4 shadow-sm">
              <h4 className="text-xs font-black uppercase tracking-widest text-muted-foreground border-b pb-2">Price Breakdown</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between items-center opacity-60">
                  <span>Service Subtotal</span>
                  <span className="font-black">Rs. {subtotal}</span>
                </div>
                <div className="flex justify-between items-center opacity-60">
                  <span>Platform Fee ({cart.length} item{cart.length > 1 ? 's' : ''})</span>
                  <span className="font-black">Rs. {platformFee}</span>
                </div>
                {discount > 0 && (
                  <div className="flex justify-between items-center text-emerald-500 font-medium">
                    <span>Discount</span>
                    <span className="font-black">- Rs. {discount}</span>
                  </div>
                )}
                <div className="flex justify-between items-center pt-2 border-t text-base font-black">
                  <span className="italic">Grand Total</span>
                  <span className="text-primary text-xl">Rs. {grandTotal}</span>
                </div>
              </div>
            </div>
          </>
        )}
      </main>

      {/* Sticky Bottom Actions */}
      {cart.length > 0 && (
        <footer className="fixed bottom-0 max-w-md w-full bg-card border-t p-6 shadow-[0_-10px_40px_rgb(0,0,0,0.02)] space-y-3 z-30">
          <Button 
            onClick={handleConfirmAll}
            className="w-full h-16 rounded-3xl font-black text-base shadow-xl shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all"
          >
            Confirm All Bookings
          </Button>
          <div className="flex items-center justify-center gap-2 text-[10px] text-muted-foreground font-black uppercase tracking-widest">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
            Secure Platform Checkout
          </div>
        </footer>
      )}
    </div>
  );
}
