'use client'

import { cn } from '@/lib/utils/cn'
import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { useAppStore } from '@/lib/store/useAppStore'
import { signOut } from '@/lib/firebase/auth'
import { Avatar } from '@/components/ui/Avatar'
import { ChevronLeft, LogOut } from 'lucide-react'

const NAV = [
  { label: 'Dashboard',      href: '/dashboard',       emoji: '🏠' },
  { label: 'Notes Hub',      href: '/notes-hub',       emoji: '📚' },
  { label: 'Study Planner',  href: '/study-planner',   emoji: '📅' },
  { label: 'Leaderboard',    href: '/leaderboard',     emoji: '🏆' },
  { label: 'Community',      href: '/community',       emoji: '💬' },
  { label: 'Flashcards',     href: '/flashcards',      emoji: '🗂️' },
  { label: 'Quiz',           href: '/quiz',            emoji: '🎯' },
  { label: 'AI Assistant',   href: '/ai-assistant',    emoji: '✨' },
  { label: 'Settings',       href: '/settings',        emoji: '⚙️' },
]

export function Sidebar() {
  const pathname = usePathname()
  const { user, sidebarCollapsed, toggleSidebar } = useAppStore()

  return (
    <aside
      className={cn(
        'flex flex-col h-screen bg-neutral-100 border-r border-neutral-100 transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] shrink-0',
        sidebarCollapsed ? 'w-20' : 'w-[240px]'
      )}
    >
      {/* Logo */}
      <div className={cn(
        'flex items-center gap-3 px-5 py-6 border-b border-neutral-100',
        sidebarCollapsed && 'justify-center px-2'
      )}>
        <div className="w-10 h-10 rounded-2xl bg-white border border-neutral-200 flex items-center justify-center shrink-0 shadow-sm">
          <span className="text-xl">🐝</span>
        </div>
        {!sidebarCollapsed && (
          <span className="font-serif text-xl text-neutral-900 tracking-tight italic">HelpHive</span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
        {NAV.map((item) => {
          const active = pathname === item.href || pathname?.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200',
                active
                  ? 'bg-white text-neutral-900 shadow-sm scale-[1.02] border border-neutral-200'
                  : 'text-neutral-600 hover:bg-white hover:text-neutral-900 hover:scale-[1.02]',
                sidebarCollapsed && 'justify-center px-2 scale-100 hover:scale-110'
              )}
              title={sidebarCollapsed ? item.label : undefined}
            >
              <span className="text-lg shrink-0">{item.emoji}</span>
              {!sidebarCollapsed && <span>{item.label}</span>}
            </Link>
          )
        })}
      </nav>

      {/* Footer */}
      <div className={cn(
        'border-t border-neutral-100 p-4 bg-neutral-50/50',
        sidebarCollapsed && 'flex flex-col items-center'
      )}>
        {!sidebarCollapsed && user && (
          <div className="flex items-center gap-3 mb-4 px-2">
            <Avatar name={user.displayName || 'User'} size="sm" />
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-neutral-900 truncate">{user.displayName}</p>
              <p className="text-xs text-neutral-400 capitalize font-medium">{user.role}</p>
            </div>
          </div>
        )}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleSidebar}
            className="p-2.5 rounded-2xl bg-neutral-100 border border-neutral-100 hover:border-primary hover:text-primary transition-all shadow-sm cursor-pointer flex-1 flex items-center justify-center group"
            title={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <ChevronLeft className={cn('w-4 h-4 text-neutral-400 group-hover:text-primary transition-all', sidebarCollapsed && 'rotate-180')} />
          </button>
          {!sidebarCollapsed && (
            <button
              onClick={() => signOut()}
              className="p-2.5 rounded-2xl bg-neutral-100 border border-neutral-100 hover:bg-red-50 hover:border-red-200 hover:text-red-500 transition-all shadow-sm cursor-pointer text-neutral-400"
              title="Sign out"
            >
              <LogOut className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>
    </aside>
  )
}
