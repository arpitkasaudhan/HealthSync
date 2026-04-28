import { X, CheckCircle, AlertTriangle, Info, AlertOctagon } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/hooks/redux';
import { selectToasts, startDismissToast, removeToast } from '@/store/slices/notificationSlice';
import { cn } from '@/utils/helpers';
import type { ToastItem } from '@/store/slices/notificationSlice';

const ICONS: Record<ToastItem['type'], React.ReactNode> = {
  success:  <CheckCircle  className="w-4 h-4 text-emerald-400 flex-shrink-0" />,
  warning:  <AlertTriangle className="w-4 h-4 text-amber-400  flex-shrink-0" />,
  info:     <Info          className="w-4 h-4 text-blue-400   flex-shrink-0" />,
  critical: <AlertOctagon  className="w-4 h-4 text-red-400    flex-shrink-0" />,
};

const BORDERS: Record<ToastItem['type'], string> = {
  success:  'border-l-emerald-500',
  warning:  'border-l-amber-500',
  info:     'border-l-blue-500',
  critical: 'border-l-red-500',
};

export function ToastContainer() {
  const dispatch = useAppDispatch();
  const toasts   = useAppSelector(selectToasts);

  function dismiss(id: string) {
    dispatch(startDismissToast(id));
    setTimeout(() => dispatch(removeToast(id)), 350);
  }

  return (
    <div className="fixed bottom-5 right-5 z-[200] flex flex-col gap-2 w-80 max-w-[calc(100vw-2rem)]">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            'glass rounded-lg px-4 py-3 flex items-start gap-3 border-l-2 shadow-xl',
            BORDERS[t.type],
            t.exiting ? 'toast-exit' : 'toast-enter',
          )}
        >
          {ICONS[t.type]}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-100">{t.title}</p>
            <p className="text-xs text-slate-400 mt-0.5 leading-snug">{t.message}</p>
          </div>
          <button onClick={() => dismiss(t.id)} className="text-slate-500 hover:text-slate-300 mt-0.5 flex-shrink-0 transition-colors">
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}
    </div>
  );
}
