import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/AppContext';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { User, Briefcase, ArrowLeft, Upload, CheckCircle2 } from 'lucide-react';

export default function Signup() {
  const navigate = useNavigate();
  const { setCurrentUser, addWorker, addUser } = useAppContext();
  
  const [step, setStep] = useState(1);
  const [role, setRole] = useState<'user' | 'worker' | null>(null);

  // Common Info
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [cnic, setCnic] = useState('');
  const [address, setAddress] = useState('');
  const [selfie, setSelfie] = useState(false);
  
  // OTP
  const [otp, setOtp] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // Worker Professional Info
  const [skill, setSkill] = useState('');
  const [experience, setExperience] = useState('');
  const [expectedRate, setExpectedRate] = useState('');

  // Legal
  const [acceptTerms, setAcceptTerms] = useState(false);

  const handleNext = () => {
    setErrorMsg('');
    setFieldErrors({});
    setStep(prev => prev + 1);
  };
  const handleBack = () => {
    setErrorMsg('');
    setFieldErrors({});
    setStep(prev => prev - 1);
  };

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault();
    if (!acceptTerms) {
      alert('You must accept the Terms and Conditions.');
      return;
    }

    const newId = role === 'worker' ? `w_${Date.now()}` : `u_${Date.now()}`;
    const newUser = {
      id: newId,
      name: name || 'New User',
      phone,
      email: email || '',
      role: role || 'user',
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random`
    };
    
    // Typically here you would hash the password, save via API, and set auth token.
    setCurrentUser(newUser); // mock login

    if (role === 'worker') {
      const newWorker: any = {
        id: newId,
        name: name || 'New Worker',
        avatar: newUser.avatar,
        category: skill || 'General',
        tags: [skill || 'General'],
        rating: 5.0,
        reviewsCount: 0,
        hourlyRate: expectedRate ? parseInt(expectedRate) || 0 : 0,
        rate: expectedRate ? `Rs. ${expectedRate}` : 'Contact for price',
        distance: 1, // placeholder distance
        available: true,
        verified: false,
        phone,
        email: email || '',
        bio: '',
        gallery: []
      };
      addWorker(newWorker);
      addUser(newUser);
      navigate('/worker-dashboard');
    } else {
      addUser(newUser);
      navigate('/');
    }
  };

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6 slide-in">
          <h2 className="text-2xl font-bold text-center">Join as a Client or Pro</h2>
          <div className="grid grid-cols-2 gap-4">
            <div 
              onClick={() => { setRole('user'); handleNext(); }}
              className="border-2 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-border/50 hover:border-primary/50 text-muted-foreground hover:bg-primary/5"
            >
              <User className="w-10 h-10" />
              <span className="font-semibold text-foreground text-center line-clamp-1">Client (User)</span>
              <p className="text-xs text-center">Hire professionals for your tasks.</p>
            </div>
            <div 
              onClick={() => { setRole('worker'); handleNext(); }}
              className="border-2 rounded-2xl p-6 flex flex-col items-center justify-center gap-3 cursor-pointer transition-all border-border/50 hover:border-primary/50 text-muted-foreground hover:bg-primary/5"
            >
              <Briefcase className="w-10 h-10" />
              <span className="font-semibold text-foreground text-center line-clamp-1">Service Pro</span>
              <p className="text-xs text-center">Offer skills to local clients.</p>
            </div>
          </div>
          <div className="mt-8 text-center text-sm">
             <span className="text-muted-foreground">Already have an account? </span>
             <span className="text-primary font-bold cursor-pointer" onClick={() => navigate('/login')}>Login</span>
          </div>
        </div>
      );
    }

    if (step === 2) {
      // Basic Info (For Both)
      return (
        <div className="space-y-4 slide-in">
          <div className="mb-6">
            <h2 className="text-2xl font-bold">Your Details</h2>
            <p className="text-muted-foreground text-sm">Please provide your basic information.</p>
          </div>
          
          <Input 
            placeholder="Full Name" 
            value={name} 
            onChange={e => setName(e.target.value)} 
            required 
            className={`h-12 rounded-xl ${fieldErrors.name ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
          />
          {fieldErrors.name && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.name}</p>}
          
          <Input 
            placeholder="Email Address" 
            type="email" 
            value={email} 
            onChange={e => setEmail(e.target.value)} 
            required 
            className={`h-12 rounded-xl ${fieldErrors.email ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
          />
          {fieldErrors.email && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.email}</p>}
          
          <Input 
            placeholder="Phone Number" 
            type="tel" 
            value={phone} 
            onChange={e => setPhone(e.target.value)} 
            required 
            className={`h-12 rounded-xl ${fieldErrors.phone ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
          />
          {fieldErrors.phone && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.phone}</p>}
          
          <Input 
            placeholder="Password" 
            type="password" 
            value={password} 
            onChange={e => setPassword(e.target.value)} 
            required 
            className={`h-12 rounded-xl ${fieldErrors.password ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
          />
          {fieldErrors.password && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.password}</p>}
          
          {role === 'user' && (
            <>
              <Input 
                placeholder="CNIC Number (e.g. 12345-1234567-1)" 
                value={cnic} 
                onChange={e => setCnic(e.target.value)} 
                required 
                className={`h-12 rounded-xl ${fieldErrors.cnic ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
              />
              {fieldErrors.cnic && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.cnic}</p>}
              
              <Input 
                placeholder="Complete Address" 
                value={address} 
                onChange={e => setAddress(e.target.value)} 
                required 
                className={`h-12 rounded-xl ${fieldErrors.address ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
              />
              {fieldErrors.address && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.address}</p>}
            </>
          )}

          {errorMsg && <p className="text-sm font-semibold text-red-500 text-center">{errorMsg}</p>}
          
          <Button className="w-full h-14 rounded-xl text-lg font-bold mt-4" onClick={() => {
            const errors: Record<string, string> = {};
            
            if (name.length < 3) errors.name = "Name must be at least 3 characters. Example: Ali Khan";
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = "Invalid email format. Example: ali@email.com";
            if (!/^[0-9]{10,13}$/.test(phone)) errors.phone = "Phone must be 10-13 digits. Example: 03001234567";
            if (password.length < 6) errors.password = "Password must be at least 6 characters. Example: MyPass123";
            
            if (role === 'user') {
               if (!/^[0-9]{5}-[0-9]{7}-[0-9]{1}$/.test(cnic) && cnic.length < 13) {
                 errors.cnic = "Invalid CNIC format. Example: 12345-1234567-1";
               }
               if (address.length <= 5) errors.address = "Address is too short. Example: Street 4, Islamabad";
            }

            if (Object.keys(errors).length > 0) {
               setFieldErrors(errors);
               setErrorMsg("Please fix the highlighted errors above.");
               return;
            }
            
            handleNext(); 
          }}>
            Continue
          </Button>
        </div>
      );
    }

    if (step === 3) {
      // OTP Verification
      return (
        <div className="space-y-4 slide-in">
          <div className="mb-6 text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
               <CheckCircle2 className="w-8 h-8 text-primary" />
            </div>
            <h2 className="text-2xl font-bold">Verify Email</h2>
            <p className="text-muted-foreground text-sm mt-2">We sent a 4-digit code to {email}</p>
          </div>
          <Input 
            placeholder="Enter OTP (e.g. 1234)" 
            type="number" 
            value={otp} 
            onChange={e => setOtp(e.target.value)} 
            className="h-14 text-center tracking-[1em] text-xl font-bold rounded-xl" 
            required 
          />
          {errorMsg && <p className="text-sm font-semibold text-red-500 text-center">{errorMsg}</p>}
          <Button className="w-full h-14 rounded-xl text-lg font-bold mt-4" onClick={() => {
            if(otp === '1234') {
              handleNext();
            } else {
              setErrorMsg("Invalid OTP. The process cannot continue.");
            }
          }}>
            Verify
          </Button>
          <p className="text-xs text-center text-primary font-semibold mt-4 cursor-pointer">Resend OTP</p>
        </div>
      );
    }

    // Step 4 for Worker = Professional Info. For User = Terms.
    if (step === 4) {
      if (role === 'worker') {
        return (
          <div className="space-y-4 slide-in">
            <div className="mb-6">
              <h2 className="text-2xl font-bold">Professional Profile</h2>
              <p className="text-muted-foreground text-sm">Tell clients what you do.</p>
            </div>
            <Label>Category</Label>
            <Input 
              placeholder="e.g. Plumber, Electrician" 
              value={skill} 
              onChange={e => setSkill(e.target.value)} 
              required 
              className={`h-12 rounded-xl ${fieldErrors.skill ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
            />
            {fieldErrors.skill && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.skill}</p>}
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Experience</Label>
                <Input 
                  placeholder="e.g. 5 Years" 
                  value={experience} 
                  onChange={e => setExperience(e.target.value)} 
                  required 
                  className={`h-12 rounded-xl ${fieldErrors.experience ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
                />
                {fieldErrors.experience && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.experience}</p>}
              </div>
              <div className="space-y-2">
                <Label>Expected Rate (Rs)</Label>
                <Input 
                  placeholder="e.g. 1000/hr" 
                  value={expectedRate} 
                  onChange={e => setExpectedRate(e.target.value)} 
                  className={`h-12 rounded-xl ${fieldErrors.rate ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
                />
                {fieldErrors.rate && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.rate}</p>}
              </div>
            </div>

            {errorMsg && <p className="text-sm font-semibold text-red-500 text-center">{errorMsg}</p>}
            <Button className="w-full h-14 rounded-xl text-lg font-bold mt-4" onClick={() => {
               const errors: Record<string, string> = {};
               if (!skill) errors.skill = "Skill category is required. Example: Plumber";
               if (!experience) errors.experience = "Experience is required. Example: 3 Years";
               if (!expectedRate) errors.rate = "Expected rate is required. Example: 1500";

               if (Object.keys(errors).length > 0) {
                 setFieldErrors(errors);
                 setErrorMsg("Please provide your professional details.");
                 return;
               }
               handleNext();
            }}>
              Continue
            </Button>
          </div>
        );
      } else {
        // User Terms
        return renderTerms();
      }
    }

    // Step 5 for Worker = Identity Verification
    if (step === 5 && role === 'worker') {
      return (
        <div className="space-y-5 slide-in">
          <div className="mb-4">
            <h2 className="text-2xl font-bold">Identity Verification</h2>
            <p className="text-muted-foreground text-sm leading-tight mt-1">To ensure platform safety, please provide identity details.</p>
          </div>
          
          <div className="space-y-2">
            <Label>CNIC Number</Label>
            <Input 
              placeholder="XXXXX-XXXXXXX-X" 
              value={cnic} 
              onChange={e => setCnic(e.target.value)} 
              required 
              className={`h-12 rounded-xl ${fieldErrors.cnic ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
            />
            {fieldErrors.cnic && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.cnic}</p>}
          </div>

          <div className="space-y-2">
            <Label>Complete Address (As per CNIC)</Label>
            <Input 
              placeholder="House No, Street, City" 
              value={address} 
              onChange={e => setAddress(e.target.value)} 
              required 
              className={`h-12 rounded-xl ${fieldErrors.address ? 'border-red-500 ring-1 ring-red-500' : ''}`} 
            />
            {fieldErrors.address && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.address}</p>}
          </div>

          <div className="space-y-3">
             <Label>Selfie for Verification</Label>
             <div onClick={() => { setSelfie(true); delete fieldErrors.selfie; setFieldErrors({...fieldErrors}); }} className={`border ${selfie ? 'border-primary bg-primary/10' : (fieldErrors.selfie ? 'border-red-500 bg-red-50 text-red-500' : 'border-dashed border-border bg-secondary/20')} rounded-xl p-4 flex items-center justify-center text-muted-foreground text-sm gap-2 cursor-pointer transition-colors`}>
               {selfie ? <CheckCircle2 className="w-5 h-5 text-primary" /> : <Upload className="w-4 h-4" />} 
               {selfie ? 'Selfie Uploaded' : 'Tap to upload selfie'}
             </div>
             {fieldErrors.selfie && <p className="text-[10px] text-red-500 mt-1 ml-2">{fieldErrors.selfie}</p>}
          </div>
          
          {errorMsg && <p className="text-sm font-semibold text-red-500 text-center">{errorMsg}</p>}

          <Button className="w-full h-14 rounded-xl text-lg font-bold mt-6" onClick={() => {
             const errors: Record<string, string> = {};
             if (cnic.length < 13) errors.cnic = "CNIC must be at least 13 digits. Example: 1234567890123";
             if (address.length <= 5) errors.address = "Detailed address is required. Example: Street 1, Bahria Town, Rawalpindi";
             if (!selfie) errors.selfie = "Please upload a selfie for verification.";

             if (Object.keys(errors).length > 0) {
               setFieldErrors(errors);
               setErrorMsg("Identity verification details are incomplete.");
               return;
             }
             handleNext();
          }}>
            Continue
          </Button>
        </div>
      );
    }

    // Step 6 for Worker = Terms
    if ((step === 6 && role === 'worker') || (step === 4 && role === 'user')) {
      return renderTerms();
    }

    return null;
  };

  const renderTerms = () => (
    <div className="space-y-6 slide-in">
      <div className="mb-2">
        <h2 className="text-2xl font-bold">Almost there</h2>
        <p className="text-muted-foreground text-sm">Please review and accept our policies to create your account.</p>
      </div>

      <div className="bg-secondary/30 p-4 rounded-xl text-xs text-muted-foreground h-32 overflow-y-auto w-full border border-border/50">
        By creating an account, you agree to the Terms of Service and Privacy Policy. 
        Helper is a marketplace connecting independent professionals with clients. 
        Identity verification processes involve processing your personal data securely. 
        Your information is protected via industry-standard encryption and only shared 
        between matching parties to facilitate services.
      </div>
      
      <div className="flex items-start space-x-3 mt-4">
        <Checkbox id="terms" checked={acceptTerms} onCheckedChange={(c) => setAcceptTerms(c as boolean)} className="mt-1" />
        <div className="grid gap-1.5 leading-none">
          <Label htmlFor="terms" className="text-sm font-medium leading-tight">
            I accept the terms and conditions and privacy policy.
          </Label>
          <p className="text-xs text-muted-foreground">
            I understand my data will be securely stored.
          </p>
        </div>
      </div>

      <form onSubmit={handleSignup}>
        <Button type="submit" className="w-full h-14 rounded-xl text-lg font-bold mt-4 shadow-lg shadow-primary/25" disabled={!acceptTerms}>
          Create Account
        </Button>
      </form>
    </div>
  );

  const totalSteps = role === 'worker' ? 6 : (role === 'user' ? 4 : 1);
  const progressPercent = (step / totalSteps) * 100;

  return (
    <div className="flex flex-col min-h-[100dvh] bg-background relative border-x">
      {/* Top Navigation */}
      <div className="p-4 flex items-center justify-between sticky top-0 bg-background/80 backdrop-blur z-10 shrink-0">
         {step > 1 ? (
           <Button variant="ghost" size="icon" onClick={handleBack} className="rounded-full">
             <ArrowLeft className="w-5 h-5" />
           </Button>
         ) : (
           <div className="w-10 h-10"></div>
         )}
         <div className="font-bold">Helper</div>
         <div className="w-10 h-10 flex items-center justify-end">
            {step > 1 && <span className="text-xs font-semibold text-muted-foreground">{step}/{totalSteps}</span>}
         </div>
      </div>

      {/* Progress Bar */}
      {step > 1 && (
        <div className="w-full h-1 bg-secondary/50">
          <div className="h-full bg-primary transition-all duration-300" style={{ width: `${progressPercent}%` }}></div>
        </div>
      )}

      {/* Main Content */}
      <div className="flex-1 p-6 max-w-md mx-auto w-full flex flex-col justify-center pb-12">
         {renderStepContent()}
      </div>
    </div>
  );
}
