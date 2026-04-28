import { Menu, Bell, Search } from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectUnreadCount, setPanelOpen } from '@/store/slices/notificationSlice';

const TITLES: Record<string, string> = {
  '/dashboard':     'Dashboard',
  '/analytics':     'Analytics',
  '/patients':      'Patients',
  '/notifications': 'Notifications',
};

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const unread   = useAppSelector(selectUnreadCount);

  const title = TITLES[location.pathname] ?? 'HealthSync';

  return (
    <header className="h-14 flex items-center justify-between px-4 lg:px-6 border-b border-violet-900/20 bg-[#0d0d22]/80 backdrop-blur-sm sticky top-0 z-30">
      <div className="flex items-center gap-3">
        <button
          onClick={onMenuClick}
          className="lg:hidden text-slate-400 hover:text-slate-200 transition-colors p-1.5 rounded-lg hover:bg-white/8"
        >
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-semibold text-slate-100">{title}</h1>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={() => navigate('/patients')}
          className="hidden sm:flex items-center gap-2 text-xs text-slate-500 hover:text-slate-300 bg-white/5 hover:bg-white/8 border border-white/8 px-3 py-1.5 rounded-lg transition-all"
        >
          <Search className="w-3.5 h-3.5" />
          Search patients…
          <kbd className="text-[10px] bg-white/5 px-1.5 py-0.5 rounded border border-white/10 ml-1">⌘K</kbd>
        </button>

        <button
          onClick={() => dispatch(setPanelOpen(true))}
          className="relative p-2 text-slate-400 hover:text-slate-200 hover:bg-white/8 rounded-lg transition-all"
          title="Notifications"
        >
          <Bell className="w-4.5 h-4.5" />
          {unread > 0 && (
            <span className="absolute top-1 right-1 w-2 h-2 bg-violet-500 rounded-full border border-[#0d0d22]" />
          )}
        </button>
      </div>
    </header>
  );
}
