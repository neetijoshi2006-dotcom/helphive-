'use client'

import { cn } from '@/lib/utils/cn'
import { forwardRef } from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

export const Input = forwardRef<HTMLInputElement, InputProps>(({ className, label, error, id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-medium text-neutral-800">
          {label}
        </label>
      )}
      <input
        id={id}
        ref={ref}
        suppressHydrationWarning
        className={cn(
          'w-full px-5 py-3 rounded-2xl border-2 border-neutral-200 bg-white text-sm text-neutral-900',
          'placeholder:text-neutral-400 transition-all duration-300',
          'focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(109,40,217,0.15)] hover:border-primary-300',
          error && 'border-red-300 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.15)] focus:border-red-400 hover:border-red-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500 font-medium pl-1">{error}</p>}
    </div>
  )
})

Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(({ className, label, error, id, ...props }, ref) => {
  return (
    <div className="flex flex-col gap-1.5">
      {label && (
        <label htmlFor={id} className="text-sm font-semibold text-neutral-800 ml-1">
          {label}
        </label>
      )}
      <textarea
        id={id}
        ref={ref}
        className={cn(
          'w-full px-5 py-3 rounded-2xl border-2 border-neutral-200 bg-white text-sm text-neutral-900 resize-none',
          'placeholder:text-neutral-400 transition-all duration-300',
          'focus:outline-none focus:border-primary focus:shadow-[0_0_0_4px_rgba(109,40,217,0.15)] hover:border-primary-300',
          error && 'border-red-300 focus:shadow-[0_0_0_4px_rgba(248,113,113,0.15)] focus:border-red-400 hover:border-red-300',
          className
        )}
        {...props}
      />
      {error && <p className="text-xs text-red-500">{error}</p>}
    </div>
  )
})

Textarea.displayName = 'Textarea'
