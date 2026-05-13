import { formatDistanceToNow, format, isToday, isYesterday } from 'date-fns'

export function relativeTime(date: Date | number): string {
  return formatDistanceToNow(date, { addSuffix: true })
}

export function friendlyDate(date: Date | number): string {
  if (isToday(date)) return `Today at ${format(date, 'h:mm a')}`
  if (isYesterday(date)) return `Yesterday at ${format(date, 'h:mm a')}`
  return format(date, 'MMM d, yyyy')
}

export function fullDate(date: Date | number): string {
  return format(date, 'MMMM d, yyyy · h:mm a')
}

export function shortDate(date: Date | number): string {
  return format(date, 'MMM d')
}

export function formatNumber(num: number): string {
  if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`
  if (num >= 1000) return `${(num / 1000).toFixed(1)}K`
  return num.toLocaleString()
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) return `${minutes}m`
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function getGreeting(): string {
  const hour = new Date().getHours()
  if (hour < 12) return 'Rise and shine, scholar'
  if (hour < 18) return 'Keep pushing, you got this'
  return 'Focus time'
}
