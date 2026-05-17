'use client'

import { cn } from '@/lib/utils/cn'
import { Loader2 } from 'lucide-react'

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'ghost' | 'outline' | 'danger'
  size?: 'sm' | 'md' | 'lg'
  loading?: boolean
}

export function Button({ variant = 'primary', size = 'md', loading, className, children, disabled, ...props }: ButtonProps) {
  return (
    <button
      suppressHydrationWarning
      disabled={disabled || loading}
      className={cn(
        'inline-flex items-center justify-center font-medium rounded-full transition-all duration-300 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed',
        variant === 'primary' && 'bg-gradient-to-r from-primary to-primary-400 text-white hover:shadow-lg hover:shadow-primary/30 hover:-translate-y-0.5 active:scale-95',
        variant === 'ghost'   && 'bg-transparent text-neutral-800 hover:bg-primary-soft hover:text-primary active:scale-95',
        variant === 'outline' && 'border-2 border-neutral-200 bg-neutral-100 text-neutral-800 hover:border-primary hover:text-primary hover:-translate-y-0.5 hover:shadow-sm active:scale-95',
        variant === 'danger'  && 'bg-red-400 text-neutral-900 hover:bg-red-500 hover:shadow-md hover:-translate-y-0.5 active:scale-95',
        size === 'sm' && 'text-xs px-4 py-2 gap-1.5',
        size === 'md' && 'text-sm px-6 py-2.5 gap-2',
        size === 'lg' && 'text-base px-8 py-3.5 gap-2.5',
        className
      )}
      {...props}
    >
      {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : children}
    </button>
  )
}
