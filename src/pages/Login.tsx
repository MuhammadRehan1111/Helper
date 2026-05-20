import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Wrench, ArrowLeft, CheckCircle2 } from 'lucide-react';

export default function Login() {
  const navigate = useNavigate();
  const { setCurrentUser, currentUser, users, workers, showToast } = useAppContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  // Forgot password flow
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [forgotStep, setForgotStep] = useState(1);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Auto redirect if already logged in
  useEffect(() => {
    if (currentUser) {
      if (currentUser.role === 'admin') navigate('/admin');
      else if (currentUser.role === 'worker') navigate('/worker-dashboard');
      else navigate('/');
    }
  }, [currentUser, navigate]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    const cleanEmail = email.trim().toLowerCase();

    if (!email) {
      errors.email = "Email or Username is required. Example: admin";
    }
    if (!password) {
      errors.password = "Password is required.";
    }

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setErrorMsg("Please fill in all fields correctly.");
      return;
    }

    let loggedInUser = null;

    // 1. Check Hardcoded Demo Accounts
    if (cleanEmail === 'admin') {
      loggedInUser = { id: 'a1', name: 'Admin', email: 'admin@example.com', role: 'admin' };
    } else if (cleanEmail === 'worker') {
      loggedInUser = { id: 'w1', name: 'Ahmad Khan', email: 'worker@example.com', role: 'worker' };
    } else {
      // 2. Check Workers Registry
      const matchedWorker = workers.find(
        w => w.email?.toLowerCase() === cleanEmail || 
             w.name.toLowerCase() === cleanEmail ||
             w.phone?.replace(/\s+/g, '') === cleanEmail.replace(/\s+/g, '')
      );
      if (matchedWorker) {
        loggedInUser = {
          id: matchedWorker.id,
          name: matchedWorker.name,
          phone: matchedWorker.phone || '',
          email: matchedWorker.email || `${matchedWorker.id}@helper.com`,
          role: 'worker'
        };
      } else {
        // 3. Check Users Registry
        const matchedUser = users.find(
          u => u.email?.toLowerCase() === cleanEmail || 
               u.name.toLowerCase() === cleanEmail ||
               u.phone?.replace(/\s+/g, '') === cleanEmail.replace(/\s+/g, '')
        );
        if (matchedUser) {
          loggedInUser = matchedUser;
        } else {
          // 4. Default Mock Login as Regular User
          loggedInUser = { id: `u_${Date.now()}`, name: email.split('@')[0], email, role: 'user', favorites: [], savedAddresses: [] };
        }
      }
    }

    // Direct login — no OTP needed for login
    showToast("Login successful! Welcome back.", "success");
    setCurrentUser(loggedInUser);
  };

  if (isForgotPassword) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 max-w-md mx-auto relative shadow-2xl bg-background">
         <div className="w-full mb-8">
            <Button variant="ghost" size="icon" onClick={() => {
               if (forgotStep > 1) setForgotStep(prev => prev - 1);
               else setIsForgotPassword(false);
            }}>
               <ArrowLeft className="w-6 h-6" />
            </Button>
         </div>

         {forgotStep === 1 && (
            <div className="w-full slide-in">
              <h2 className="text-2xl font-bold mb-2">Reset Password</h2>
              <p className="text-muted-foreground text-sm mb-6">Enter your registered email address to receive a secure OTP.</p>
              <Input 
                type="email"
                placeholder="Email Address" 
                value={forgotEmail}
                onChange={e => setForgotEmail(e.target.value)}
                className="h-14 rounded-xl text-lg bg-card border-border/50 shadow-sm mb-4"
              />
              <Button className="w-full h-14 rounded-xl text-lg font-bold" onClick={() => forgotEmail && setForgotStep(2)}>
                Send OTP
              </Button>
            </div>
         )}

         {forgotStep === 2 && (
            <div className="w-full slide-in">
              <div className="mb-6 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                   <CheckCircle2 className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold">Verify Email</h2>
                <p className="text-muted-foreground text-sm mt-2">We sent a 4-digit code to {forgotEmail}</p>
              </div>
              <Input 
                placeholder="Enter OTP (e.g. 1234)" 
                type="number" 
                value={forgotOtp} 
                onChange={e => setForgotOtp(e.target.value)} 
                className="h-14 text-center tracking-[1em] text-xl font-bold rounded-xl mb-4" 
              />
              <Button className="w-full h-14 rounded-xl text-lg font-bold" onClick={() => forgotOtp.length >= 4 && setForgotStep(3)}>
                Verify OTP
              </Button>
            </div>
         )}

         {forgotStep === 3 && (
            <div className="w-full slide-in">
              <h2 className="text-2xl font-bold mb-2">New Password</h2>
              <p className="text-muted-foreground text-sm mb-6">Create a new strong password for your account.</p>
              <Input 
                type="password"
                placeholder="New Password" 
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                className="h-14 rounded-xl text-lg bg-card border-border/50 shadow-sm mb-4"
              />
              <Button className="w-full h-14 rounded-xl text-lg font-bold" onClick={() => {
                 showToast("Password changed successfully! You can now login.", "success");
                 setIsForgotPassword(false);
                 setForgotStep(1);
                 setForgotEmail('');
                 setForgotOtp('');
                 setNewPassword('');
              }}>
                Reset Password
              </Button>
            </div>
         )}
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-[100dvh] p-6 bg-background relative">
       <div className="w-16 h-16 bg-primary text-primary-foreground rounded-2xl flex items-center justify-center shadow-lg shadow-primary/30 mb-8">
         <Wrench className="w-8 h-8" />
       </div>
       <h1 className="text-3xl font-bold mb-2">Welcome Back</h1>
       <p className="text-muted-foreground text-center mb-4">Login to your Helper account to find or offer services.</p>
       <div className="bg-secondary/50 text-xs text-muted-foreground p-3 rounded-lg mb-8 text-center max-w-sm space-y-2">
         <p>Demo accounts:</p>
         <ul className="list-disc text-left pl-5">
           <li>Username: <strong className="text-foreground">admin</strong> for Admin Dashboard</li>
           <li>Username: <strong className="text-foreground">worker</strong> for Worker view</li>
           <li>Any other text to login as a Regular User.</li>
         </ul>
       </div>

       <form onSubmit={handleLogin} className="w-full space-y-4">
          <div className="space-y-1">
            <Input 
              placeholder="Email / Username (e.g., admin, worker)" 
              value={email}
              onChange={e => {
                setEmail(e.target.value);
                if (fieldErrors.email) {
                  const newErrors = { ...fieldErrors };
                  delete newErrors.email;
                  setFieldErrors(newErrors);
                }
              }}
              className={`h-14 rounded-xl text-lg bg-card border-border/50 shadow-sm ${fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`}
            />
            {fieldErrors.email && <p className="text-[10px] text-red-500 ml-2">{fieldErrors.email}</p>}
          </div>
          <div className="space-y-1">
            <Input 
              type="password"
              placeholder="Password (any)" 
              value={password}
              onChange={e => {
                setPassword(e.target.value);
                if (fieldErrors.password) {
                  const newErrors = { ...fieldErrors };
                  delete newErrors.password;
                  setFieldErrors(newErrors);
                }
              }}
              className={`h-14 rounded-xl text-lg bg-card border-border/50 shadow-sm ${fieldErrors.password ? 'border-red-500 ring-1 ring-red-500' : ''}`}
            />
            {fieldErrors.password && <p className="text-[10px] text-red-500 ml-2">{fieldErrors.password}</p>}
            {errorMsg && <p className="text-xs text-red-500 text-center font-medium mt-2">{errorMsg}</p>}
          </div>
          
          <div className="text-right">
            <span className="text-sm text-primary font-medium cursor-pointer" onClick={() => setIsForgotPassword(true)}>Forgot Password?</span>
          </div>

          <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold mt-4 shadow-lg shadow-primary/25">
            Login
          </Button>
       </form>

       <div className="mt-8 text-center text-sm">
         <span className="text-muted-foreground">Don't have an account? </span>
         <span className="text-primary font-bold cursor-pointer" onClick={() => navigate('/signup')}>Sign Up</span>
       </div>
    </div>
  );
}
