import { NavLink, useLocation } from 'react-router-dom';
import {
  LayoutDashboard, BarChart3, Users, Bell, Settings,
  LogOut, X, Activity,
} from 'lucide-react';
import { cn } from '@/utils/helpers';
import { useAuth } from '@/hooks/useAuth';
import { useAppSelector } from '@/hooks/redux';
import { selectUnreadCount } from '@/store/slices/notificationSlice';

const NAV = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/analytics',  icon: BarChart3,       label: 'Analytics' },
  { to: '/patients',   icon: Users,           label: 'Patients' },
];

interface SidebarProps {
  open: boolean;
  onClose: () => void;
}

export function Sidebar({ open, onClose }: SidebarProps) {
  const { logout, user } = useAuth();
  const location         = useLocation();
  const unread           = useAppSelector(selectUnreadCount);

  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden" onClick={onClose} />
      )}

      {/* Sidebar panel */}
      <aside
        className={cn(
          'fixed top-0 left-0 h-full w-64 z-50 flex flex-col sidebar-transition',
          'bg-[#0d0d22] border-r border-violet-900/30',
          'lg:translate-x-0',
          open ? 'translate-x-0' : '-translate-x-full lg:translate-x-0',
        )}
      >
        {/* Logo */}
        <div className="flex items-center justify-between px-5 py-5 border-b border-violet-900/20">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-violet-800 flex items-center justify-center">
              <Activity className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="text-sm font-bold text-white tracking-wide">HealthSync</span>
              <span className="text-[10px] text-violet-400 block -mt-0.5">by RagaAI</span>
            </div>
          </div>
          <button onClick={onClose} className="lg:hidden text-slate-500 hover:text-slate-300 transition-colors">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-3 py-4 space-y-1 overflow-y-auto">
          <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-2">
            Main Menu
          </p>
          {NAV.map(({ to, icon: Icon, label }) => (
            <NavLink
              key={to}
              to={to}
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Icon className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300')} />
                  {label}
                </>
              )}
            </NavLink>
          ))}

          <div className="pt-4">
            <p className="text-[10px] font-semibold text-slate-600 uppercase tracking-widest px-3 pb-2">
              System
            </p>
            <NavLink
              to="/notifications"
              onClick={onClose}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150 group',
                  isActive
                    ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/5',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <Bell className={cn('w-4 h-4 flex-shrink-0', isActive ? 'text-violet-400' : 'text-slate-500 group-hover:text-slate-300')} />
                  Notifications
                  {unread > 0 && (
                    <span className="ml-auto bg-violet-600 text-white text-[10px] font-bold w-4.5 h-4.5 rounded-full flex items-center justify-center min-w-[18px] px-1">
                      {unread}
                    </span>
                  )}
                </>
              )}
            </NavLink>
            <button
              onClick={() => { void 0; /* settings placeholder */ }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium',
                'text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all duration-150',
                location.pathname === '/settings' && 'bg-violet-600/20 text-violet-300',
              )}
            >
              <Settings className="w-4 h-4 text-slate-500" />
              Settings
            </button>
          </div>
        </nav>

        {/* User footer */}
        <div className="px-3 py-4 border-t border-violet-900/20">
          <div className="flex items-center gap-3 px-3 py-2.5 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center text-xs font-bold text-white flex-shrink-0">
              {user?.displayName?.[0] ?? user?.email?.[0]?.toUpperCase() ?? 'A'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-200 truncate">{user?.displayName ?? 'Admin'}</p>
              <p className="text-[10px] text-slate-500 truncate">{user?.email}</p>
            </div>
            <button onClick={logout} className="text-slate-500 hover:text-red-400 transition-colors" title="Sign out">
              <LogOut className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  );
}
