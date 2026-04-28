import { AlertOctagon, AlertTriangle, CheckCircle, Info, CheckCheck, Bell } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import {
  selectNotifications, selectUnreadCount,
  markRead, markAllRead,
} from '@/store/slices/notificationSlice';
import { cn, notificationColor, formatDateTime } from '@/utils/helpers';
import { Button } from '@/components/ui/Button';
import type { Notification } from '@/types';

const ICONS: Record<Notification['type'], React.ReactNode> = {
  critical: <AlertOctagon  className="w-4 h-4" />,
  warning:  <AlertTriangle className="w-4 h-4" />,
  success:  <CheckCircle   className="w-4 h-4" />,
  info:     <Info          className="w-4 h-4" />,
};

export function NotificationsPage() {
  const dispatch      = useAppDispatch();
  const notifications = useAppSelector(selectNotifications);
  const unread        = useAppSelector(selectUnreadCount);

  return (
    <div className="space-y-5 fade-in max-w-2xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-100">Notifications</h2>
          <p className="text-xs text-slate-500 mt-0.5">{unread} unread</p>
        </div>
        {unread > 0 && (
          <Button variant="outline" size="sm" onClick={() => dispatch(markAllRead())}>
            <CheckCheck className="w-3.5 h-3.5" />
            Mark all read
          </Button>
        )}
      </div>

      <div className="glass rounded-xl overflow-hidden divide-y divide-white/5">
        {notifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-slate-500 gap-3">
            <Bell className="w-8 h-8 opacity-30" />
            <p className="text-sm">No notifications yet</p>
          </div>
        ) : (
          notifications.map((n) => (
            <button
              key={n.id}
              onClick={() => dispatch(markRead(n.id))}
              className={cn(
                'w-full text-left px-5 py-4 flex items-start gap-4 transition-colors',
                !n.read ? 'hover:bg-violet-500/5' : 'hover:bg-white/3 opacity-70',
              )}
            >
              <span className={cn('mt-0.5 p-2 rounded-lg border shrink-0', notificationColor(n.type))}>
                {ICONS[n.type]}
              </span>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <p className={cn('text-sm font-semibold', !n.read ? 'text-slate-100' : 'text-slate-400')}>
                    {n.title}
                  </p>
                  {!n.read && (
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400 shrink-0" />
                  )}
                </div>
                <p className="text-xs text-slate-500 mt-1 leading-relaxed">{n.message}</p>
                <p className="text-xs text-slate-600 mt-1.5">{formatDateTime(n.timestamp)}</p>
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
}
