import { cn } from '@/utils/helpers';
import type { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  className?: string;
  dot?: boolean;
}

export function Badge({ children, className, dot }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center gap-1.5 text-xs font-medium px-2.5 py-0.5 rounded-full border', className)}>
      {dot && <span className="w-1.5 h-1.5 rounded-full bg-current pulse-dot" />}
      {children}
    </span>
  );
}
