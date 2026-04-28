import { forwardRef, type InputHTMLAttributes, type ReactNode } from 'react';
import { cn } from '@/utils/helpers';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  rightElement?: ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, rightElement, className, id, ...rest }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-');

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-300">
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={cn(
              'w-full bg-white/5 border rounded-lg text-slate-200 placeholder-slate-500 text-sm',
              'py-2.5 transition-all duration-200',
              'focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/60',
              'hover:border-white/20',
              icon ? 'pl-10 pr-4' : 'px-4',
              rightElement ? 'pr-12' : '',
              error
                ? 'border-red-500/50 focus:ring-red-500/30 focus:border-red-500/60'
                : 'border-white/10',
              className,
            )}
            {...rest}
          />
          {rightElement && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2">{rightElement}</span>
          )}
        </div>
        {error && <p className="text-xs text-red-400 flex items-center gap-1">{error}</p>}
      </div>
    );
  },
);

Input.displayName = 'Input';
