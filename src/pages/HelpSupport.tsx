import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, MessageSquare, Phone, Mail, FileText, ChevronRight, HelpCircle, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useAppContext } from '@/lib/AppContext';

export default function HelpSupport() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  // Accordion toggle states
  const [activeSection, setActiveSection] = useState<string | null>(null);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/profile');
    }
  };

  const toggleSection = (section: string) => {
    setActiveSection(prev => prev === section ? null : section);
  };

  const faqs = [
    { q: "How do I book a helper?", a: "Go to the Home tab, search for the service category, choose a helper, select a date and time slot, and click 'Confirm Booking'." },
    { q: "What is the cancellation policy?", a: "You can cancel bookings free of charge up to 2 hours before the scheduled time. Worker cancellations impact their platform rating." },
    { q: "How do payouts work for workers?", a: "Workers can request withdrawals from the 'Earnings & Payouts' page. Payouts are processed to JazzCash, EasyPaisa, or bank account once the Rs. 500 minimum is met." },
    { q: "Is my payment information secure?", a: "Absolutely. Helper matches global security standards (PCI DSS) and encrypts all communication." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <header className="px-4 py-4 flex items-center gap-4 bg-card border-b sticky top-0 z-10">
        <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6" />
        </button>
        <h1 className="text-xl font-bold">Help & Support</h1>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <section className="bg-primary/5 p-6 rounded-3xl border border-primary/10 text-center">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            <HelpCircle className="w-8 h-8 text-primary" />
          </div>
          <h2 className="text-xl font-bold mb-2">How can we help?</h2>
          <p className="text-muted-foreground text-sm mb-4">Search our knowledge base or contact our team directly.</p>
          <div className="relative">
            <Input placeholder="Search for help articles..." className="pl-10 h-12 rounded-2xl bg-background border-border/50" />
            <HelpCircle className="absolute left-3 top-3.5 w-5 h-5 text-muted-foreground" />
          </div>
        </section>

        <section className="space-y-3">
          <h3 className="text-sm font-semibold text-muted-foreground px-2 uppercase tracking-wide">Contact Us</h3>
          <div className="grid grid-cols-2 gap-3">
            <button 
              onClick={() => {
                showToast("Opening chat support agent...", "info");
                navigate('/chat/support-agent');
              }}
              className="flex flex-col items-center justify-center p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all group"
            >
              <div className="p-3 bg-secondary rounded-full mb-3 group-hover:bg-primary/10 transition-colors">
                <MessageSquare className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-sm">Live Chat</span>
            </button>
            <button 
              onClick={() => window.open('tel:+923001234567')}
              className="flex flex-col items-center justify-center p-6 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all group"
            >
              <div className="p-3 bg-secondary rounded-full mb-3 group-hover:bg-primary/10 transition-colors">
                <Phone className="w-6 h-6 text-primary" />
              </div>
              <span className="font-bold text-sm">Call Center</span>
            </button>
          </div>
          <button 
            onClick={() => window.open('mailto:support@helper.com')}
            className="w-full flex items-center justify-between p-4 bg-card rounded-2xl border border-border/50 hover:border-primary/30 transition-all group"
          >
            <div className="flex items-center gap-3">
               <div className="p-2 bg-secondary rounded-lg group-hover:bg-primary/10 transition-colors"><Mail className="w-5 h-5 text-primary" /></div>
               <span className="font-medium text-sm">Email Support</span>
            </div>
            <ChevronRight className="w-4 h-4 text-muted-foreground" />
          </button>
        </section>

        <section className="space-y-3 pb-8">
          <h3 className="text-sm font-semibold text-muted-foreground px-2 uppercase tracking-wide">Resources</h3>
          <div className="bg-card rounded-2xl border border-border/50 divide-y divide-border/30 overflow-hidden">
            {/* Terms of Service */}
            <div className="p-4 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => toggleSection('terms')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Terms of Service</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === 'terms' ? 'rotate-180' : ''}`} />
              </div>
              {activeSection === 'terms' && (
                <div className="mt-3 text-xs text-muted-foreground leading-relaxed pl-8 space-y-2 border-t pt-2 mt-2 border-border/30">
                  <p>By using the Helper platform, you agree to our standard service terms. Services booked are subject to availability. Platform commission fees of 10% apply to workers.</p>
                  <p>All users must maintain respectful communication and adhere to local safety regulations.</p>
                </div>
              )}
            </div>

            {/* Privacy Policy */}
            <div className="p-4 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => toggleSection('privacy')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <FileText className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">Privacy Policy</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === 'privacy' ? 'rotate-180' : ''}`} />
              </div>
              {activeSection === 'privacy' && (
                <div className="mt-3 text-xs text-muted-foreground leading-relaxed pl-8 space-y-2 border-t pt-2 mt-2 border-border/30">
                  <p>We respect your privacy. Your personal information, phone number, and address are only shared with workers booked for your service to facilitate transit and delivery.</p>
                  <p>We do not sell your personal data. Payment details are fully encrypted and handled by PCI-compliant payment gateways.</p>
                </div>
              )}
            </div>

            {/* F.A.Q */}
            <div className="p-4 cursor-pointer hover:bg-secondary/20 transition-colors" onClick={() => toggleSection('faq')}>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <HelpCircle className="w-5 h-5 text-muted-foreground" />
                  <span className="text-sm font-medium">F.A.Q</span>
                </div>
                <ChevronDown className={`w-4 h-4 text-muted-foreground transition-transform ${activeSection === 'faq' ? 'rotate-180' : ''}`} />
              </div>
              {activeSection === 'faq' && (
                <div className="mt-3 text-xs pl-8 space-y-4 border-t pt-2 mt-2 border-border/30">
                  {faqs.map((faq, i) => (
                    <div key={i} className="space-y-1">
                      <p className="font-bold text-slate-800">{faq.q}</p>
                      <p className="text-muted-foreground leading-normal">{faq.a}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
