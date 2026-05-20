import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Wrench } from 'lucide-react';

export default function Splash() {
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => {
      // Check if onboarding is already done (mock via localStorage)
      const hasOnboarded = localStorage.getItem('hasOnboarded');
      if (hasOnboarded) {
        navigate('/login');
      } else {
        navigate('/onboarding');
      }
    }, 2000); // 2 seconds splash

    return () => clearTimeout(timer);
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] bg-primary text-primary-foreground">
      <div className="w-24 h-24 bg-background text-primary rounded-3xl flex items-center justify-center shadow-2xl mb-6 animate-bounce">
        <Wrench className="w-12 h-12" />
      </div>
      <h1 className="text-4xl font-extrabold tracking-tight">Helper</h1>
      <p className="font-medium opacity-80 mt-2">Apna Kaam, Apne Logo Se</p>
    </div>
  );
}
