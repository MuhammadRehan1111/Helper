import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Plus, CreditCard, Wallet, Banknote, ShieldCheck, ChevronRight, DollarSign, ArrowUpRight, TrendingUp, History } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppContext } from '@/lib/AppContext';

export default function PaymentMethods() {
  const navigate = useNavigate();
  const { currentUser, jobs, showToast } = useAppContext();

  // Worker Payout states
  const [payoutAmount, setPayoutAmount] = useState('');
  const [payoutChannel, setPayoutChannel] = useState('JazzCash');
  const [accountNumber, setAccountNumber] = useState('');
  const [withdrawalsList, setWithdrawalsList] = useState<any[]>(() => {
    const saved = localStorage.getItem('helper_worker_withdrawals');
    return saved ? JSON.parse(saved) : [
      { id: 'W-01', amount: 1500, channel: 'JazzCash', date: '2026-05-10', status: 'Completed' },
      { id: 'W-02', amount: 3000, channel: 'EasyPaisa', date: '2026-05-02', status: 'Completed' }
    ];
  });

  const savedMethods = [
    { type: 'Visa', last4: '4242', expiry: '12/26', icon: CreditCard },
    { type: 'Mastercard', last4: '8888', expiry: '05/25', icon: CreditCard },
  ];

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/profile');
    }
  };

  // Calculations for Worker
  const myJobs = jobs.filter(j => j.workerId === currentUser?.id);
  const completedJobs = myJobs.filter(j => j.status === 'completed');
  const grossEarnings = completedJobs.reduce((acc, job) => acc + (job.price || 0), 0);
  const commission = Math.floor(grossEarnings * 0.10);
  
  // Withdrawals check
  const totalWithdrawn = withdrawalsList.reduce((acc, w) => acc + w.amount, 0);
  const availableBalance = Math.max(0, grossEarnings - commission - totalWithdrawn);

  const handleRequestPayout = (e: React.FormEvent) => {
    e.preventDefault();
    const amountNum = parseInt(payoutAmount);
    
    if (!payoutAmount || isNaN(amountNum) || amountNum <= 0) {
      showToast("Please enter a valid payout amount", "warning");
      return;
    }
    if (amountNum < 500) {
      showToast("Minimum payout amount is Rs. 500", "warning");
      return;
    }
    if (amountNum > availableBalance) {
      showToast(`Insufficient balance. Available: Rs. ${availableBalance}`, "error");
      return;
    }
    if (!accountNumber) {
      showToast("Please enter your account number", "warning");
      return;
    }

    const newWithdrawal = {
      id: `W-${Math.floor(100 + Math.random() * 900)}`,
      amount: amountNum,
      channel: payoutChannel,
      date: new Date().toISOString().split('T')[0],
      status: 'Pending'
    };

    const updated = [newWithdrawal, ...withdrawalsList];
    setWithdrawalsList(updated);
    localStorage.setItem('helper_worker_withdrawals', JSON.stringify(updated));
    
    setPayoutAmount('');
    setAccountNumber('');
    showToast(`Payout request for Rs. ${amountNum} submitted!`, "success");
  };

  if (currentUser?.role === 'worker') {
    return (
      <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
        <header className="px-4 py-4 flex items-center gap-4 bg-card border-b sticky top-0 z-10">
          <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Earnings & Payouts</h1>
        </header>

        <main className="flex-1 overflow-y-auto p-4 space-y-6">
          {/* Earnings Overview Card */}
          <div className="bg-primary text-primary-foreground p-6 rounded-3xl shadow-md relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4 opacity-15">
              <DollarSign className="w-24 h-24" />
            </div>
            <div className="relative z-10">
              <p className="text-primary-foreground/70 font-semibold text-xs uppercase tracking-wider mb-1">Available Balance</p>
              <h2 className="text-4xl font-extrabold mb-5">Rs. {availableBalance}</h2>
              <div className="grid grid-cols-2 gap-4 border-t border-primary-foreground/20 pt-4">
                <div>
                  <p className="text-[10px] text-primary-foreground/70 uppercase font-bold">Gross Income</p>
                  <p className="font-bold text-base">Rs. {grossEarnings}</p>
                </div>
                <div>
                  <p className="text-[10px] text-primary-foreground/70 uppercase font-bold">Commission (10%)</p>
                  <p className="font-bold text-base">Rs. {commission}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Request Payout Form */}
          <section>
            <div className="flex items-center gap-2 mb-3 px-2">
              <ArrowUpRight className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Request Payout</h2>
            </div>
            <form onSubmit={handleRequestPayout} className="bg-card p-5 rounded-2xl border border-border/50 shadow-sm space-y-4">
              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Payout Channel</label>
                <select 
                  value={payoutChannel} 
                  onChange={e => setPayoutChannel(e.target.value)}
                  className="w-full bg-secondary/50 rounded-xl px-3 py-2 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
                >
                  <option value="JazzCash">JazzCash Mobile Wallet</option>
                  <option value="EasyPaisa">EasyPaisa Mobile Wallet</option>
                  <option value="HBL">Habib Bank Limited (HBL)</option>
                  <option value="UBL">United Bank Limited (UBL)</option>
                </select>
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Account Number / IBAN</label>
                <input 
                  type="text" 
                  placeholder="e.g. 03001234567" 
                  value={accountNumber}
                  onChange={e => setAccountNumber(e.target.value)}
                  className="w-full bg-secondary/50 rounded-xl px-3 py-2.5 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
                />
              </div>

              <div>
                <label className="text-[10px] font-bold text-muted-foreground uppercase block mb-1">Withdraw Amount (PKR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-sm font-bold text-muted-foreground">Rs.</span>
                  <input 
                    type="number" 
                    placeholder="Min 500" 
                    value={payoutAmount}
                    onChange={e => setPayoutAmount(e.target.value)}
                    className="w-full bg-secondary/50 rounded-xl pl-9 pr-3 py-2.5 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
                  />
                </div>
              </div>

              <Button type="submit" disabled={availableBalance < 500} className="w-full h-12 rounded-xl font-bold bg-primary text-primary-foreground hover:bg-primary/90 mt-2">
                Withdraw Funds
              </Button>
            </form>
          </section>

          {/* Transactions and Payouts History */}
          <section className="pb-8">
            <div className="flex items-center gap-2 mb-3 px-2">
              <History className="w-5 h-5 text-primary" />
              <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Withdrawal History</h2>
            </div>
            {withdrawalsList.length > 0 ? (
              <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden shadow-sm">
                {withdrawalsList.map((w, idx) => (
                  <div key={idx} className="p-4 flex items-center justify-between">
                    <div>
                      <p className="font-bold text-sm">Payout to {w.channel}</p>
                      <p className="text-xs text-muted-foreground">{w.date} • ID: {w.id}</p>
                    </div>
                    <div className="text-right">
                      <p className="font-extrabold text-sm text-slate-800">Rs. {w.amount}</p>
                      <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded ${w.status === 'Completed' ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                        {w.status}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-6 bg-card border border-dashed rounded-2xl">No withdrawals requested yet.</p>
            )}
          </section>
        </main>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <header className="px-4 py-4 flex items-center gap-4 bg-card border-b sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Payment Methods</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4 px-2">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Your Cards</h2>
            <Button variant="ghost" size="sm" className="text-primary font-bold h-8 px-2" onClick={() => showToast("Adding card feature is locked in demo mode.", "info")}>
              <Plus className="w-4 h-4 mr-1" /> Add New
            </Button>
          </div>
          
          <div className="space-y-3">
            {savedMethods.map((method, i) => (
              <div key={i} className="p-4 bg-card rounded-2xl border border-border/50 flex items-center justify-between shadow-sm hover:border-primary/30 transition-all cursor-pointer group">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-secondary rounded-xl text-primary group-hover:bg-primary group-hover:text-white transition-colors">
                    <method.icon className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold">{method.type} •••• {method.last4}</p>
                    <p className="text-xs text-muted-foreground">Expires {method.expiry}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                   <div className="text-[10px] font-bold px-2 py-0.5 bg-green-100 text-green-600 rounded uppercase">Active</div>
                   <ChevronRight className="w-4 h-4 text-muted-foreground" />
                </div>
              </div>
            ))}
          </div>
        </section>

        <section>
          <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4 px-2">Other Methods</h2>
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden shadow-sm">
             <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => showToast("EasyPaisa/JazzCash wallet payment config active", "success")}>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg"><Wallet className="w-5 h-5" /></div>
                   <div className="flex flex-col">
                      <span className="font-medium">EasyPaisa / JazzCash</span>
                      <span className="text-xs text-muted-foreground">Quick mobile wallet checkout</span>
                   </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
             </div>
             <div className="flex items-center justify-between p-4 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => showToast("Cash on Delivery checkout method selected", "success")}>
                <div className="flex items-center gap-3">
                   <div className="p-2 bg-amber-100 text-amber-600 rounded-lg"><Banknote className="w-5 h-5" /></div>
                   <div className="flex flex-col">
                      <span className="font-medium">Cash on Delivery</span>
                      <span className="text-xs text-muted-foreground">Pay after service completion</span>
                   </div>
                </div>
                <ChevronRight className="w-4 h-4 text-muted-foreground" />
             </div>
          </div>
        </section>

        <div className="bg-green-50 border border-green-100 p-4 rounded-2xl flex items-start gap-3">
           <ShieldCheck className="w-5 h-5 text-green-600 shrink-0 mt-0.5" />
           <div>
              <p className="text-sm font-bold text-green-700">PCI DSS Compliant</p>
              <p className="text-xs text-green-600/80 leading-tight">Your payment information is encrypted and never stored on our servers.</p>
           </div>
        </div>
      </main>
    </div>
  );
}
