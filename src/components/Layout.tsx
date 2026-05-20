import { Outlet, NavLink } from 'react-router-dom';
import { Home, Search, Briefcase, MessageSquare, User, LayoutDashboard, ClipboardList } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAppContext } from '@/lib/AppContext';
import Toast from './Toast';

export default function Layout() {
  const { currentUser } = useAppContext();
  
  const userNavItems = [
    { to: '/', icon: Home, label: 'Home' },
    { to: '/search', icon: Search, label: 'Search' },
    { to: '/jobs', icon: Briefcase, label: 'Jobs' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const workerNavItems = [
    { to: '/worker-dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { to: '/worker-requests', icon: ClipboardList, label: 'Requests' },
    { to: '/jobs', icon: Briefcase, label: 'My Jobs' },
    { to: '/messages', icon: MessageSquare, label: 'Messages' },
    { to: '/profile', icon: User, label: 'Profile' },
  ];

  const navItems = currentUser?.role === 'worker' ? workerNavItems : userNavItems;

  return (
    <div className="flex flex-col h-[100dvh] bg-slate-100 text-foreground overflow-hidden font-sans relative border-x">
      <Toast />
      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto w-full relative bg-card/30 scrollbar-hide">
        <Outlet />
      </main>

      {/* Bottom Navigation */}
      <nav className="w-full bg-card/80 backdrop-blur-xl border-t border-border/50 pb-safe z-50">
        <ul className="flex items-center justify-between px-2 py-3">
          {navItems.map((item) => (
            <li key={item.to} className="flex-1">
              <NavLink
                to={item.to}
                className={({ isActive }) =>
                  cn(
                    "flex flex-col items-center justify-center gap-1 text-[10px] font-bold transition-all duration-300 hover:text-primary",
                    isActive ? "text-primary scale-110" : "text-muted-foreground opacity-70"
                  )
                }
              >
                <div className={cn(
                  "p-2 rounded-xl transition-all duration-300",
                  "group-hover:bg-primary/10"
                )}>
                  <item.icon className="h-5 w-5" />
                </div>
                <span>{item.label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
