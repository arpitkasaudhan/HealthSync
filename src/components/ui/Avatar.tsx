import { cn, avatarColor } from '@/utils/helpers';

interface AvatarProps {
  initials: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
}

export function Avatar({ initials, size = 'md', className }: AvatarProps) {
  const sizes = {
    sm:  'w-7 h-7 text-xs',
    md:  'w-9 h-9 text-sm',
    lg:  'w-11 h-11 text-base',
    xl:  'w-14 h-14 text-lg',
  };

  return (
    <div
      className={cn(
        'rounded-full flex items-center justify-center font-semibold text-white flex-shrink-0 bg-gradient-to-br',
        avatarColor(initials),
        sizes[size],
        className,
      )}
    >
      {initials}
    </div>
  );
}
