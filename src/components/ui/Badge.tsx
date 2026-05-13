import { cn } from '@/lib/utils/cn'

interface BadgeProps {
  label: string
  variant?: 'open' | 'closed' | 'in-progress' | 'pending' | 'resolved' | 'critical' | 'high' | 'medium' | 'low' | 'primary'
  className?: string
}

const variants = {
  open: 'bg-emerald-100 text-emerald-700 border-emerald-200',
  closed: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  'in-progress': 'bg-primary-100 text-primary-700 border-primary-200',
  pending: 'bg-amber-100 text-amber-700 border-amber-200',
  resolved: 'bg-indigo-100 text-indigo-700 border-indigo-200',
  critical: 'bg-rose-100 text-rose-700 border-rose-200 font-semibold animate-pulse',
  high: 'bg-orange-100 text-orange-700 border-orange-200',
  medium: 'bg-yellow-100 text-yellow-700 border-yellow-200',
  low: 'bg-neutral-100 text-neutral-600 border-neutral-200',
  primary: 'bg-primary-soft text-primary border-primary-200',
}

export function Badge({ label, variant = 'open', className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium border capitalize',
        variants[variant] || variants.open,
        className
      )}
    >
      {label.replace('-', ' ')}
    </span>
  )
}
