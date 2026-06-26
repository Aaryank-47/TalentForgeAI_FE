import { cn } from '../../lib/cn';

interface BadgeProps {
  children: React.ReactNode;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple';
  className?: string;
}

const variants = {
  default: 'bg-slate-100 text-slate-700 border-slate-200',
  success: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  warning: 'bg-amber-50 text-amber-700 border-amber-200',
  danger: 'bg-red-50 text-red-700 border-red-200',
  info: 'bg-primary-50 text-primary-700 border-primary-200',
  purple: 'bg-violet-50 text-violet-700 border-violet-200',
};

export function Badge({ children, variant = 'default', className }: BadgeProps) {
  return (
    <span className={cn('inline-flex items-center text-xs font-semibold px-2 py-0.5 rounded-full border', variants[variant], className)}>
      {children}
    </span>
  );
}
