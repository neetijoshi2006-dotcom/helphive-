'use client'

import { cn } from '@/lib/utils/cn'

interface CardProps {
  children: React.ReactNode
  className?: string
  variant?: 'default' | 'dark' | 'glass' | 'primary'
}

export function Card({ children, className, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-[24px] p-5 transition-all duration-300',
        variant === 'default' && 'bg-neutral-100 border border-neutral-100 shadow-sm hover:shadow-md hover:border-primary-100',
        variant === 'dark'    && 'bg-surface-dark border border-surface-dark-border text-neutral-900',
        variant === 'glass'   && 'bg-neutral-100/60 backdrop-blur-xl border border-neutral-200/40 shadow-sm',
        variant === 'primary'    && 'bg-gradient-to-br from-primary-soft to-white border border-primary-100 shadow-sm',
        className
      )}
    >
      {children}
    </div>
  )
}
