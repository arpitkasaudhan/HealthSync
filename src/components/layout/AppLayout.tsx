import { useState } from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAppSelector } from '@/hooks/redux';
import { Sidebar } from './Sidebar';
import { Topbar } from './Topbar';
import { NotificationPanel } from './NotificationPanel';
import { ToastContainer } from '@/components/ui/Toast';
import { useNotifications } from '@/hooks/useNotifications';

export function AppLayout() {
  const user          = useAppSelector((s) => s.auth.user);
  const [sideOpen, setSideOpen] = useState(false);

  useNotifications();

  if (!user) return <Navigate to="/login" replace />;

  return (
    <div className="flex h-screen overflow-hidden bg-[#0b0b1a]">
      <Sidebar open={sideOpen} onClose={() => setSideOpen(false)} />

      {/* Main content — offset by sidebar width on large screens */}
      <div className="flex flex-col flex-1 lg:ml-64 min-w-0">
        <Topbar onMenuClick={() => setSideOpen(true)} />
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          <Outlet />
        </main>
      </div>

      <NotificationPanel />
      <ToastContainer />
    </div>
  );
}
