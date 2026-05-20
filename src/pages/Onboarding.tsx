import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Search, ShieldCheck, MapPin } from 'lucide-react';

export default function Onboarding() {
  const navigate = useNavigate();
  const [step, setStep] = useState(0);

  const slides = [
    {
      title: "Kaam Dhundo",
      desc: "Apne aas paas ke ilaqay mein behtareen kaam dhundo aur apni aamdani barhao.",
      icon: <Search className="w-20 h-20 text-primary" />
    },
    {
      title: "Workers Hire Karo",
      desc: "Electricians, plumbers aur deegar mahir workers ko chand clicks mein bulayen.",
      icon: <MapPin className="w-20 h-20 text-primary" />
    },
    {
      title: "Safe Payment",
      desc: "Humari secure payment aur verified professionals ke sath befikr ho kar kaam karwayen.",
      icon: <ShieldCheck className="w-20 h-20 text-primary" />
    }
  ];

  const handleNext = () => {
    if (step < slides.length - 1) {
      setStep(step + 1);
    } else {
      localStorage.setItem('hasOnboarded', 'true');
      navigate('/login');
    }
  };

  return (
    <div className="flex flex-col items-center justify-between min-h-[100dvh] p-6 bg-background relative">
      <div className="flex-1 flex flex-col items-center justify-center text-center w-full mt-10">
        <div className="mb-10 p-8 bg-secondary/50 rounded-[3rem] shadow-sm">
          {slides[step].icon}
        </div>
        <h2 className="text-3xl font-bold mb-4">{slides[step].title}</h2>
        <p className="text-muted-foreground text-lg px-4">{slides[step].desc}</p>
      </div>

      <div className="w-full pb-8">
        <div className="flex justify-center gap-2 mb-8">
          {slides.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-2 rounded-full transition-all duration-300 ${step === idx ? 'w-8 bg-primary' : 'w-2 bg-primary/20'}`}
            />
          ))}
        </div>
        <Button onClick={handleNext} className="w-full h-14 rounded-xl text-lg font-bold">
          {step === slides.length - 1 ? 'Get Started' : 'Next'}
        </Button>
      </div>
    </div>
  );
}
