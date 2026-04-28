import { X, Bell, CheckCheck, AlertOctagon, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  selectNotifications, selectPanelOpen, selectUnreadCount,
  setPanelOpen, markRead, markAllRead,
} from '@/store/slices/notificationSlice';
import { cn, formatRelativeTime, notificationColor } from '@/utils/helpers';
import type { Notification } from '@/types';

const ICON_MAP: Record<Notification['type'], React.ReactNode> = {
  critical: <AlertOctagon  className="w-3.5 h-3.5" />,
  warning:  <AlertTriangle className="w-3.5 h-3.5" />,
  success:  <CheckCircle   className="w-3.5 h-3.5" />,
  info:     <Info          className="w-3.5 h-3.5" />,
};

export function NotificationPanel() {
  const dispatch       = useAppDispatch();
  const open           = useAppSelector(selectPanelOpen);
  const notifications  = useAppSelector(selectNotifications);
  const unread         = useAppSelector(selectUnreadCount);

  if (!open) return null;

  return (
    <>
      <div className="fixed inset-0 z-[60]" onClick={() => dispatch(setPanelOpen(false))} />
      <div className="fixed top-0 right-0 h-full w-80 max-w-full z-[70] flex flex-col bg-[#0d0d22] border-l border-violet-900/30 shadow-2xl fade-in">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-violet-900/20">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4 text-violet-400" />
            <span className="font-semibold text-slate-100 text-sm">Notifications</span>
            {unread > 0 && (
              <span className="bg-violet-600 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                {unread}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            {unread > 0 && (
              <button
                onClick={() => dispatch(markAllRead())}
                className="text-xs text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors"
              >
                <CheckCheck className="w-3 h-3" />
                Mark all read
              </button>
            )}
            <button onClick={() => dispatch(setPanelOpen(false))} className="text-slate-500 hover:text-slate-300 transition-colors p-1 rounded">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* List */}
        <div className="flex-1 overflow-y-auto divide-y divide-white/5">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-48 text-slate-500 gap-3">
              <Bell className="w-8 h-8 opacity-30" />
              <p className="text-sm">All caught up!</p>
            </div>
          ) : (
            notifications.map((n) => (
              <button
                key={n.id}
                className={cn(
                  'w-full text-left px-5 py-4 hover:bg-white/4 transition-colors',
                  !n.read && 'bg-violet-500/5',
                )}
                onClick={() => dispatch(markRead(n.id))}
              >
                <div className="flex items-start gap-3">
                  <span className={cn('mt-0.5 p-1.5 rounded-md border', notificationColor(n.type))}>
                    {ICON_MAP[n.type]}
                  </span>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <p className={cn('text-xs font-semibold', !n.read ? 'text-slate-100' : 'text-slate-400')}>
                        {n.title}
                      </p>
                      {!n.read && <span className="w-1.5 h-1.5 rounded-full bg-violet-400 flex-shrink-0" />}
                    </div>
                    <p className="text-xs text-slate-500 mt-0.5 leading-relaxed">{n.message}</p>
                    <p className="text-[10px] text-slate-600 mt-1">{formatRelativeTime(n.timestamp)}</p>
                  </div>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </>
  );
}
