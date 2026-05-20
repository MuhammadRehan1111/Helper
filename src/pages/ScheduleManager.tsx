import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar as CalendarIcon, Clock, Check, Plus, Trash2, ShieldCheck } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useAppContext } from '@/lib/AppContext';

interface DaySchedule {
  day: string;
  active: boolean;
  start: string;
  end: string;
}

export default function ScheduleManager() {
  const navigate = useNavigate();
  const { showToast } = useAppContext();

  const defaultSchedule: DaySchedule[] = [
    { day: 'Monday', active: true, start: '09:00', end: '18:00' },
    { day: 'Tuesday', active: true, start: '09:00', end: '18:00' },
    { day: 'Wednesday', active: true, start: '09:00', end: '18:00' },
    { day: 'Thursday', active: true, start: '09:00', end: '18:00' },
    { day: 'Friday', active: true, start: '09:00', end: '17:00' },
    { day: 'Saturday', active: false, start: '10:00', end: '16:00' },
    { day: 'Sunday', active: false, start: '10:00', end: '16:00' },
  ];

  const [schedule, setSchedule] = useState<DaySchedule[]>(() => {
    const saved = localStorage.getItem('helper_worker_schedule');
    return saved ? JSON.parse(saved) : defaultSchedule;
  });

  const [blockedDates, setBlockedDates] = useState<string[]>(() => {
    const saved = localStorage.getItem('helper_worker_blocked_dates');
    return saved ? JSON.parse(saved) : ['2026-05-28', '2026-06-15']; // Default mock blocked holidays
  });

  const [newBlockedDate, setNewBlockedDate] = useState('');

  const handleBack = () => {
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/profile');
    }
  };

  const handleToggleDay = (index: number) => {
    setSchedule(prev => prev.map((item, idx) => 
      idx === index ? { ...item, active: !item.active } : item
    ));
  };

  const handleChangeTime = (index: number, type: 'start' | 'end', val: string) => {
    setSchedule(prev => prev.map((item, idx) => 
      idx === index ? { ...item, [type]: val } : item
    ));
  };

  const handleAddBlockedDate = () => {
    if (!newBlockedDate) return;
    if (blockedDates.includes(newBlockedDate)) {
      showToast("Date already blocked", "warning");
      return;
    }
    setBlockedDates(prev => [...prev, newBlockedDate].sort());
    setNewBlockedDate('');
    showToast("Holiday date added!", "success");
  };

  const handleRemoveBlockedDate = (date: string) => {
    setBlockedDates(prev => prev.filter(d => d !== date));
    showToast("Date unblocked", "info");
  };

  const handleSave = () => {
    localStorage.setItem('helper_worker_schedule', JSON.stringify(schedule));
    localStorage.setItem('helper_worker_blocked_dates', JSON.stringify(blockedDates));
    showToast("Schedule updated successfully!", "success");
    handleBack();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background text-foreground font-sans">
      <header className="px-4 py-4 flex items-center justify-between bg-card border-b sticky top-0 z-10">
        <div className="flex items-center gap-4">
          <button onClick={handleBack} className="p-2 hover:bg-secondary rounded-full transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </button>
          <h1 className="text-xl font-bold">Schedule & Availability</h1>
        </div>
        <Button onClick={handleSave} size="sm" className="font-bold bg-primary text-primary-foreground hover:bg-primary/95 rounded-xl px-4">
          Save
        </Button>
      </header>

      <main className="flex-1 overflow-y-auto p-4 space-y-6">
        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <Clock className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Weekly Work Hours</h2>
          </div>
          <div className="space-y-3">
            {schedule.map((item, idx) => (
              <div key={item.day} className={`p-4 bg-card rounded-2xl border transition-all ${item.active ? 'border-primary/20 shadow-sm' : 'border-border/40 opacity-70'}`}>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-bold text-base">{item.day}</span>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground font-bold">{item.active ? 'Available' : 'Unavailable'}</span>
                    <Switch checked={item.active} onCheckedChange={() => handleToggleDay(idx)} />
                  </div>
                </div>
                {item.active && (
                  <div className="flex items-center gap-3 slide-in">
                    <div className="flex-1">
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">Start Time</label>
                      <input 
                        type="time" 
                        value={item.start} 
                        onChange={e => handleChangeTime(idx, 'start', e.target.value)} 
                        className="w-full bg-secondary/50 rounded-xl px-3 py-2 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
                      />
                    </div>
                    <div className="text-muted-foreground pt-4 text-xs font-bold">to</div>
                    <div className="flex-1">
                      <label className="text-[10px] text-muted-foreground font-bold uppercase block mb-1">End Time</label>
                      <input 
                        type="time" 
                        value={item.end} 
                        onChange={e => handleChangeTime(idx, 'end', e.target.value)} 
                        className="w-full bg-secondary/50 rounded-xl px-3 py-2 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        </section>

        <section>
          <div className="flex items-center gap-2 mb-4 px-2">
            <CalendarIcon className="w-5 h-5 text-primary" />
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">Block Custom Dates (Holidays)</h2>
          </div>
          <div className="bg-card rounded-2xl border border-border/50 p-4 shadow-sm space-y-4">
            <div className="flex gap-2">
              <input 
                type="date" 
                value={newBlockedDate} 
                onChange={e => setNewBlockedDate(e.target.value)}
                className="flex-1 bg-secondary/50 rounded-xl px-3 py-2 text-sm font-semibold border border-border/50 outline-none focus:border-primary"
              />
              <Button onClick={handleAddBlockedDate} className="bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl px-4">
                <Plus className="w-5 h-5 mr-1" /> Add
              </Button>
            </div>
            
            {blockedDates.length > 0 ? (
              <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                {blockedDates.map(date => (
                  <div key={date} className="flex items-center justify-between p-3 bg-secondary/40 rounded-xl border border-border/30">
                    <span className="text-sm font-bold text-slate-700">
                      {new Date(date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                    <button 
                      onClick={() => handleRemoveBlockedDate(date)} 
                      className="p-1 text-muted-foreground hover:text-destructive transition-colors"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground text-center py-4">No blocked dates. You are available standard days.</p>
            )}
          </div>
        </section>

        <div className="text-center pt-2 pb-6">
          <div className="flex items-center justify-center gap-2 mb-1">
            <ShieldCheck className="w-4 h-4 text-green-600" />
            <span className="text-xs font-bold text-muted-foreground">Synchronized with Booking Engine</span>
          </div>
        </div>
      </main>
    </div>
  );
}
