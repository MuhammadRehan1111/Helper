import React, { useState, useRef, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppContext } from '@/lib/AppContext';
import { ArrowLeft, Send, Phone, MoreVertical, Image as ImageIcon, Mic, MapPin, Check, CheckCheck } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface Message {
  id: string;
  senderId: string;
  text?: string;
  voiceUrl?: string; // Mock voice note
  duration?: string;
  time: string;
  status?: 'sent' | 'delivered' | 'read';
  type: 'text' | 'voice';
}

export default function ChatRoom() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { workers, users, currentUser } = useAppContext();
  
  const partner = currentUser?.role === 'worker' 
    ? users.find(u => u.id === id) 
    : workers.find(w => w.id === id);

  const [messages, setMessages] = useState<Message[]>([
    { id: '1', senderId: id || '', text: 'Hello! I saw your job request.', time: '10:00 AM', status: 'read', type: 'text' },
    { id: '2', senderId: currentUser?.id || '', text: 'Yes, I need someone to fix the wiring today.', time: '10:05 AM', status: 'read', type: 'text' },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [isRecordingVoice, setIsRecordingVoice] = useState(false);
  const [recordingDuration, setRecordingDuration] = useState(0);
  const recognitionRef = useRef<any>(null);
  const recordingIntervalRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const startVoiceRecording = () => {
    setIsRecordingVoice(true);
    setRecordingDuration(0);
    recordingIntervalRef.current = setInterval(() => {
      setRecordingDuration(prev => prev + 1);
    }, 1000);
  };

  const stopVoiceRecording = () => {
    setIsRecordingVoice(false);
    clearInterval(recordingIntervalRef.current);
    
    if (recordingDuration < 1) return;

    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser?.id || '',
      voiceUrl: '#', 
      duration: `${Math.floor(recordingDuration / 60)}:${(recordingDuration % 60).toString().padStart(2, '0')}`,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: 'voice'
    };
    
    setMessages(prev => [...prev, newMsg]);
    
    // Auto reply for voice
    setTimeout(() => {
      setIsTyping(true);
    }, 1000);
    
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: partner?.id || '',
        text: "Got it, I'll be there soon.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        type: 'text'
      }]);
    }, 3000);
  };

  const startListening = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Voice messaging not supported in this browser.");
      return;
    }

    if (isListening && recognitionRef.current) {
      recognitionRef.current.stop();
      setIsListening(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.lang = 'en-US'; 
      recognition.continuous = false;
      recognition.interimResults = false;

      recognition.onstart = () => {
        setIsListening(true);
      };
      
      recognition.onerror = (event: any) => {
        console.error('Speech recognition error:', event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        recognitionRef.current = null;
      };

      recognition.onresult = (event: any) => {
        const transcript = event.results[0][0].transcript;
        setInputText(transcript);
        
        // Auto send if long enough
        if (transcript.length > 5) {
          setTimeout(() => {
            handleSend({ preventDefault: () => {} } as React.FormEvent);
          }, 800);
        }
      };

      recognition.start();
    } catch (err) {
      console.error('Speech start error:', err);
      setIsListening(false);
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/');
    }
  };

  if (!partner) return <div className="p-8 text-center text-muted-foreground flex flex-col items-center justify-center min-h-[100dvh]">
    <div className="text-xl font-bold text-foreground">User not found</div>
    <div className="mt-4">
      <Button onClick={handleBack}>Go Back</Button>
    </div>
  </div>;

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || !currentUser) return;
    
    const newMsg: Message = {
      id: Date.now().toString(),
      senderId: currentUser.id,
      text: inputText,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
      type: 'text'
    };
    
    setMessages(prev => [...prev, newMsg]);
    setInputText('');
    
    // Simulate delivered then read
    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'delivered' } : m));
    }, 800);

    setTimeout(() => {
      setMessages(prev => prev.map(m => m.id === newMsg.id ? { ...m, status: 'read' } : m));
      setIsTyping(true);
    }, 1500);

    // Simulate auto-reply
    setTimeout(() => {
      setIsTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        senderId: partner.id,
        text: "I can reach your location in 30 minutes. Let's fix the rate.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        status: 'read',
        type: 'text'
      }]);
    }, 3500);
  };

  const MessageTicks = ({ status }: { status?: string }) => {
    if (!status) return null;
    if (status === 'sent') return <Check className="w-3 h-3 text-muted-foreground/50 ml-1" />;
    if (status === 'delivered') return <CheckCheck className="w-3 h-3 text-muted-foreground/50 ml-1" />;
    return <CheckCheck className="w-3 h-3 text-blue-400 ml-1" />; // Read
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-background w-full relative bg-card/30">
      <header className="px-3 py-3 flex items-center justify-between bg-card border-b sticky top-0 z-10">
         <div className="flex items-center gap-3">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full" onClick={handleBack}>
              <ArrowLeft className="w-5 h-5" />
           </Button>
           <div className="flex items-center gap-2 cursor-pointer" onClick={() => currentUser?.role === 'user' ? navigate(`/worker/${partner.id}`) : undefined}>
             <Avatar className="h-9 w-9">
               <AvatarImage src={partner.avatar} />
               <AvatarFallback>{partner.name[0]}</AvatarFallback>
             </Avatar>
             <div>
               <div className="font-semibold text-sm">{partner.name}</div>
               <div className="text-[10px] text-green-500 font-medium">Online</div>
             </div>
           </div>
         </div>
         <div className="flex items-center gap-1">
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <Phone className="w-4 h-4" />
           </Button>
           <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
              <MoreVertical className="w-4 h-4" />
           </Button>
         </div>
       </header>

       <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/10 relative">
         <div className="text-center text-xs text-muted-foreground my-4 bg-secondary/50 inline-block px-3 py-1 rounded-full mx-auto flex w-max">Today</div>
         
         {messages.map(msg => {
            const isMe = msg.senderId === currentUser?.id;
            return (
              <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                <div className={`max-w-[75%] rounded-2xl px-4 py-2 relative ${
                  isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-card border border-border/50 text-card-foreground rounded-tl-sm shadow-sm'
                }`}>
                  {msg.type === 'text' ? (
                    <p className="text-[15px] leading-relaxed">{msg.text}</p>
                  ) : (
                    <div className="flex items-center gap-3 py-1 min-w-[140px]">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center ${isMe ? 'bg-white/20' : 'bg-primary/10'}`}>
                        <Mic className={`w-4 h-4 ${isMe ? 'text-white' : 'text-primary'}`} />
                      </div>
                      <div className="flex flex-col gap-1 flex-1">
                        <div className={`h-1 w-full rounded-full overflow-hidden ${isMe ? 'bg-white/20' : 'bg-slate-200'}`}>
                           <div className={`h-full rounded-full ${isMe ? 'bg-white' : 'bg-primary'}`} style={{ width: '40%' }}></div>
                        </div>
                        <span className={`text-[9px] ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.duration}</span>
                      </div>
                    </div>
                  )}
                  <div className="flex items-center justify-end mt-1 gap-1">
                    <span className={`text-[9px] ${isMe ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{msg.time}</span>
                    {isMe && <MessageTicks status={msg.status} />}
                  </div>
                </div>
              </div>
            );
          })}
         
         {isTyping && (
           <div className="flex flex-col items-start">
              <div className="bg-card border border-border/50 rounded-2xl px-4 py-3 rounded-tl-sm shadow-sm flex items-center gap-1">
                 <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce"></div>
                 <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce delay-75"></div>
                 <div className="w-1.5 h-1.5 bg-muted-foreground/50 rounded-full animate-bounce delay-150"></div>
              </div>
              <span className="text-[10px] text-muted-foreground mt-1 mx-1">{partner.name} is typing...</span>
           </div>
         )}
         <div ref={messagesEndRef} />
       </div>

       <div className="px-3 py-3 bg-card border-t shrink-0 shadow-[0_-10px_20px_rgba(0,0,0,0.02)]">
         {!isRecordingVoice ? (
           <div className="flex gap-2 mb-2 px-1">
              <button className="flex items-center gap-1 bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-1 rounded-full">
                <ImageIcon className="w-3 h-3" /> Image
              </button>
              <button className="flex items-center gap-1 bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-1 rounded-full">
                <MapPin className="w-3 h-3" /> Location
              </button>
              <button 
                 onClick={startVoiceRecording}
                 className="flex items-center gap-1 bg-secondary text-secondary-foreground text-[10px] font-semibold px-2 py-1 rounded-full"
               >
                 <Mic className="w-3 h-3" /> Voice Note
              </button>
           </div>
         ) : (
           <div className="flex items-center justify-between mb-2 px-3 py-2 bg-red-50 text-red-500 rounded-2xl border border-red-100 animate-pulse">
              <div className="flex items-center gap-2">
                <Mic className="w-4 h-4" />
                <span className="text-xs font-bold tracking-widest">RECORDING... {recordingDuration}s</span>
              </div>
              <button onClick={stopVoiceRecording} className="text-[10px] font-black uppercase text-red-600 bg-red-100 px-3 py-1 rounded-full">Finish</button>
           </div>
         )}
         
         <div className="flex items-center gap-2 max-w-full">
            <form onSubmit={handleSend} className="flex-1 flex items-center gap-2 relative border border-border/50 rounded-full bg-secondary/30 p-1">
              <Input 
                value={inputText}
                onChange={e => setInputText(e.target.value)}
                placeholder={isListening ? "Listening..." : "Write a message..."}
                className="border-transparent bg-transparent shadow-none focus-visible:ring-0 px-3 h-10 w-full"
              />
              {inputText.trim() ? (
                 <Button type="submit" size="icon" className="shrink-0 rounded-full h-10 w-10 bg-primary absolute right-1">
                   <Send className="w-4 h-4 ml-[-2px]" />
                 </Button>
              ) : (
                 <Button 
                   type="button" 
                   onClick={isRecordingVoice ? stopVoiceRecording : startVoiceRecording}
                   size="icon" 
                   variant="secondary" 
                   className={`shrink-0 rounded-full h-10 w-10 absolute right-1 transition-all ${
                     isRecordingVoice ? 'bg-red-500 text-white hover:bg-red-600 scale-110' : 'hover:bg-secondary'
                   }`}
                 >
                   <Mic className="w-4 h-4" />
                 </Button>
              )}
            </form>
         </div>
       </div>
    </div>
  );
}
