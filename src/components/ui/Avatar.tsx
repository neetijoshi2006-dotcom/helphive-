import { cn } from '@/lib/utils/cn'

interface AvatarProps {
  name: string
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  const initials = name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
  
  // Pick a random pastel color based on the name
  const colors = [
    'from-primary-300 to-primary-400',
    'from-rose-300 to-rose-400',
    'from-purple-300 to-purple-400',
    'from-fuchsia-300 to-fuchsia-400',
    'from-orange-300 to-orange-400',
  ]
  const colorIndex = name.length % colors.length
  
  return (
    <div
      className={cn(
        'rounded-[18px] bg-gradient-to-br flex items-center justify-center font-bold text-neutral-900 shadow-sm',
        colors[colorIndex],
        size === 'sm' && 'w-8 h-8 text-xs rounded-xl',
        size === 'md' && 'w-10 h-10 text-sm rounded-2xl',
        size === 'lg' && 'w-14 h-14 text-xl rounded-[20px]',
        className
      )}
    >
      {initials}
    </div>
  )
}
